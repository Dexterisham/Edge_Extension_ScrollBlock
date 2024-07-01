document.addEventListener("DOMContentLoaded", function () {
    const savedUrlList = document.getElementById("saved-url-list");
  
    // Load saved URLs from storage
    chrome.storage.local.get({ savedURLs: [] }, function (result) {
      const savedURLs = result.savedURLs;
      savedURLs.forEach(function (url, index) {
        const listItem = document.createElement("li");
        listItem.textContent = url;
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
  
        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.addEventListener("click", function () {
          deleteURL(index);
        });
  
        // Append delete button to list item
        const buttonWrapper = document.createElement("div");
        buttonWrapper.appendChild(deleteButton);
        listItem.appendChild(buttonWrapper);
  
        // Append list item to list
        savedUrlList.appendChild(listItem);
      });
  
      // Log the URLs to the console for verification
      console.log("Saved URLs:", savedURLs);
    });
  });
  
  // Function to delete URL from local storage
  function deleteURL(index) {
    chrome.storage.local.get({ savedURLs: [] }, function (result) {
      const savedURLs = result.savedURLs;
      savedURLs.splice(index, 1); // Remove URL at the specified index
      chrome.storage.local.set({ savedURLs: savedURLs }, function () {
        console.log("URL deleted");
        location.reload(); // Reload the page to update the displayed list
      });
    });
  }
  