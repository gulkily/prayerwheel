(() => {
  const catalogElement = document.querySelector('#prayer-catalog');
  const spinButton = document.querySelector('#spin-button');
  const status = document.querySelector('#wheel-status');
  const prayer = document.querySelector('#current-prayer');
  const source = document.querySelector('#prayer-source');
  const catalog = JSON.parse(catalogElement.textContent);
  const panels = document.querySelector('.wheel-panels');
  const spinDuration = 5000;
  const startSpeed = 1.5;
  const speedBoost = 1;
  const maxSpeed = 4;
  const statusInterval = 250;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let cycleWorker;
  let stopTimer;
  let spinAnimation;
  let spinSpeed = 0;
  let spinStartedAt = 0;
  let lastStatusAt = 0;

  const messages = {
    ready: '',
    active: 'The wheel is carrying your prayers through memory.',
    complete: 'The wheel is at rest. May its intention travel with you.',
    retry: 'The cycle paused before completion. You may turn the wheel again.',
  };

  const setWheelState = (state) => {
    document.body.dataset.wheelState = state;
    status.textContent = messages[state];
  };

  const showPrayer = (entry) => {
    prayer.textContent = entry.text;
    source.textContent = `— ${entry.source}`;
  };

  const startSpinAnimation = () => {
    stopSpinAnimation();
    spinSpeed = startSpeed;
    spinStartedAt = performance.now();
    if (reducedMotion.matches || !panels.animate) {
      return;
    }

    spinAnimation = panels.animate(
      [{ backgroundPosition: '0 0, 0 0' }, { backgroundPosition: '0 0, 4.5em 0' }],
      { duration: 1200, iterations: Infinity },
    );
    spinAnimation.playbackRate = spinSpeed;
    requestAnimationFrame(tickSpin);
  };

  const currentSpeed = (now = performance.now()) => spinSpeed * Math.max(0, 1 - (now - spinStartedAt) / spinDuration);

  const tickSpin = (now) => {
    if (!spinAnimation) {
      return;
    }

    spinAnimation.playbackRate = currentSpeed(now);
    requestAnimationFrame(tickSpin);
  };

  const stopSpinAnimation = () => {
    spinAnimation?.cancel();
    spinAnimation = undefined;
  };

  const finishCycle = () => {
    clearTimeout(stopTimer);
    stopTimer = undefined;
    cycleWorker?.terminate();
    cycleWorker = undefined;
  };

  const resetStopTimer = () => {
    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => cycleWorker?.postMessage({ type: 'stop' }), spinDuration);
  };

  const extendSpin = () => {
    const now = performance.now();
    spinSpeed = Math.min(maxSpeed, currentSpeed(now) + speedBoost);
    spinStartedAt = now;
    if (spinAnimation) {
      spinAnimation.playbackRate = spinSpeed;
    }
    resetStopTimer();
  };

  const showRetry = (message) => {
    finishCycle();
    stopSpinAnimation();
    setWheelState('retry');
    status.textContent = message;
  };

  const startPrayerCycle = (prayers) => {
    if (prayers.length === 0) {
      showRetry('The cycle could not begin. Please turn the wheel again.');
      return;
    }

    setWheelState('active');
    try {
      cycleWorker = new Worker('/assets/prayer-cycle-worker.js');
    } catch {
      showRetry('The cycle could not begin. Please turn the wheel again.');
      return;
    }

    cycleWorker.addEventListener('message', ({ data }) => {
      if (data.type === 'progress') {
        if (performance.now() - lastStatusAt >= statusInterval) {
          lastStatusAt = performance.now();
          status.textContent = `${data.completed.toLocaleString()} prayers are passing through memory.`;
        }
        return;
      }

      if (data.type === 'complete') {
        showPrayer(data.prayer);
        finishCycle();
        setWheelState('complete');
        status.textContent = `${data.completed.toLocaleString()} prayers passed through memory. ${messages.complete}`;
        stopSpinAnimation();
        return;
      }

      showRetry('The cycle paused before completion. You may turn the wheel again.');
    });

    cycleWorker.addEventListener('error', () => {
      showRetry('The cycle paused before completion. You may turn the wheel again.');
    });

    startSpinAnimation();
    cycleWorker.postMessage({ type: 'start', prayers });
    resetStopTimer();
  };

  showPrayer(catalog[0]);
  setWheelState('ready');
  spinButton.addEventListener('click', () => (cycleWorker ? extendSpin() : startPrayerCycle(catalog)));
  window.addEventListener('beforeunload', finishCycle);
  window.prayerWheel = { extendSpin, catalog, setWheelState, showPrayer, startPrayerCycle, spinButton };
})();
