// Inject global styles for highlight + floating island
(function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .my-msg-highlight {
      outline: 3px solid #4f46e5;
      border-radius: 8px;
      transition: outline 0.3s ease-in-out;
    }

    #cgn-root {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 999999;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        sans-serif;
    }

    #cgn-toggle {
      background: #111827;
      color: #e5e7eb;
      border-radius: 999px;
      padding: 8px 12px;
      font-size: 12px;
      border: 1px solid #374151;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
      transition: background 0.2s ease, transform 0.15s ease,
        box-shadow 0.2s ease;
    }

    #cgn-toggle:hover {
      background: #1f2937;
      transform: translateY(-1px);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.5);
    }

    #cgn-toggle-icon {
      width: 14px;
      height: 14px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 30%, #22c55e, #16a34a);
    }

    #cgn-panel {
      margin-top: 8px;
      width: 340px;
      max-height: 480px;
      background: rgba(15, 23, 42, 0.98);
      border-radius: 14px;
      border: 1px solid rgba(148, 163, 184, 0.4);
      padding: 10px 12px;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(10px);
      color: #e5e7eb;
      display: none;
    }

    #cgn-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    #cgn-title {
      font-size: 13px;
      font-weight: 600;
    }

    #cgn-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .cgn-icon-btn {
      border: none;
      background: #020617;
      color: #9ca3af;
      border-radius: 999px;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      cursor: pointer;
      border: 1px solid #1e293b;
      transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
    }

    .cgn-icon-btn:hover {
      background: #1f2937;
      color: #e5e7eb;
      transform: translateY(-1px);
    }

    #cgn-search {
      width: 100%;
      padding: 6px 8px;
      font-size: 12px;
      border-radius: 8px;
      border: 1px solid #1f2937;
      background: #020617;
      color: #e5e7eb;
      outline: none;
      margin-bottom: 6px;
    }

    #cgn-search:focus {
      border-color: #4f46e5;
    }

    #cgn-status {
      font-size: 11px;
      margin-bottom: 6px;
      color: #9ca3af;
    }

    #cgn-list {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 380px;
      overflow-y: auto;
    }

    #cgn-list li {
      margin-bottom: 6px;
    }

    .cgn-msg-item {
      border-radius: 8px;
      padding: 8px 9px;
      cursor: pointer;
      background: #020617;
      border: 1px solid #1e293b;
      font-size: 12px;
      line-height: 1.4;
      transition: all 0.18s ease;
    }

    .cgn-msg-item:hover {
      background: #111827;
      border-color: #4f46e5;
      transform: translateY(-1px);
    }

    .cgn-msg-index {
      font-weight: 600;
      margin-right: 6px;
      color: #818cf8;
    }

    .cgn-msg-preview {
      color: #e5e7eb;
    }

    #cgn-list::-webkit-scrollbar {
      width: 6px;
    }

    #cgn-list::-webkit-scrollbar-thumb {
      background: #1f2937;
      border-radius: 4px;
    }

    #cgn-list::-webkit-scrollbar-thumb:hover {
      background: #374151;
    }
  `;
  document.documentElement.appendChild(style);
})();

// Scan all user messages on the page
function scanUserMessages() {
  const userNodes = document.querySelectorAll(
    '[data-message-author-role="user"]'
  );

  const messages = [];
  userNodes.forEach((node, index) => {
    const id = `cgn-user-msg-${index}`;
    node.dataset.cgnMsgId = id;

    const text = node.innerText || "";
    const normalized = text.trim().replace(/\s+/g, " ");
    const preview =
      normalized.length > 120 ? normalized.slice(0, 120) + "…" : normalized;

    messages.push({
      id,
      index: index + 1,
      preview,
    });
  });

  return messages;
}

let allMessages = [];
let panelOpen = false;

// Create floating island UI
function createFloatingIsland() {
  if (document.getElementById("cgn-root")) return; // avoid duplicates

  const root = document.createElement("div");
  root.id = "cgn-root";

  root.innerHTML = `
    <button id="cgn-toggle" title="My ChatGPT messages">
      <div id="cgn-toggle-icon"></div>
      <span>My messages</span>
    </button>
    <div id="cgn-panel">
      <div id="cgn-panel-header">
        <div id="cgn-title">My ChatGPT Messages</div>
        <div id="cgn-actions">
          <button id="cgn-refresh" class="cgn-icon-btn" title="Rescan messages">↻</button>
          <button id="cgn-close" class="cgn-icon-btn" title="Hide panel">✕</button>
        </div>
      </div>
      <input id="cgn-search" type="text" placeholder="Search in your messages..." />
      <div id="cgn-status">Scanning…</div>
      <ul id="cgn-list"></ul>
    </div>
  `;

  document.body.appendChild(root);

  const toggleBtn = document.getElementById("cgn-toggle");
  const panel = document.getElementById("cgn-panel");
  const closeBtn = document.getElementById("cgn-close");
  const refreshBtn = document.getElementById("cgn-refresh");
  const searchInput = document.getElementById("cgn-search");
  const statusEl = document.getElementById("cgn-status");

  function renderList(messages) {
    const listEl = document.getElementById("cgn-list");
    listEl.innerHTML = "";

    if (!messages.length) {
      listEl.innerHTML = `<li style="font-size:12px;color:#9ca3af;">No messages found.</li>`;
      return;
    }

    messages.forEach((msg) => {
      const li = document.createElement("li");
      const div = document.createElement("div");
      div.className = "cgn-msg-item";
      div.dataset.id = msg.id;

      div.innerHTML = `
        <span class="cgn-msg-index">#${msg.index}</span>
        <span class="cgn-msg-preview">${escapeHtml(msg.preview)}</span>
      `;

      div.addEventListener("click", () => {
        const el = document.querySelector(`[data-cgn-msg-id="${msg.id}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("my-msg-highlight");
          setTimeout(() => el.classList.remove("my-msg-highlight"), 2000);
        }
      });

      li.appendChild(div);
      listEl.appendChild(li);
    });
  }

  function rescan() {
    statusEl.textContent = "Scanning…";
    allMessages = scanUserMessages();
    statusEl.textContent = `${allMessages.length} messages found.`;
    renderList(allMessages);
  }

  toggleBtn.addEventListener("click", () => {
    panelOpen = !panelOpen;
    panel.style.display = panelOpen ? "block" : "none";
    if (panelOpen && allMessages.length === 0) {
      rescan();
    }
  });

  closeBtn.addEventListener("click", () => {
    panelOpen = false;
    panel.style.display = "none";
  });

  refreshBtn.addEventListener("click", () => {
    rescan();
  });

  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allMessages.filter((m) =>
      m.preview.toLowerCase().includes(q)
    );
    renderList(filtered);
  });

  // Initial lazy scan when injected
  rescan();
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Wait for the app shell to be there, then inject
function init() {
  // Basic guard: only inject on pages that look like ChatGPT chat
  createFloatingIsland();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
