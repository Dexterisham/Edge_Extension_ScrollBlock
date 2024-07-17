document.addEventListener("DOMContentLoaded", function () {
  const urlDisplay = document.getElementById("url-display");
  const saveButton = document.getElementById("save-button");
  const settingsButton = document.getElementById("settings-button");
  const timerInput = document.createElement("input");
  timerInput.type = "number";
  timerInput.placeholder = "Set time limit (minutes)";
  timerInput.className = "form-control mt-2";

  // Display current tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) {
      var url = new URL(tabs[0].url);
      var domain = url.origin.replace(/^https?:\/\//, '');
      urlDisplay.textContent = domain;

      // Add timer input after URL display
      urlDisplay.parentNode.insertBefore(timerInput, urlDisplay.nextSibling);

      // Save button click event handler
      saveButton.addEventListener("click", function () {
        const timeLimit = timerInput.value;
        if (!timeLimit || isNaN(timeLimit) || timeLimit <= 0) {
          alert("Please enter a valid time limit in minutes.");
          return;
        }
        saveURL(domain, tabs[0].id, timeLimit);
      });
    } else {
      urlDisplay.textContent = "No tab found";
    }
  });

  // Function to save URL to local storage
  function saveURL(url, tabId, timeLimit) {
    chrome.storage.local.get({ savedURLs: [], timeLimits: {} }, function (result) {
      var savedURLs = result.savedURLs;
      var timeLimits = result.timeLimits;
      if (!savedURLs.includes(url)) {
        savedURLs.push(url);
        timeLimits[url] = parseInt(timeLimit);
        chrome.storage.local.set({ savedURLs: savedURLs, timeLimits: timeLimits }, function () {
          console.log("URL saved:", url, "with time limit:", timeLimit, "minutes");
          // Send a message to the content script to start the timer
          chrome.tabs.sendMessage(tabId, { action: "startTimer", url: url, timeLimit: timeLimit });
        });
      } else {
        console.log("URL already saved:", url);
      }
    });
  }

  // Settings button click event handler
  settingsButton.addEventListener("click", function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("Src/Settings.html") });
  });
});