const storage = chrome.storage.session;

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const { currentTabId } = await storage.get("currentTabId");

  if (currentTabId) {
    await storage.set({ lastTabId: currentTabId });
  }
  await storage.set({ currentTabId: tabId });
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "switch-to-last-tab") {
    const { lastTabId } = await storage.get("lastTabId");

    if (lastTabId) {
      try {
        await chrome.tabs.update(lastTabId, { active: true });
      } catch (error) {
        console.warn(
          `Could not switch to tab ${lastTabId}. It may have been closed.`
        );
      }
    }
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const { lastTabId, currentTabId } = await storage.get([
    "lastTabId",
    "currentTabId",
  ]);

  if (tabId === lastTabId) {
    await storage.remove("lastTabId");
  }
  if (tabId === currentTabId) {
    await storage.remove("currentTabId");
  }
});
