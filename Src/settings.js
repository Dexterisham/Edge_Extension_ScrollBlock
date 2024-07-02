document.addEventListener("DOMContentLoaded", function () {
  const savedUrlList = document.getElementById("saved-url-list");

  // Load saved URLs and their time limits from storage
  chrome.storage.local.get({ savedURLs: [], timeLimits: {} }, function (result) {
    const savedURLs = result.savedURLs;
    const timeLimits = result.timeLimits || {};

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
      timeInput.style.width = "150px";

      // Create delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.addEventListener("click", function () {
        deleteURL(index);
      });

      // Save time limit when input is changed
      timeInput.addEventListener("change", function () {
        saveTimeLimit(url, timeInput.value);
      });

      const buttonWrapper = document.createElement("div");
      buttonWrapper.appendChild(timeInput);
      buttonWrapper.appendChild(deleteButton);
      listItem.appendChild(urlText);
      listItem.appendChild(buttonWrapper);

      savedUrlList.appendChild(listItem);
    });

    console.log("Saved URLs:", savedURLs);
  });

  function deleteURL(index) {
    chrome.storage.local.get({ savedURLs: [], timeLimits: {} }, function (result) {
      const savedURLs = result.savedURLs;
      const timeLimits = result.timeLimits || {};

      const url = savedURLs[index];
      delete timeLimits[url];
      savedURLs.splice(index, 1); // Remove URL at the specified index

      chrome.storage.local.set({ savedURLs: savedURLs, timeLimits: timeLimits }, function () {
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
});
