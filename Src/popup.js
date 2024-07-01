document.addEventListener("DOMContentLoaded", function () {
  const urlDisplay = document.getElementById("url-display");
  const saveButton = document.getElementById("save-button");
  const settingsButton = document.getElementById("settings-button");

  // Display current tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) {
      var url = tabs[0].url;
      urlDisplay.textContent = url;
    } else {
      urlDisplay.textContent = "No tab found";
    }
  });

  // Save button click event handler
  saveButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        var url = tabs[0].url;
        saveURL(url);
      }
    });
  });

  // Function to save URL to local storage
  function saveURL(url) {
    chrome.storage.local.get({ savedURLs: [] }, function (result) {
      var savedURLs = result.savedURLs;
      savedURLs.push(url);
      chrome.storage.local.set({ savedURLs: savedURLs }, function () {
        console.log("URL saved:", url);
        // Optionally notify user or update UI
      });
    });
  }

  // Add event listener to the save button
document.getElementById("save-button").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) {
      saveURL(tabs[0].url);
    }
  });
});

  // Settings button click event handler
  settingsButton.addEventListener("click", function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("Src/Settings.html") });
  });
});
