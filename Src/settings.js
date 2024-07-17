document.addEventListener("DOMContentLoaded", function () {
  const savedUrlList = document.getElementById("saved-url-list");

  // Load saved URLs, their time limits, and current timers from storage
  chrome.storage.local.get({ savedURLs: [], timeLimits: {}, timers: {} }, function (result) {
    const savedURLs = result.savedURLs;
    const timeLimits = result.timeLimits || {};
    const timers = result.timers || {};

    savedURLs.forEach(function (url, index) {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item d-flex justify-content-between align-items-center";

      const urlText = document.createElement("span");
      urlText.textContent = url;

      const timeInput = document.createElement("input");
      timeInput.type = "number";
      timeInput.placeholder = "Time limit (minutes)";
      timeInput.value = timeLimits[url] || '';
      timeInput.className = "form-control me-2";
      timeInput.style.width = "100px";

      // Display time left
      const timeLeftSpan = document.createElement("span");
      const timeLeft = timers[url] ? Math.max(0, Math.floor(timers[url].timeLeft / 60)) : 0;
      timeLeftSpan.textContent = `Time left: ${timeLeft} min`;
      timeLeftSpan.className = "me-2";

      // Create delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.addEventListener("click", function () {
        deleteURL(index);
      });

      // Create reset timer button
      const resetButton = document.createElement("button");
      resetButton.textContent = "Reset Timer";
      resetButton.className = "btn btn-warning btn-sm ms-2";
      resetButton.addEventListener("click", function () {
        resetTimer(url);
      });

      // Save time limit when input is changed
      timeInput.addEventListener("change", function () {
        saveTimeLimit(url, timeInput.value);
      });

      const buttonWrapper = document.createElement("div");
      buttonWrapper.appendChild(timeLeftSpan);
      buttonWrapper.appendChild(timeInput);
      buttonWrapper.appendChild(deleteButton);
      buttonWrapper.appendChild(resetButton);
      listItem.appendChild(urlText);
      listItem.appendChild(buttonWrapper);

      savedUrlList.appendChild(listItem);
    });

    console.log("Saved URLs:", savedURLs);
  });

  function deleteURL(index) {
    chrome.storage.local.get({ savedURLs: [], timeLimits: {}, timers: {} }, function (result) {
      const savedURLs = result.savedURLs;
      const timeLimits = result.timeLimits || {};
      const timers = result.timers || {};

      const url = savedURLs[index];
      delete timeLimits[url];
      delete timers[url];
      savedURLs.splice(index, 1); // Remove URL at the specified index

      chrome.storage.local.set({ savedURLs: savedURLs, timeLimits: timeLimits, timers: timers }, function () {
        console.log("URL deleted");
        location.reload(); // Reload the page to update the displayed list
      });
    });
  }

  function saveTimeLimit(url, timeLimit) {
    chrome.storage.local.get({ timeLimits: {} }, function (result) {
      const timeLimits = result.timeLimits || {};
      timeLimits[url] = timeLimit;

      chrome.storage.local.set({ timeLimits: timeLimits }, function () {
        console.log("Time limit saved for URL:", url, "Time limit:", timeLimit);
      });
    });
  }

  function resetTimer(url) {
    chrome.storage.local.get({ timeLimits: {}, timers: {} }, function (result) {
      const timeLimits = result.timeLimits || {};
      const timers = result.timers || {};
      const timeLimit = timeLimits[url];

      if (timeLimit) {
        timers[url] = {
          timeLeft: timeLimit * 60, // Convert minutes to seconds
          lastUpdated: Date.now()
        };

        chrome.storage.local.set({ timers: timers }, function () {
          console.log("Timer reset for URL:", url);
          alert("Timer has been reset for " + url);
          location.reload(); // Reload the page to update the displayed time left
        });
      } else {
        console.log("No time limit set for URL:", url);
        alert("No time limit set for " + url);
      }
    });
  }
});