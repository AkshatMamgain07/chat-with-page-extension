// background.js
// This is the extension's "brain" that runs in the background.
// Day 1 job: make the toolbar icon open the side panel.

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("[Chat with Page] setPanelBehavior error:", error));

// Later (Day 5+) this file will also handle:
// - generating a unique session id per tab
// - sending scraped page text to the backend
// - cleaning up sessions when a tab closes

chrome.runtime.onInstalled.addListener(() => {
  console.log("[Chat with Page] Extension installed.");
});
