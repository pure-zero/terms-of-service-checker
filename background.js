function getHtmlContent() {
  let htmlContent = document.body.outerHTML;
  chrome.runtime.sendMessage({ html: htmlContent });
}

// Listen for the message from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message, "recieved message");
  if (message.action === "getHtml") {
    // Fetch the currently active tab and execute the script on it
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        if (activeTab.id) {
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: getHtmlContent,
          });
        } else {
          console.error("Active tab ID is undefined");
        }
      } else {
        console.error("No active tab found");
      }
    });
  }
  if (message.action === 'notification') {
    console.log("notification message recieved");
    chrome.notifications.create('', {
        title: 'Policy Page detected',
        message: 'You might want to get a summary on this',
        iconUrl: '/icon.png',
        type: 'basic'
    });
  }
});
