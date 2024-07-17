function initializeTimer() {
  const currentURL = window.location.origin.replace(/^https?:\/\//, '');
  chrome.storage.local.get(['savedURLs', 'timers', 'timeLimits'], function(data) {
      const savedURLs = data.savedURLs || [];
      const timers = data.timers || {};
      const timeLimits = data.timeLimits || {};

      if (savedURLs.includes(currentURL)) {
          startTimerForURL(currentURL, timers[currentURL], timeLimits[currentURL]);
      }
  });
}

function startTimerForURL(url, timerData, timeLimit) {
  const now = Date.now();
  const oneDayInMs = 24 * 60 * 60 * 1000;

  console.log("Starting timer for URL:", url);
  console.log("Existing timerData:", timerData);

  let timeLeft;

  if (timerData && now - timerData.lastUpdated < oneDayInMs) {
      timeLeft = timerData.timeLeft;
      console.log("Using existing time left:", timeLeft);
  } else {
      timeLeft = (timeLimit || 5) * 60; // Use stored time limit or default to 5 minutes
      console.log("Using new time limit:", timeLeft);
  }

  if (timeLeft <= 0) {
      console.log("Time is up, blurring site");
      blurSite();
      return;
  }

  console.log("Starting timer with timeLeft:", timeLeft);
  startTimer(url, timeLeft);
}

function startTimer(url, timeLeft) {
  const timerDisplay = document.getElementById('timer-display');
  if (!timerDisplay) {
      injectTimerDisplay();
  }
  
  updateTimerDisplay(timeLeft);

  const intervalId = setInterval(() => {
      timeLeft--;
      updateTimerDisplay(timeLeft);
      saveTimerState(url, timeLeft);
      if (timeLeft <= 0) {
          clearInterval(intervalId);
          blurSite();
      }
  }, 1000);
}

function updateTimerDisplay(timeLeft) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('timer-display').textContent = display;
}

function saveTimerState(url, timeLeft) {
  chrome.storage.local.get({ timers: {} }, function(data) {
      const timers = data.timers;
      timers[url] = {
          timeLeft: timeLeft,
          lastUpdated: Date.now()
      };
      chrome.storage.local.set({ timers: timers });
  });
}

function injectTimerDisplay() {
  const timerDiv = document.createElement('div');
  timerDiv.innerHTML = `
      <div id="site-timer" style="position: fixed; top: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.7); color: white; padding: 10px; border-radius: 5px; z-index: 9998;">
          <div>Time Remaining</div>
          <div id="timer-display" style="font-size: 24px; font-weight: bold;"></div>
      </div>
  `;
  document.body.appendChild(timerDiv);
}

  
  // Listen for messages from the popup script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "startTimer") {
      startTimerForURL(request.url);
    }
  });
  
  initializeTimer();