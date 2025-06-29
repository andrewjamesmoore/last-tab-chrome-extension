let lastTabId = null;
let currentTabId = null;

// Reusable function to switch to the last tab.
async function switchToLastTab() {
  if (lastTabId === null) {
    console.warn("No last tab to switch to.");
    return;
  }
  try {
    await chrome.tabs.update(lastTabId, { active: true });
  } catch (error) {
    console.warn(`Could not switch to tab ${lastTabId}. It may have been closed.`);
  }
}

// Update last and current tab IDs when the active tab changes.
chrome.tabs.onActivated.addListener(({ tabId }) => {
  if (currentTabId !== null && currentTabId !== tabId) {
    lastTabId = currentTabId;
  }
  currentTabId = tabId;
});

// Listen for the command from the keyboard shortcut.
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "switch-to-last-tab") {
    await switchToLastTab();
  }
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "switchToLastTab") {
    switchToLastTab().then(() => {
      sendResponse({ status: "success" });
    });
    // Return true to indicate you wish to send a response asynchronously
    return true;
  }
});

// Reset lastTabId if the tab associated with it is closed.
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === lastTabId) {
    lastTabId = null;
  }
});
