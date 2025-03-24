class PomodoroWidget {
  constructor(element) {
      this.element = element;
      this.timeDisplay = element.querySelector('#time-display');
      this.startBtn = element.querySelector('#start-btn');
      this.pauseBtn = element.querySelector('#pause-btn');
      this.resetBtn = element.querySelector('#reset-btn');
      this.focusBtn = element.querySelector('#focus');
      this.shortPauseBtn = element.querySelector('#short-pause');
      this.longPauseBtn = element.querySelector('#long-pause');
      this.saveSettingsBtn = element.querySelector('#save-settings-btn');

      // Поля для ввода пользовательских настроек
      this.focusInput = element.querySelector('#focus-time');
      this.shortBreakInput = element.querySelector('#short-break');
      this.longBreakInput = element.querySelector('#long-break');
      this.cycleInput = element.querySelector('#cycle-count');
      this.soundSelect = element.querySelector('#end-sound');

      // Получаем значения из атрибутов или localStorage
      const savedSettings = JSON.parse(localStorage.getItem('pomodoro-settings')) || {};
      this.focusTime = savedSettings.focusTime || +element.getAttribute('data-focus-time') || 25;
      this.shortBreak = savedSettings.shortBreak || +element.getAttribute('data-short-break') || 5;
      this.longBreak = savedSettings.longBreak || +element.getAttribute('data-long-break') || 15;
      this.cycleCount = savedSettings.cycleCount || +element.getAttribute('data-cycle-count') || 4;

      this.endSound = savedSettings.endSound || element.getAttribute('data-end-sound') || 'bip';

      this.circle = element.querySelector('.progress-ring__circle');
      this.CIRCUMFERENCE = 2 * Math.PI * 130;
      this.circle.style.strokeDasharray = this.CIRCUMFERENCE;

      this.state = JSON.parse(localStorage.getItem('pomodoro-state')) || {
          timeRemaining: this.focusTime * 60,
          isRunning: false,
          currentCycle: 0,
          isFocusPhase: true
      };

      this.init();
  }

  // 👉 Инициализация

  init() {
    this.updateDisplay(this.state.timeRemaining);
    this.updateProgress(this.getProgress());

    this.startBtn.addEventListener('click', () => this.startTimer());
    this.pauseBtn.addEventListener('click', () => this.pauseTimer());
    this.resetBtn.addEventListener('click', () => this.resetTimer());
    this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());

    this.focusBtn.addEventListener('click', () => {
        this.resetTimer();
        this.state.timeRemaining = 0;
        this.updateProgress(0);
        this.startTimer();
    });
    
    this.shortPauseBtn.addEventListener('click', () => {
        this.pauseTimer();
        this.state.isFocusPhase = false;
        this.state.timeRemaining = 0;
        this.state.currentCycle = 0;
        this.updateProgress(0);
        this.startTimer();
    });
    
    this.longPauseBtn.addEventListener('click', () => {
        this.pauseTimer();
        this.state.isFocusPhase = false;
        this.state.currentCycle = this.cycleCount;
        this.state.timeRemaining = 0;
        this.updateProgress(0);
        this.startTimer();
    });
    

    this.setSettingsFields();

    if (this.state.isRunning) {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.state.isRunning) return;
    
    this.startBtn.classList.remove('active');
    this.pauseBtn.classList.add('active');
    if (this.state.timeRemaining <= 0) {
      if (this.state.isFocusPhase) {
          this.state.timeRemaining = this.focusTime * 60;
          this.updateDisplay(this.state.timeRemaining);
          this.focusBtn.classList.add('active');
          this.shortPauseBtn.classList.remove('active');
          this.longPauseBtn.classList.remove('active');;
      } else if (this.state.currentCycle / this.cycleCount === 1) { 
        this.state.timeRemaining = this.longBreak * 60;
        this.updateDisplay(this.state.timeRemaining);
        this.state.currentCycle = 0;
        this.focusBtn.classList.remove('active');
        this.shortPauseBtn.classList.remove('active');
        this.longPauseBtn.classList.add('active');
      } else { 
        this.state.timeRemaining = this.shortBreak * 60;
        this.updateDisplay(this.state.timeRemaining);
        this.focusBtn.classList.remove('active');
        this.shortPauseBtn.classList.add('active');
        this.longPauseBtn.classList.remove('active');
      }
    }

    this.state.isRunning = true;
    this.saveState();
    if (this.worker) this.worker.terminate();

    this.createWorker();

    this.worker.postMessage({
      action: 'start',
      timeRemaining: this.state.timeRemaining
    });
  }

  createWorker() {
    const workerCode = `
      let countdown;
      onmessage = (e) => {
          const { action, timeRemaining: remaining } = e.data;
    
          if (action === 'start') {
              clearInterval(countdown);
              timeRemaining = remaining;
              startTime = Date.now();

              const tick = () => {
                  const now = Date.now();
                  const elapsed = Math.floor((now - startTime) / 1000);
                  const newTimeRemaining = Math.max(timeRemaining - elapsed, 0);

                  postMessage(newTimeRemaining);
                  if (newTimeRemaining > 0) {
                      requestAnimationFrame(tick);
                  }
              };

              requestAnimationFrame(tick);
          }
          if (action === 'stop') clearInterval(countdown);
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));

    this.worker.onmessage = (e) => {
      this.state.timeRemaining = e.data;
      this.updateDisplay(this.state.timeRemaining);
      this.updateProgress(this.getProgress());

      if (this.state.isRunning) {
          this.saveState();
      }

      if (this.state.timeRemaining <= 0) this.finishPhase();
    };
  }

  pauseTimer() {
    if (!this.state.isRunning) return;
    
    this.startBtn.classList.add('active');
    this.pauseBtn.classList.remove('active');

    this.state.isRunning = false;
    this.saveState();
    if (this.worker) this.worker.postMessage({ action: 'stop' });
  }

  resetTimer() {
    this.state.isRunning = false;
    this.state.isFocusPhase = true;
    this.state.timeRemaining = this.focusTime * 60;
    this.updateDisplay(this.state.timeRemaining);
    this.updateProgress(0);
    this.startBtn.classList.add('active');
    this.pauseBtn.classList.remove('active');
    
    this.focusBtn.classList.add('active');
    this.shortPauseBtn.classList.remove('active');
    this.longPauseBtn.classList.remove('active');
    
    if (this.worker) {
      this.worker.postMessage({ action: 'stop' });
      this.worker.terminate();
      this.worker = null;
    }
    this.saveState();
  }

  getProgress() {
    const totalTime = this.state.isFocusPhase
      ? this.focusTime * 60
      : (this.state.currentCycle % this.cycleCount === 0 ? this.longBreak : this.shortBreak) * 60;
    return (1 - this.state.timeRemaining / totalTime) * 100;
  }

  finishPhase() {
    this.playEndSound();

    const nextPhase = this.state.isFocusPhase
    ? (this.state.currentCycle + 1) % this.cycleCount === 0
        ? 'long break'
        : 'short break'
        : 'focus';

        const confirmBox = this.element.querySelector('.phase-confirm');
        if (!confirmBox) {
            console.error('phase-confirm not found!');
            return;
        }

        const confirmText = confirmBox.querySelector('.phase-confirm__text');
        const confirmBtn = confirmBox.querySelector('.phase-confirm__btn--confirm');
        const cancelBtn = confirmBox.querySelector('.phase-confirm__btn--cancel');
    
        confirmText.textContent = `Phase complete. Go to next phase (${nextPhase})?`;
        confirmBox.style.display = 'block';

        confirmBtn.onclick = () => {
            confirmBox.style.display = 'none';
            this.state.isRunning = false;
    
            if (this.state.isFocusPhase) {
              this.state.currentCycle++;
              this.state.isFocusPhase = false;
            } else {
                this.state.isFocusPhase = true;
            }
            
            this.saveState();
            this.startTimer();
        };
    
        cancelBtn.onclick = () => {
            confirmBox.style.display = 'none';
            this.state.isRunning = false;
            if (this.worker) {
                this.worker.postMessage({ action: 'stop' });
            }
            this.saveState();
        };

        if (this.worker) {
          this.worker.terminate();
          this.worker = null;
      }
    }

  saveSettings() {
      this.focusTime = +this.focusInput.value;
      this.shortBreak = +this.shortBreakInput.value;
      this.longBreak = +this.longBreakInput.value;
      this.cycleCount = +this.cycleInput.value;
      this.endSound = this.soundSelect.value;

      localStorage.setItem('pomodoro-settings', JSON.stringify({
          focusTime: this.focusTime,
          shortBreak: this.shortBreak,
          longBreak: this.longBreak,
          cycleCount: this.cycleCount,
          endSound: this.endSound
      }));

      this.state.isFocusPhase = true;
      this.resetTimer();
  }

  setSettingsFields() {
      this.focusInput.value = this.focusTime;
      this.shortBreakInput.value = this.shortBreak;
      this.longBreakInput.value = this.longBreak;
      this.cycleInput.value = this.cycleCount;
  }

  playEndSound() {
      const audio = new Audio(`./sounds/${this.endSound}.mp3`);
      audio.play().catch((e) => {
          console.warn('Error play sound:', e);
      });
  }

  updateDisplay(time) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      this.timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  updateProgress(percent) {
    const offset = Math.round(this.CIRCUMFERENCE - (percent / 100) * this.CIRCUMFERENCE);
    this.circle.style.strokeDashoffset = offset;
  }

  saveState() {
      localStorage.setItem('pomodoro-state', JSON.stringify(this.state));
  }
}

function showSettings() {
  const settingsBlock = document.querySelector('.settings');
  if (settingsBlock) settingsBlock.classList.toggle('show');
}

document.addEventListener('DOMContentLoaded', () => {
  const widgets = document.querySelector('.pomodoro');
  new PomodoroWidget(widgets)
});
