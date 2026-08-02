// sidepanel.js
// Day 3: polished chat UX — typing indicator, disabled input while "thinking",
// clearer error states. Still using placeholder responses — real backend is Day 4-5.

const chatWindow = document.getElementById("chat-window");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return div;
}

function showTypingIndicator() {
  const div = document.createElement("div");
  div.className = "message bot typing";
  div.innerHTML = "<span class='dot'></span><span class='dot'></span><span class='dot'></span>";
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return div;
}

function setInputEnabled(enabled) {
  input.disabled = !enabled;
  sendBtn.disabled = !enabled;
  sendBtn.textContent = enabled ? "Send" : "...";
}

function handleSend() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";
  setInputEnabled(false);

  const typingEl = showTypingIndicator();

  // TEMPORARY placeholder logic — will be replaced with a real fetch() call
  // to the FastAPI backend on Day 4-5.
  setTimeout(() => {
    typingEl.remove();
    addMessage(
      "This is a placeholder reply — the backend isn't connected yet. Once it is, I'll answer using this page's real content.",
      "bot"
    );
    setInputEnabled(true);
    input.focus();
  }, 700);
}

sendBtn.addEventListener("click", handleSend);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !input.disabled) handleSend();
});

// --- Dev tool: verify Readability extraction is working ---
const testBtn = document.getElementById("test-extract-btn");

testBtn.addEventListener("click", async () => {
  testBtn.disabled = true;
  addMessage("Extracting this page's text...", "bot");

  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!activeTab) {
      addMessage("Couldn't find the active tab.", "bot");
      return;
    }

    chrome.tabs.sendMessage(activeTab.id, { type: "GET_PAGE_TEXT" }, (response) => {
      testBtn.disabled = false;

      if (chrome.runtime.lastError) {
        addMessage(
          `Error: ${chrome.runtime.lastError.message}\n(This page may block content scripts, e.g. chrome:// pages — try refreshing the tab after reloading the extension.)`,
          "bot"
        );
        return;
      }
      if (!response) {
        addMessage("No response from content script.", "bot");
        return;
      }

      const preview = response.text.slice(0, 300);
      addMessage(
        `✅ Extracted via "${response.extractionMethod}"\n` +
          `Title: ${response.title}\n` +
          `Length: ${response.text.length} characters\n\n` +
          `Preview:\n${preview}...`,
        "bot"
      );
    });
  } catch (err) {
    testBtn.disabled = false;
    addMessage(`Unexpected error: ${err.message}`, "bot");
  }
});
