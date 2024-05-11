function getCurrentTabUrl() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var url = tabs[0].url;
    document.getElementById("url-display").innerHTML = url;
  });
}

// Call the function to display the URL on page load (optional)
window.onload = function() {
  getCurrentTabUrl();
};


