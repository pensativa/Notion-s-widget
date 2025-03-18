const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const focusBtn = document.getElementById('focus');
const pauseShortBtn = document.getElementById('short-pause');
const pauseLongBtn = document.getElementById('long-pause');

const focusTimeInput = document.getElementById('focus-time');
const shortBreakInput = document.getElementById('short-break');
const longBreakInput = document.getElementById('long-break');
const cycleCountInput = document.getElementById('cycle-count');
const endSoundSelect = document.getElementById('end-sound');

const showSettings = document.getElementById('setting-btn');
const settingsPanel = document.querySelector('.settings');

showSettings.onclick = () => settingsPanel.classList.toggle('show');
document.querySelector('.settings__close').onclick = () => settingsPanel.classList.remove('show');

const circle = document.querySelector('.progress-ring__circle');
const CIRCUMFERENCE = 2 * Math.PI * 110;
circle.style.strokeDasharray = CIRCUMFERENCE;

let countdown;
let isRunning = false;
let totalTime;
let timeRemaining = 25 * 60;
let currentCycle = 0;
let isFocusPhase = true;
let displayTime = 25 * 60;

// Cashing settings
let settings = JSON.parse(localStorage.getItem('pomodoro-settings')) || {
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15,
  cycleCount: 4,
  endSound: 'bip'
};

let state = JSON.parse(localStorage.getItem('pomodoro-state')) || {
  timeRemaining: settings.focusTime * 60,
  isRunning: false,
  currentCycle: 0,
  isFocusPhase: true,
};

// Loding settings
function loadSettings() {
  focusTimeInput.value = settings.focusTime;
  shortBreakInput.value = settings.shortBreak;
  longBreakInput.value = settings.longBreak;
  cycleCountInput.value = settings.cycleCount;
  endSoundSelect.value = settings.endSound;
}

function saveSettings() {
  settings = {
    focusTime: +focusTimeInput.value,
    shortBreak: +shortBreakInput.value,
    longBreak: +longBreakInput.value,
    cycleCount: +cycleCountInput.value,
    endSound: endSoundSelect.value
  };
  localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
}

function updateDisplay(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateProgress(percent) {
    const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
    circle.style.strokeDashoffset = offset;
}

// Start timer
function startTimer(duration) {
  if (isRunning) return;

  totalTime = duration;
  timeRemaining = duration;
  isRunning = true;
  pauseBtn.removeAttribute('disabled');
  resetBtn.removeAttribute('disabled');

  countdown = setInterval(() => {
    timeRemaining--;
    updateDisplay(timeRemaining);
    updateProgress((1 - timeRemaining / totalTime) * 100);

    if (timeRemaining <= 0) {
      clearInterval(countdown);
      isRunning = false;
      playEndSound();
      nextPhase();
    }
  }, 1000);
}

// Phase toggle
function nextPhase() {
  if (isFocusPhase) {
    currentCycle++;
    if (currentCycle % settings.cycleCount === 0) {
      isFocusPhase = false;
      startTimer(settings.longBreak * 60);
    } else {
      isFocusPhase = false;
      startTimer(settings.shortBreak * 60);
    }
  } else {
    isFocusPhase = true;
    startTimer(settings.focusTime * 60);
  }
}

// Play sound
function playEndSound() {
  const audio = document.getElementById(`audio-${settings.endSound}`);
  audio.play();
}

// Buttons actions
startBtn.onclick = () => {
  saveSettings();
  if (isFocusPhase) {
    startTimer(settings.focusTime * 60);
  } else {
    nextPhase();
  }
};

pauseBtn.onclick = () => {
  clearInterval(countdown);
  isRunning = false;
};

resetBtn.onclick = () => {
  clearInterval(countdown);
  isRunning = false;
  currentCycle = 0;
  isFocusPhase = true;
  updateProgress(0);
  updateDisplay(displayTime);
  pauseBtn.setAttribute('disabled', 'disabled');
  resetBtn.setAttribute('disabled', 'disabled');
};

focusBtn.onclick = () => {
    displayTime = settings.focusTime * 60;
    resetBtn.click();
    isFocusPhase = true;
    startTimer(settings.focusTime * 60);
}
pauseShortBtn.onclick = () => {
    displayTime = settings.shortBreak * 60;
    resetBtn.click();
    isFocusPhase = false;
    startTimer(settings.shortBreak * 60);
}
pauseLongBtn.onclick = () => {
    displayTime = settings.longBreak * 60;
    resetBtn.click();
    isFocusPhase = false;
    startTimer(settings.longBreak * 60);
}

// Initialization pomodoro
function init() {
    loadSettings();
    updateDisplay(timeRemaining);
    updateProgress((1 - timeRemaining / totalTime) * 100);
}

init();
