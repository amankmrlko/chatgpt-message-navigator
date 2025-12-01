// Small helper to inject a highlight style
(function injectHighlightStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .my-msg-highlight {
      outline: 3px solid #4f46e5;
      border-radius: 8px;
      transition: outline 0.3s ease-in-out;
    }
  `;
  document.documentElement.appendChild(style);
})();

// Find all user messages on the page
function scanUserMessages() {
  // ChatGPT messages from user usually have this attribute
  const userNodes = document.querySelectorAll(
    '[data-message-author-role="user"]'
  );

  const messages = [];
  userNodes.forEach((node, index) => {
    const id = `user-msg-${index}`;
    node.dataset.myMsgId = id;

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

// Listen to messages from the popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_USER_MESSAGES") {
    const messages = scanUserMessages();
    sendResponse({ messages });
    return true;
  }

  if (msg.type === "SCROLL_TO_MESSAGE") {
    const { id } = msg;
    const el = document.querySelector(`[data-my-msg-id="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("my-msg-highlight");
      setTimeout(() => el.classList.remove("my-msg-highlight"), 2000);
      sendResponse({ ok: true });
    } else {
      sendResponse({ ok: false });
    }
    return true;
  }
});
