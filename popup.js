document.addEventListener("DOMContentLoaded", () => {
  const switchButton = document.getElementById("switch-btn");

  switchButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "switchToLastTab" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else if (response && response.status) {
        window.close();
      }
    });
  });
});
