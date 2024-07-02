chrome.storage.local.get(["savedURLs", "timeLimits"], function (data) {
    const savedURLs = data.savedURLs || [];
    const timeLimits = data.timeLimits || {};
    const currentSite = window.location.origin.replace(/^https?:\/\//, '');
  
    savedURLs.forEach((site) => {
      if (currentSite.includes(site)) {
        const timeLimit = timeLimits[site] ? parseInt(timeLimits[site]) * 60 : null; // Convert to seconds
        if (timeLimit) {
          injectTimer(timeLimit);
        }
      }
    });
  });
  
  function injectTimer(timeLimit) {
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
  
    let seconds = 0;
    const intervalId = setInterval(() => {
      seconds++;
      timerDiv.innerText = `Time on site: ${seconds}s`;
  
      if (seconds >= timeLimit) {
        clearInterval(intervalId);
        blurTab();
      }
    }, 1000);
  }
  
  function blurTab() {
    const blurOverlay = document.createElement('div');
    blurOverlay.style.position = 'fixed';
    blurOverlay.style.top = '0';
    blurOverlay.style.left = '0';
    blurOverlay.style.width = '100%';
    blurOverlay.style.height = '100%';
    blurOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    blurOverlay.style.zIndex = '9999';
    blurOverlay.style.display = 'flex';
    blurOverlay.style.justifyContent = 'center';
    blurOverlay.style.alignItems = 'center';
    blurOverlay.style.fontSize = '24px';
    blurOverlay.style.color = 'black';
    blurOverlay.innerText = 'Time limit reached. Please take a break.';
  
    document.body.appendChild(blurOverlay);
  
    // Enlarge the timer and move it to the center of the screen
    const timerDiv = document.getElementById('site-timer');
    if (timerDiv) {
      timerDiv.style.position = 'fixed';
      timerDiv.style.top = '50%';
      timerDiv.style.left = '50%';
      timerDiv.style.transform = 'translate(-50%, -50%)';
      timerDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      timerDiv.style.fontSize = '36px';
      timerDiv.style.padding = '20px';
      timerDiv.style.borderRadius = '10px';
    }
  }
  