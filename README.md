# ChatGPT Message Navigator

A simple Chrome extension that helps you quickly navigate **your own messages** inside long ChatGPT conversations.  
If you scroll too much, lose your older questions, or struggle to find what you wrote last week — this fixes that.

---

## ✨ Features

- Shows a clean list of **only your messages** from the current ChatGPT chat  
- Clicking a message scrolls directly to it and highlights it  
- Search across all your messages  
- Dark, minimal UI  
- Works on both:
  - chat.openai.com  
  - chatgpt.com  

This is a client-side extension. No data is collected, stored, or sent anywhere.

---

## 🚀 Installation (Chrome)

Chrome does **not** allow direct `.crx` installs anymore, so here’s the correct way:

1. **Download this repo**  
   Click the green “Code” button → **Download ZIP**

2. **Extract the ZIP**

3. Open Chrome and go to:  chrome://extensions/

4. Enable **Developer mode** (top-right toggle)

5. Click **Load unpacked**

6. Select the extracted folder: chatgpt-message-navigator/


That’s it. The extension will appear in your Chrome toolbar.

---

## 🧩 How it Works (Short & Clear)

- The content script scans the page for ChatGPT messages authored by **you**  
- Each message gets a small unique tag  
- The popup UI reads them and shows a searchable list  
- Clicking an item scrolls the page to that message and highlights it

---

## 🛠 Permissions Used

- `activeTab` — to interact with the current page  
- `scripting` — to send and receive data with the content script  
- `host_permissions` — restricted to ChatGPT domains only  

Nothing else. No analytics. No storage. No tracking.


---

## 📝 Notes

- Works only inside ChatGPT conversation pages  
- If OpenAI changes their HTML structure, message detection selectors may need small updates  
- This extension runs entirely on your machine (no backend)  

---

## 🤝 Contributing

Open a PR if you want to:  
- Add assistant-message mode  
- Export messages to JSON  
- Add tags or bookmarks  
- Improve UI  

---

## 🛡 License

MIT — free to use, modify, share.

