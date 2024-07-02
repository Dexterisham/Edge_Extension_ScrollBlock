document.addEventListener("DOMContentLoaded", function () {
  const urlDisplay = document.getElementById("url-display");
  const saveButton = document.getElementById("save-button");
  const settingsButton = document.getElementById("settings-button");

  // Display current tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) {
      var url = new URL(tabs[0].url);
      var domain = url.origin.replace(/^https?:\/\//, '');
      urlDisplay.textContent = domain;
    } else {
      urlDisplay.textContent = "No tab found";
    }

    // Save button click event handler
    saveButton.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0]) {
          var url = domain;
          saveURL(url, tabs[0].id);
        }
      });
    });
  });

  // Function to save URL to local storage
  function saveURL(url, tabId) {
    chrome.storage.local.get({ savedURLs: [] }, function (result) {
      var savedURLs = result.savedURLs;
      savedURLs.push(url);
      chrome.storage.local.set({ savedURLs: savedURLs }, function () {
        console.log("URL saved:", url);
        // Optionally notify user or update UI

        // Inject content script and start timer for the current tab
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['Src/timer/content.js']
        }, () => {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: startTimerOnCurrentTab
          });
        });
      });
    });
  }

  // Function to start timer on the current tab
  function startTimerOnCurrentTab() {
    chrome.storage.local.get("savedURLs", function (data) {
      const savedURLs = data.savedURLs || [];
      const currentSite = window.location.origin.replace(/^https?:\/\//, '');

      savedURLs.forEach((site) => {
        if (currentSite.includes(site)) {
          injectTimer();
        }
      });
    });

    function injectTimer() {
      if (document.getElementById('site-timer')) return; // Avoid multiple timers

      const timerDiv = document.createElement('div');
      timerDiv.id = 'site-timer';
      timerDiv.style.position = 'fixed';
      timerDiv.style.top = '10px';
      timerDiv.style.right = '10px';
      timerDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      timerDiv.style.color = 'white';
      timerDiv.style.padding = '10px';
      timerDiv.style.borderRadius = '5px';
      timerDiv.style.zIndex = '1000';
      document.body.appendChild(timerDiv);
      startTimer(timerDiv);
    }

    function startTimer(timerDiv) {
      let seconds = 0;
      setInterval(() => {
        seconds++;
        timerDiv.innerText = `Time on site: ${seconds}s`;
      }, 1000);
    }
  }

  // Settings button click event handler
  settingsButton.addEventListener("click", function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("Src/Settings.html") });
  });
});
