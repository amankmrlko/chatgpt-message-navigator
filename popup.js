let allMessages = [];

// Get active tab
function getActiveTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    callback(tabs[0]);
  });
}

// Render the list in the popup
function renderList(messages) {
  const listEl = document.getElementById("messages");
  listEl.innerHTML = "";

  if (!messages.length) {
    listEl.innerHTML = "<li>No messages found.</li>";
    return;
  }

  messages.forEach((msg) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    div.className = "msg-item";
    div.dataset.id = msg.id;

    div.innerHTML = `
      <span class="msg-index">#${msg.index}</span>
      <span class="msg-preview">${escapeHtml(msg.preview)}</span>
    `;

    div.addEventListener("click", () => {
      getActiveTab((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
          { type: "SCROLL_TO_MESSAGE", id: msg.id },
          (res) => {
            if (!res || !res.ok) {
              console.warn("Failed to scroll to message", msg.id);
            }
          }
        );
      });
    });

    li.appendChild(div);
    listEl.appendChild(li);
  });
}

// Simple HTML escape (to avoid weird text breaking your popup)
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Initial load: fetch messages from the page
document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("status");

  getActiveTab((tab) => {
    if (!tab || !tab.id) {
      statusEl.textContent = "No active tab.";
      return;
    }

    chrome.tabs.sendMessage(
      tab.id,
      { type: "GET_USER_MESSAGES" },
      (response) => {
        if (chrome.runtime.lastError) {
          statusEl.textContent =
            "Could not read messages. Are you on a ChatGPT chat page?";
          return;
        }

        if (!response || !response.messages) {
          statusEl.textContent = "No messages found.";
          return;
        }

        allMessages = response.messages;
        statusEl.textContent = `${allMessages.length} messages found.`;
        renderList(allMessages);
      }
    );
  });

  // Search filter
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allMessages.filter((m) =>
      m.preview.toLowerCase().includes(q)
    );
    renderList(filtered);
  });
});
