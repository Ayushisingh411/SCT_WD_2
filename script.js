/**
 * CHRONOS // PREMIUM STOPWATCH APPLICATION ENGINE
 * High-performance, precise timing, custom audio synthesizers, 
 * local storage persistence, responsive canvas particle backgrounds, and analytics tracking.
 */

// ==========================================================================
// 1. Productivity Quotes System
// ==========================================================================
const PRODUCTIVITY_QUOTES = [
  { text: "Consistency beats motivation.", author: "James Clear" },
  { text: "Every second counts. Make them matter.", author: "Chronos" },
  { text: "Small progress is still progress.", author: "Unknown" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Your focus determines your reality.", author: "Qui-Gon Jinn" },
  { text: "It is not that I am so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
  { text: "You cannot construct a reputation on what you are going to do.", author: "Henry Ford" },
  { text: "Concentrate all your thoughts upon the work at hand.", author: "Alexander Graham Bell" },
  { text: "The only bad workout is the one that didn't happen.", author: "Fitness Proverb" }
];

// ==========================================================================
// 2. Sound Effects Engine (Web Audio API Synthesizer)
// ==========================================================================
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true; // Changed to match UI state
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  toggle(state) {
    this.enabled = state !== undefined ? state : !this.enabled;
    return this.enabled;
  }

  play(type) {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      
      const now = this.ctx.currentTime;
      
      switch (type) {
        case 'click': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
          
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }
        case 'start': {
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc1.type = 'triangle';
          osc1.frequency.setValueAtTime(523.25, now); // C5
          osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.18); // C6
          
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(659.25, now); // E5
          osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.18); // E6
          
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.2);
          osc2.stop(now + 0.2);
          break;
        }
        case 'pause': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(659.25, now); // E5
          osc.frequency.linearRampToValueAtTime(329.63, now + 0.15); // E4
          
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }
        case 'lap': {
          const oscC = this.ctx.createOscillator();
          const oscG = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          
          oscC.connect(gain);
          oscG.connect(gain);
          gain.connect(this.ctx.destination);
          
          oscC.type = 'sine';
          oscC.frequency.setValueAtTime(523.25, now); // C5
          
          oscG.type = 'sine';
          oscG.frequency.setValueAtTime(783.99, now + 0.05); // G5
          
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.setValueAtTime(0.1, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          
          oscC.start(now);
          oscG.start(now + 0.05);
          oscC.stop(now + 0.3);
          oscG.stop(now + 0.3);
          break;
        }
        case 'reset': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
          
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }
      }
    } catch (e) {
      console.warn("AudioContext block: interactions required first.", e);
    }
  }
}

// ==========================================================================
// 3. Floating Ambient Particles System (Canvas overlay)
// ==========================================================================
class FloatingParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 32;
    this.animationId = null;
    
    this.init();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.start();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.25 + 0.05
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Fetch custom properties for light theme vs dark theme coloring
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#7C5CFF';
    
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      
      if (theme === 'dark') {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      } else {
        // Use custom accent color with opacity
        this.ctx.fillStyle = `${accentColor}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`;
      }
      
      this.ctx.fill();
      
      // Update coordinates
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Screen bounds checks
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
    }
  }

  start() {
    const loop = () => {
      this.draw();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// ==========================================================================
// 4. Core Stopwatch Logic Controller
// ==========================================================================
class ChronosStopwatch {
  constructor() {
    // Timer States
    this.isRunning = false;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.lapElapsedTime = 0;
    this.lastFrameTime = 0;
    this.animationFrameId = null;

    // Laps lists
    this.laps = [];
    this.currentLapNum = 1;
    
    // UI Elements Selection
    this.dom = {
      displayHours: document.getElementById('display-hours'),
      displayMinutes: document.getElementById('display-minutes'),
      displaySeconds: document.getElementById('display-seconds'),
      displayMs: document.getElementById('display-ms'),
      displayStatus: document.getElementById('timer-status'),
      progressRing: document.querySelector('.progress-ring-indicator'),
      lapPreview: document.getElementById('current-lap-preview'),
      
      // Controls
      startPauseBtn: document.getElementById('start-pause-btn'),
      lapBtn: document.getElementById('lap-btn'),
      resetBtn: document.getElementById('reset-btn'),
      exportBtn: document.getElementById('export-btn'),
      clearLapsBtn: document.getElementById('clear-laps-btn'),
      soundBtn: document.getElementById('sound-btn'),
      themeBtn: document.getElementById('theme-btn'),
      focusBtn: document.getElementById('focus-btn'),
      fullscreenBtn: document.getElementById('fullscreen-btn'),
      shortcutsBtn: document.getElementById('shortcuts-btn'),
      closeModalBtn: document.getElementById('close-shortcuts-btn'),
      shortcutsModal: document.getElementById('shortcuts-modal'),
      
      // Live system clock
      liveDate: document.getElementById('live-date'),
      liveTime: document.getElementById('live-time'),
      
      // Statistics
      statTotalTime: document.getElementById('stat-total-time'),
      statLapsCount: document.getElementById('stat-laps-count'),
      statFastestLap: document.getElementById('stat-fastest-lap'),
      statFastestLapNum: document.getElementById('stat-fastest-lap-num'),
      statSlowestLap: document.getElementById('stat-slowest-lap'),
      statSlowestLapNum: document.getElementById('stat-slowest-lap-num'),
      
      // Timeline
      timelineList: document.getElementById('lap-timeline-list'),
      timelineScroll: document.getElementById('timeline-scroll-container'),
      timelineEmptyState: document.getElementById('timeline-empty-message'),
      timelineLapCounter: document.getElementById('timeline-lap-counter'),
      
      // Productivity Cards
      streakCount: document.getElementById('streak-count'),
      dailyFocusVal: document.getElementById('metric-daily-focus'),
      dailyProgressBar: document.getElementById('daily-progress-bar'),
      dailyProgressDesc: document.getElementById('daily-progress-desc'),
      
      weeklyFocusVal: document.getElementById('metric-weekly-focus'),
      weeklyProgressBar: document.getElementById('weekly-progress-bar'),
      weeklyProgressDesc: document.getElementById('weekly-progress-desc'),
      
      analyticAvg: document.getElementById('analytic-avg-session'),
      analyticLongest: document.getElementById('analytic-longest-session'),
      analyticToday: document.getElementById('analytic-today-sessions'),
      analyticTotal: document.getElementById('analytic-total-sessions'),
      
      // Quote
      quoteText: document.getElementById('quote-display'),
      quoteAuthor: document.getElementById('quote-author'),
      
      // Badges
      badgeFirstLap: document.getElementById('badge-first-lap'),
      badgeFocusTen: document.getElementById('badge-focus-ten'),
      badgeMarathon: document.getElementById('badge-marathon'),
      badgePrecision: document.getElementById('badge-precision')
    };

    // Instantiate Audio and Particles
    this.audio = new SoundSynth();
    this.particles = new FloatingParticles('particle-canvas');

    // Persistence Settings Container
    this.settings = {
      theme: 'dark',
      accent: 'purple',
      sounds: true,
      sessions: []
    };

    // Analytics Tracker
    this.analytics = {
      dailyTime: 0, // in milliseconds
      weeklyTime: 0, // in milliseconds
      streak: 1,
      lastActiveDate: '',
      longestSession: 0, // milliseconds
      totalSessions: 0,
      todaySessionsCount: 0,
      badgeFirstLap: false,
      badgeFocusTen: false,
      badgeMarathon: false,
      badgePrecision: false
    };

    this.init();
  }

  // --- Initial Configuration ---
  init() {
    this.loadState();
    this.bindEvents();
    this.startLiveClock();
    this.updateStatsDisplay();
    this.randomizeQuote();
    
    // Hide preloader with a smooth fade
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('fade-out');
      }
    }, 900);
  }

  // Load state from LocalStorage
  loadState() {
    // Config values
    const storedTheme = localStorage.getItem('chronos_theme');
    if (storedTheme) {
      this.settings.theme = storedTheme;
      document.documentElement.setAttribute('data-theme', storedTheme);
      this.updateThemeButtonIcon();
    }
    
    const storedAccent = localStorage.getItem('chronos_accent');
    if (storedAccent) {
      this.settings.accent = storedAccent;
      document.documentElement.setAttribute('data-accent', storedAccent);
      this.updateAccentSelectorUI(storedAccent);
    }
    
    const storedSounds = localStorage.getItem('chronos_sounds');
    if (storedSounds !== null) {
      this.settings.sounds = storedSounds === 'true';
      this.audio.toggle(this.settings.sounds);
      this.updateSoundButtonIcon();
    }

    // Analytics data loading
    const storedAnalytics = localStorage.getItem('chronos_analytics');
    if (storedAnalytics) {
      try {
        const loadedAnalytics = JSON.parse(storedAnalytics);
        this.analytics = { ...this.analytics, ...loadedAnalytics };
      } catch (e) {
        console.error("Error parsing analytics: ", e);
      }
    }

    // Evaluate current streak
    this.evaluateStreak();

    // Rehydrate last active state/session checks if any
    const storedLaps = localStorage.getItem('chronos_last_session_laps');
    const storedTime = localStorage.getItem('chronos_last_session_time');
    
    if (storedLaps) {
      try {
        this.laps = JSON.parse(storedLaps);
        this.currentLapNum = this.laps.length + 1;
        this.rebuildTimeline();
      } catch (e) {
        console.error("Error parsing last session laps: ", e);
      }
    }
    
    if (storedTime) {
      this.elapsedTime = parseInt(storedTime, 10);
      this.updateDisplay(this.elapsedTime);
      this.dom.resetBtn.disabled = this.elapsedTime === 0;
    }

    // Set Achievements Unlocked status
    this.updateAchievementsUI();
  }

  // Save current configurations/analytics
  saveState() {
    localStorage.setItem('chronos_theme', this.settings.theme);
    localStorage.setItem('chronos_accent', this.settings.accent);
    localStorage.setItem('chronos_sounds', this.settings.sounds.toString());
    localStorage.setItem('chronos_analytics', JSON.stringify(this.analytics));
    localStorage.setItem('chronos_last_session_laps', JSON.stringify(this.laps));
    localStorage.setItem('chronos_last_session_time', this.elapsedTime.toString());
  }

  // --- Dynamic Live Clock ---
  startLiveClock() {
    const updateTime = () => {
      const now = new Date();
      
      // Format Date: e.g. July 8, 2026
      const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
      this.dom.liveDate.textContent = now.toLocaleDateString('en-US', dateOptions);
      
      // Format Time: e.g. 01:45:00 AM
      const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      this.dom.liveTime.textContent = now.toLocaleTimeString('en-US', timeOptions);
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  // --- Button & Control Interactions ---
  bindEvents() {
    // Start / Pause
    this.dom.startPauseBtn.addEventListener('click', (e) => {
      this.triggerRipple(e);
      this.toggleTimer();
    });

    // Lap
    this.dom.lapBtn.addEventListener('click', (e) => {
      this.triggerRipple(e);
      this.recordLap();
    });

    // Reset
    this.dom.resetBtn.addEventListener('click', (e) => {
      this.triggerRipple(e);
      this.resetTimer();
    });

    // Clear history
    this.dom.clearLapsBtn.addEventListener('click', () => {
      this.audio.play('click');
      this.clearLapsHistory();
    });

    // Sound toggle
    this.dom.soundBtn.addEventListener('click', () => {
      this.settings.sounds = this.audio.toggle();
      this.saveState();
      this.audio.play('click');
      this.updateSoundButtonIcon();
    });

    // Theme toggle
    this.dom.themeBtn.addEventListener('click', () => {
      this.audio.play('click');
      this.toggleTheme();
    });

    // Focus mode toggle
    this.dom.focusBtn.addEventListener('click', () => {
      this.audio.play('click');
      this.toggleFocusMode();
    });

    // Fullscreen toggle
    this.dom.fullscreenBtn.addEventListener('click', () => {
      this.audio.play('click');
      this.toggleFullscreen();
    });

    // Accent Selection Buttons
    document.querySelectorAll('.accent-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const accent = btn.getAttribute('data-color');
        this.setAccentTheme(accent);
      });
    });

    // Keyboard Shortcuts Modal Toggle
    this.dom.shortcutsBtn.addEventListener('click', () => {
      this.audio.play('click');
      this.openModal();
    });
    this.dom.closeModalBtn.addEventListener('click', () => {
      this.audio.play('click');
      this.closeModal();
    });
    this.dom.shortcutsModal.addEventListener('click', (e) => {
      if (e.target === this.dom.shortcutsModal) {
        this.closeModal();
      }
    });

    // Keyboard global shortcuts
    window.addEventListener('keydown', (e) => {
      this.handleShortcuts(e);
    });

    // Export Dropdown menu
    const exportBtn = this.dom.exportBtn;
    const exportWrapper = document.querySelector('.export-dropdown-wrapper');
    
    exportBtn.addEventListener('click', (e) => {
      this.audio.play('click');
      e.stopPropagation();
      exportWrapper.classList.toggle('active');
      const expanded = exportWrapper.classList.contains('active');
      exportBtn.setAttribute('aria-expanded', expanded);
    });

    // Close dropdown on click outside
    window.addEventListener('click', () => {
      if (exportWrapper.classList.contains('active')) {
        exportWrapper.classList.remove('active');
        exportBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Export Options trigger
    document.querySelectorAll('.export-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const format = btn.getAttribute('data-format');
        this.exportData(format);
      });
    });
  }

  // --- Keyboard Shortcuts Handler ---
  handleShortcuts(e) {
    // If the user is typing in a modal or input (none here, but safety first)
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

    switch (e.key.toLowerCase()) {
      case ' ': // Space key
        e.preventDefault(); // Stop window scroll
        this.dom.startPauseBtn.click();
        break;
      case 'l':
        if (!this.dom.lapBtn.disabled) {
          this.dom.lapBtn.click();
        }
        break;
      case 'r':
        if (!this.dom.resetBtn.disabled) {
          this.dom.resetBtn.click();
        }
        break;
      case 'f':
        this.dom.fullscreenBtn.click();
        break;
      case 't':
        this.dom.themeBtn.click();
        break;
      case 'escape':
        // Exit focus mode or close modals
        if (document.body.classList.contains('focus-mode-active')) {
          this.toggleFocusMode();
        }
        this.closeModal();
        break;
    }
  }

  // --- Sound Indicator Controls ---
  updateSoundButtonIcon() {
    const icon = this.dom.soundBtn.querySelector('i');
    if (this.settings.sounds) {
      icon.className = 'fa-solid fa-volume-high';
      this.dom.soundBtn.title = "Mute Sound Effects";
    } else {
      icon.className = 'fa-solid fa-volume-xmark';
      this.dom.soundBtn.title = "Unmute Sound Effects";
    }
  }

  // --- Theme Toggle Controls ---
  toggleTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    this.settings.theme = nextTheme;
    document.documentElement.setAttribute('data-theme', nextTheme);
    this.saveState();
    this.updateThemeButtonIcon();
  }

  updateThemeButtonIcon() {
    const icon = this.dom.themeBtn.querySelector('i');
    if (this.settings.theme === 'light') {
      icon.className = 'fa-solid fa-sun';
      this.dom.themeBtn.title = "Switch to Dark Mode";
    } else {
      icon.className = 'fa-solid fa-moon';
      this.dom.themeBtn.title = "Switch to Light Mode";
    }
  }

  // --- Custom Accent Controls ---
  setAccentTheme(accent) {
    this.audio.play('click');
    this.settings.accent = accent;
    document.documentElement.setAttribute('data-accent', accent);
    this.saveState();
    this.updateAccentSelectorUI(accent);
  }

  updateAccentSelectorUI(accent) {
    document.querySelectorAll('.accent-btn').forEach(btn => {
      if (btn.getAttribute('data-color') === accent) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- Fullscreen API Controls ---
  toggleFullscreen() {
    const icon = this.dom.fullscreenBtn.querySelector('i');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        icon.className = 'fa-solid fa-minimize';
        this.dom.fullscreenBtn.title = "Exit Fullscreen";
      }).catch(err => {
        console.warn(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        icon.className = 'fa-solid fa-maximize';
        this.dom.fullscreenBtn.title = "Enter Fullscreen";
      });
    }
  }

  // --- Focus Mode Controller ---
  toggleFocusMode() {
    document.body.classList.toggle('focus-mode-active');
    const isFocus = document.body.classList.contains('focus-mode-active');
    
    const icon = this.dom.focusBtn.querySelector('i');
    if (isFocus) {
      icon.className = 'fa-solid fa-compress-alt';
      this.dom.focusBtn.title = "Exit Focus Mode (Esc)";
    } else {
      icon.className = 'fa-solid fa-expand-alt';
      this.dom.focusBtn.title = "Enter Focus Mode";
    }
  }

  // --- Keyboard Shortcuts Modals ---
  openModal() {
    this.dom.shortcutsModal.classList.add('active');
    this.dom.shortcutsModal.setAttribute('aria-hidden', 'false');
  }

  closeModal() {
    this.dom.shortcutsModal.classList.remove('active');
    this.dom.shortcutsModal.setAttribute('aria-hidden', 'true');
  }

  // --- Button Micro-Interaction Ripples ---
  triggerRipple(e) {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    
    btn.appendChild(ripple);
    
    // Cleanup ripple elements
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }

  // ==========================================================================
  // 5. Stopwatch Operational Mechanism
  // ==========================================================================
  toggleTimer() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    this.audio.play('start');
    this.isRunning = true;
    
    document.body.classList.add('timer-running');
    document.body.classList.remove('timer-paused');
    
    this.dom.displayStatus.textContent = "RUNNING";
    this.dom.startPauseBtn.innerHTML = `<i class="fa-solid fa-pause btn-icon"></i><span class="btn-text">Pause</span>`;
    
    this.dom.lapBtn.disabled = false;
    this.dom.resetBtn.disabled = false;
    
    // Performance now base setup
    this.startTime = performance.now() - this.elapsedTime;
    this.lastFrameTime = performance.now();
    
    // Start timing loop
    this.animationFrameId = requestAnimationFrame((timestamp) => this.timingLoop(timestamp));
  }

  pause() {
    this.audio.play('pause');
    this.isRunning = false;
    
    document.body.classList.remove('timer-running');
    document.body.classList.add('timer-paused');
    
    this.dom.displayStatus.textContent = "PAUSED";
    this.dom.startPauseBtn.innerHTML = `<i class="fa-solid fa-play btn-icon"></i><span class="btn-text">Resume</span>`;
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    this.saveState();
    this.recordSessionAnalytics(this.elapsedTime);
  }

  resetTimer() {
    this.audio.play('reset');
    this.isRunning = false;
    
    document.body.classList.remove('timer-running', 'timer-paused');
    this.dom.displayStatus.textContent = "IDLE";
    
    this.dom.startPauseBtn.innerHTML = `<i class="fa-solid fa-play btn-icon"></i><span class="btn-text">Start</span>`;
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Flush session analytics
    if (this.elapsedTime > 0) {
      this.recordSessionAnalytics(this.elapsedTime, true);
    }

    this.elapsedTime = 0;
    this.lapElapsedTime = 0;
    this.currentLapNum = 1;
    this.laps = [];

    // Reset indicator and display
    this.updateDisplay(0);
    this.updateProgressRing(0);
    
    this.dom.lapPreview.textContent = "LAP 1 — 00:00:00.000";
    
    // Reset control buttons states
    this.dom.lapBtn.disabled = true;
    this.dom.resetBtn.disabled = true;
    this.dom.exportBtn.disabled = true;
    this.dom.clearLapsBtn.disabled = true;

    // Refresh UI timeline and quotes
    this.rebuildTimeline();
    this.randomizeQuote();
    this.saveState();
  }

  // Core RAF Loop
  timingLoop(timestamp) {
    if (!this.isRunning) return;

    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.elapsedTime = now - this.startTime;
    
    // Accumulate focus time metrics
    this.accumulateFocusTime(delta);

    // Update display & ring
    this.updateDisplay(this.elapsedTime);
    this.updateProgressRing(this.elapsedTime);
    this.updateCurrentLapPreview(this.elapsedTime);

    this.animationFrameId = requestAnimationFrame((t) => this.timingLoop(t));
  }

  // --- Display Updates ---
  updateDisplay(timeInMs) {
    const formatted = this.timeToUnits(timeInMs);
    
    this.dom.displayHours.textContent = formatted.hours;
    this.dom.displayMinutes.textContent = formatted.minutes;
    this.dom.displaySeconds.textContent = formatted.seconds;
    this.dom.displayMs.textContent = formatted.ms;
  }

  // Dynamic seconds progress visualizer on the SVG border ring
  updateProgressRing(timeInMs) {
    const totalSeconds = timeInMs / 1000;
    // Current second progress: total seconds modulus 60 (for a 60 seconds lap rotation)
    const progress = (totalSeconds % 60) / 60;
    
    // Dash offset computation (Circumference ~1005.3)
    const dashOffset = 1005.31 - (progress * 1005.31);
    this.dom.progressRing.style.strokeDashoffset = dashOffset;
  }

  // Render current active lap preview
  updateCurrentLapPreview(timeInMs) {
    const previousLapsTime = this.laps.reduce((acc, lap) => acc + lap.lapTime, 0);
    const activeLapTime = timeInMs - previousLapsTime;
    const formatted = this.formatTime(activeLapTime);
    
    this.dom.lapPreview.textContent = `LAP ${this.currentLapNum} — ${formatted}`;
  }

  // Utility converter: returns structured string units
  timeToUnits(timeInMs) {
    let ms = Math.floor(timeInMs % 1000);
    let seconds = Math.floor((timeInMs / 1000) % 60);
    let minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
    let hours = Math.floor((timeInMs / (1000 * 60 * 60)));

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      ms: ms.toString().padStart(3, '0')
    };
  }

  // String Formatter: 00:00:00.000
  formatTime(timeInMs) {
    const u = this.timeToUnits(timeInMs);
    return `${u.hours}:${u.minutes}:${u.seconds}.${u.ms}`;
  }

  // ==========================================================================
  // 6. Lap Data Logic
  // ==========================================================================
  recordLap() {
    if (!this.isRunning) return;
    this.audio.play('lap');

    const totalElapsed = this.elapsedTime;
    const previousLapsTime = this.laps.reduce((acc, lap) => acc + lap.lapTime, 0);
    const lapTime = totalElapsed - previousLapsTime;
    
    // Difference from previous lap
    let difference = 0;
    if (this.laps.length > 0) {
      difference = lapTime - this.laps[this.laps.length - 1].lapTime;
    }

    const lapObj = {
      id: Date.now(),
      lapNum: this.currentLapNum,
      lapTime: lapTime,
      totalTime: totalElapsed,
      difference: difference,
      timestamp: new Date().toLocaleTimeString()
    };

    this.laps.push(lapObj);
    this.currentLapNum++;

    // Refresh timeline and statistics UI
    this.rebuildTimeline();
    this.updateStatsDisplay();

    // Trigger Achievement checks
    this.checkAchievements();
    this.saveState();

    // Confetti validations (10, 20, 50 Laps)
    const lapCount = this.laps.length;
    if (lapCount === 10 || lapCount === 20 || lapCount === 50) {
      this.triggerConfettiShower();
    }
  }

  rebuildTimeline() {
    const list = this.dom.timelineList;
    const emptyState = this.dom.timelineEmptyState;
    
    // Reset list contents
    list.innerHTML = '';

    if (this.laps.length === 0) {
      emptyState.style.display = 'flex';
      this.dom.timelineLapCounter.textContent = '0 Laps';
      this.dom.clearLapsBtn.disabled = true;
      this.dom.exportBtn.disabled = true;
      return;
    }

    emptyState.style.display = 'none';
    this.dom.clearLapsBtn.disabled = false;
    this.dom.exportBtn.disabled = false;
    this.dom.timelineLapCounter.textContent = `${this.laps.length} Laps`;

    // Compute fastest/slowest indices for glows
    let fastestIndex = -1;
    let slowestIndex = -1;
    let minTime = Infinity;
    let maxTime = -Infinity;

    this.laps.forEach((lap, idx) => {
      if (lap.lapTime < minTime) {
        minTime = lap.lapTime;
        fastestIndex = idx;
      }
      if (lap.lapTime > maxTime) {
        maxTime = lap.lapTime;
        slowestIndex = idx;
      }
    });

    // Render timeline cards - newest first
    const reversedLaps = [...this.laps].reverse();

    reversedLaps.forEach((lap) => {
      // Find original index matching current lap
      const originalIdx = this.laps.findIndex(l => l.id === lap.id);
      
      const card = document.createElement('div');
      card.className = 'lap-timeline-card';
      
      // Determine appropriate CSS indicator highlights
      let highlightClass = '';
      let pillTag = '';
      
      if (this.laps.length > 1) {
        if (originalIdx === fastestIndex) {
          highlightClass = 'fastest-lap-highlight';
          pillTag = `<span class="lap-pill-tag tag-fastest">FASTEST</span>`;
        } else if (originalIdx === slowestIndex) {
          highlightClass = 'slowest-lap-highlight';
          pillTag = `<span class="lap-pill-tag tag-slowest">SLOWEST</span>`;
        } else if (originalIdx === this.laps.length - 1) {
          highlightClass = 'latest-lap-highlight';
          pillTag = `<span class="lap-pill-tag tag-latest">LATEST</span>`;
        }
      } else {
        highlightClass = 'latest-lap-highlight';
        pillTag = `<span class="lap-pill-tag tag-latest">LATEST</span>`;
      }
      
      if (highlightClass) {
        card.classList.add(highlightClass);
      }

      // Difference format
      let diffHtml = '';
      if (originalIdx > 0) {
        const sign = lap.difference > 0 ? '+' : '';
        const diffClass = lap.difference > 0 ? 'diff-up' : 'diff-down';
        const formattedDiff = (lap.difference / 1000).toFixed(3);
        diffHtml = `<span class="lap-diff-value ${diffClass}">${sign}${formattedDiff}s</span>`;
      } else {
        diffHtml = `<span class="lap-diff-value diff-equal">—</span>`;
      }

      card.innerHTML = `
        <div class="lap-card-left">
          <div class="lap-num-badge">
            Lap ${lap.lapNum} ${pillTag}
          </div>
          <div class="lap-timestamp">Recorded: ${lap.timestamp}</div>
        </div>
        <div class="lap-card-right">
          <div class="lap-time-value">${this.formatTime(lap.lapTime)}</div>
          ${diffHtml}
        </div>
      `;

      list.appendChild(card);
    });

    // Auto scroll view to index 0 (top/latest lap)
    this.dom.timelineScroll.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearLapsHistory() {
    this.laps = [];
    this.currentLapNum = 1;
    this.rebuildTimeline();
    this.updateStatsDisplay();
    this.saveState();
  }

  // ==========================================================================
  // 7. Session Metrics & Statistics Panel
  // ==========================================================================
  updateStatsDisplay() {
    const stats = this.calculateSessionStats();

    // Bump visual animation class trigger
    const triggerBump = (elem) => {
      elem.classList.remove('bump');
      void elem.offsetWidth; // re-flow
      elem.classList.add('bump');
    };

    const totalTimeEl = this.dom.statTotalTime;
    const lapsCountEl = this.dom.statLapsCount;
    const fastestEl = this.dom.statFastestLap;
    const slowestEl = this.dom.statSlowestLap;

    totalTimeEl.textContent = this.formatTime(this.elapsedTime).split('.')[0]; // trim milliseconds
    lapsCountEl.textContent = this.laps.length.toString();

    if (this.laps.length > 0) {
      fastestEl.textContent = this.formatTime(stats.fastest.lapTime).substring(3, 11); // trim MM:SS.MS
      this.dom.statFastestLapNum.textContent = `Lap ${stats.fastest.lapNum}`;
      
      slowestEl.textContent = this.formatTime(stats.slowest.lapTime).substring(3, 11);
      this.dom.statSlowestLapNum.textContent = `Lap ${stats.slowest.lapNum}`;
      
      triggerBump(lapsCountEl);
      triggerBump(fastestEl);
      triggerBump(slowestEl);
    } else {
      fastestEl.textContent = '—';
      this.dom.statFastestLapNum.textContent = 'No laps logged yet';
      
      slowestEl.textContent = '—';
      this.dom.statSlowestLapNum.textContent = 'No laps logged yet';
    }

    // Accumulate total metrics
    this.updateDashboardMetrics();
  }

  calculateSessionStats() {
    if (this.laps.length === 0) {
      return { fastest: null, slowest: null, average: 0 };
    }

    let fastest = this.laps[0];
    let slowest = this.laps[0];
    let total = 0;

    this.laps.forEach(lap => {
      if (lap.lapTime < fastest.lapTime) fastest = lap;
      if (lap.lapTime > slowest.lapTime) slowest = lap;
      total += lap.lapTime;
    });

    return {
      fastest,
      slowest,
      average: total / this.laps.length
    };
  }

  // ==========================================================================
  // 8. Productivity Analytics & Streak Tracker
  // ==========================================================================
  evaluateStreak() {
    const todayStr = new Date().toDateString();
    
    if (this.analytics.lastActiveDate === '') {
      this.analytics.streak = 1;
      this.analytics.lastActiveDate = todayStr;
    } else if (this.analytics.lastActiveDate !== todayStr) {
      const lastActive = new Date(this.analytics.lastActiveDate);
      const today = new Date(todayStr);
      
      // Compute difference in days
      const diffTime = Math.abs(today - lastActive);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive activity
        this.analytics.streak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        this.analytics.streak = 1;
      }
      
      this.analytics.lastActiveDate = todayStr;
      this.analytics.todaySessionsCount = 0; // reset daily counter
    }
    
    this.dom.streakCount.textContent = this.analytics.streak;
  }

  accumulateFocusTime(deltaMs) {
    const todayStr = new Date().toDateString();
    
    // Initialize or verify focus dates
    if (this.analytics.lastActiveDate !== todayStr) {
      this.evaluateStreak();
      this.analytics.dailyTime = 0;
      this.saveState();
    }

    // Accumulate timings
    this.analytics.dailyTime += deltaMs;
    this.analytics.weeklyTime += deltaMs;
    
    // Save to localStorage every few frames (e.g. rate limit save calls)
    if (Math.random() < 0.01) {
      this.saveState();
    }
  }

  recordSessionAnalytics(sessionTimeMs, forceReset = false) {
    if (sessionTimeMs < 1000) return; // ignore sessions shorter than 1 second

    // Update longest session
    if (sessionTimeMs > this.analytics.longestSession) {
      this.analytics.longestSession = sessionTimeMs;
    }

    if (forceReset) {
      this.analytics.totalSessions += 1;
      this.analytics.todaySessionsCount += 1;
    }
    
    this.saveState();
    this.updateDashboardMetrics();
  }

  updateDashboardMetrics() {
    // Focus Goal Conversions (minutes)
    const dailyMins = Math.floor(this.analytics.dailyTime / 60000);
    const weeklyMins = Math.floor(this.analytics.weeklyTime / 60000);

    this.dom.dailyFocusVal.textContent = `${dailyMins}m`;
    this.dom.weeklyFocusVal.textContent = `${weeklyMins}m`;

    // Progression fills
    const dailyPercent = Math.min(Math.round((dailyMins / 60) * 100), 100);
    const weeklyPercent = Math.min(Math.round((weeklyMins / 300) * 100), 100);

    this.dom.dailyProgressBar.style.width = `${dailyPercent}%`;
    this.dom.dailyProgressDesc.textContent = `${dailyPercent}% of 60m goal`;
    
    this.dom.weeklyProgressBar.style.width = `${weeklyPercent}%`;
    this.dom.weeklyProgressDesc.textContent = `${weeklyPercent}% of 300m goal`;

    // Analytics lists updates
    const averageSessionSec = this.analytics.totalSessions > 0 
      ? ((this.analytics.weeklyTime / 1000) / this.analytics.totalSessions).toFixed(1) 
      : '0.0';

    this.dom.analyticAvg.textContent = `${averageSessionSec}s`;
    this.dom.analyticLongest.textContent = `${(this.analytics.longestSession / 1000).toFixed(1)}s`;
    this.dom.analyticToday.textContent = this.analytics.todaySessionsCount.toString();
    this.dom.analyticTotal.textContent = this.analytics.totalSessions.toString();
  }

  // --- Achievements System ---
  checkAchievements() {
    // Achievement 1: First Lap
    if (!this.analytics.badgeFirstLap && this.laps.length >= 1) {
      this.analytics.badgeFirstLap = true;
      this.triggerAchievementUnlock('badge-first-lap');
    }

    // Achievement 2: Precision Master (10 laps in a single session)
    if (!this.analytics.badgePrecision && this.laps.length >= 10) {
      this.analytics.badgePrecision = true;
      this.triggerAchievementUnlock('badge-precision');
    }

    // Achievement 3: Focus Starter (10 min session)
    if (!this.analytics.badgeFocusTen && this.elapsedTime >= 600000) {
      this.analytics.badgeFocusTen = true;
      this.triggerAchievementUnlock('badge-focus-ten');
    }

    // Achievement 4: Marathon Tracker (1 hour session)
    if (!this.analytics.badgeMarathon && this.elapsedTime >= 3600000) {
      this.analytics.badgeMarathon = true;
      this.triggerAchievementUnlock('badge-marathon');
    }

    this.saveState();
  }

  triggerAchievementUnlock(badgeId) {
    this.triggerConfettiShower();
    this.audio.play('start'); // play nice chime
    
    const badgeEl = document.getElementById(badgeId);
    if (badgeEl) {
      badgeEl.classList.remove('locked');
      badgeEl.classList.add('unlocked');
      const statusText = badgeEl.querySelector('.badge-status');
      if (statusText) statusText.textContent = "Unlocked";
    }
  }

  updateAchievementsUI() {
    const badges = [
      { id: 'badge-first-lap', key: 'badgeFirstLap' },
      { id: 'badge-focus-ten', key: 'badgeFocusTen' },
      { id: 'badge-marathon', key: 'badgeMarathon' },
      { id: 'badge-precision', key: 'badgePrecision' }
    ];

    badges.forEach(b => {
      const el = document.getElementById(b.id);
      if (el) {
        if (this.analytics[b.key]) {
          el.classList.remove('locked');
          el.classList.add('unlocked');
          el.querySelector('.badge-status').textContent = "Unlocked";
        } else {
          el.classList.add('locked');
          el.classList.remove('unlocked');
          el.querySelector('.badge-status').textContent = "Locked";
        }
      }
    });
  }

  // --- Quote Generator ---
  randomizeQuote() {
    const rand = Math.floor(Math.random() * PRODUCTIVITY_QUOTES.length);
    const quote = PRODUCTIVITY_QUOTES[rand];
    this.dom.quoteText.textContent = quote.text;
    this.dom.quoteAuthor.textContent = `— ${quote.author}`;
  }

  // --- Confetti Shower (using canvas-confetti CDN) ---
  triggerConfettiShower() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C5CFF', '#4ADE80', '#FFB84C', '#FF75B5', '#00D2FF']
      });
    }
  }

  // ==========================================================================
  // 9. Document Exporter Operations
  // ==========================================================================
  exportData(format) {
    if (this.laps.length === 0) return;

    let content = '';
    let filename = `Chronos_Laps_${Date.now()}`;
    let mimeType = 'text/plain';

    switch (format) {
      case 'csv':
        mimeType = 'text/csv';
        filename += '.csv';
        content = 'Lap Number,Lap Time,Cumulative Time,Timestamp\n';
        this.laps.forEach(lap => {
          content += `${lap.lapNum},"${this.formatTime(lap.lapTime)}","${this.formatTime(lap.totalTime)}","${lap.timestamp}"\n`;
        });
        break;
      case 'json':
        mimeType = 'application/json';
        filename += '.json';
        content = JSON.stringify({
          sessionDate: new Date().toDateString(),
          totalTime: this.formatTime(this.elapsedTime),
          lapsCount: this.laps.length,
          laps: this.laps
        }, null, 2);
        break;
      case 'txt':
      default:
        mimeType = 'text/plain';
        filename += '.txt';
        content = `=== CHRONOS SESSION DETAILS ===\n`;
        content += `Date: ${new Date().toDateString()}\n`;
        content += `Total Logged Time: ${this.formatTime(this.elapsedTime)}\n`;
        content += `Total Laps Recorded: ${this.laps.length}\n`;
        content += `===============================\n\n`;
        this.laps.forEach(lap => {
          content += `Lap ${lap.lapNum.toString().padStart(2, '0')} | Duration: ${this.formatTime(lap.lapTime)} | Running Total: ${this.formatTime(lap.totalTime)} | Logged: ${lap.timestamp}\n`;
        });
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  window.chronosApp = new ChronosStopwatch();
});
