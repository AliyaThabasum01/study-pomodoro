// Time durations in seconds for each mode
const DURATIONS = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

let currentMode = "focus";
let timeLeft = DURATIONS[currentMode];
let timerInterval = null;
let sessionCount = 0;

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const sessionCountEl = document.getElementById("sessionCount");
const modeButtons = document.querySelectorAll(".mode-btn");

// Format seconds into MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
  document.title = `${formatTime(timeLeft)} - Study Pomodoro`;
}

function startTimer() {
  if (timerInterval) return; // already running

  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      handleSessionComplete();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = DURATIONS[currentMode];
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function handleSessionComplete() {
  startBtn.disabled = false;
  pauseBtn.disabled = true;

  if (currentMode === "focus") {
    sessionCount++;
    sessionCountEl.textContent = sessionCount;
  }

  // Simple alert notification
  alert(
    currentMode === "focus"
      ? "Focus session complete! Time for a break."
      : "Break's over! Back to focus."
  );

  timeLeft = DURATIONS[currentMode];
  updateDisplay();
}

function switchMode(mode) {
  currentMode = mode;
  timeLeft = DURATIONS[mode];

  modeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  resetTimer();
}

// Event listeners
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => switchMode(btn.dataset.mode));
});

// Initial render
updateDisplay();
