let lastTabId = null;
let currentTabId = null;

chrome.tabs.onActivated.addListener(({ tabId }) => {
  if (currentTabId !== null && currentTabId !== tabId) {
    lastTabId = currentTabId;
  }
  currentTabId = tabId;
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "switch-to-last-tab" && lastTabId !== null) {
    try {
      await chrome.tabs.update(lastTabId, { active: true });
    } catch (error) {
      console.warn(
        `Could not switch to tab ${lastTabId}. It may have been closed.`
      );
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === lastTabId) {
    lastTabId = null;
  }
});
