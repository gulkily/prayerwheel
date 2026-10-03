(() => {
  const catalogElement = document.querySelector('#prayer-catalog');
  const spinButton = document.querySelector('#spin-button');
  const status = document.querySelector('#wheel-status');
  const prayer = document.querySelector('#current-prayer');
  const source = document.querySelector('#prayer-source');
  const catalog = JSON.parse(catalogElement.textContent);
  const panels = document.querySelector('.wheel-panels');
  const spinDuration = 5000;
  const restDuration = 700;
  const statusInterval = 250;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let cycleWorker;
  let stopTimer;
  let spinAnimation;
  let lastStatusAt = 0;

  const messages = {
    ready: 'The wheel is ready for your intention.',
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
    spinAnimation?.cancel();
    if (reducedMotion.matches || !panels.animate) {
      return;
    }

    spinAnimation = panels.animate(
      [{ backgroundPosition: '0 0, 0 0' }, { backgroundPosition: '0 0, 4.5rem 0' }],
      { duration: 1200, iterations: Infinity },
    );
  };

  const easeToRest = () => {
    const animation = spinAnimation;
    spinAnimation = undefined;
    if (!animation) {
      return;
    }

    const began = performance.now();
    const slow = (now) => {
      const progress = Math.min(1, Math.max(0, (now - began) / restDuration));
      animation.playbackRate = (1 - progress) ** 2;
      if (progress < 1) {
        requestAnimationFrame(slow);
      } else {
        animation.cancel();
      }
    };
    requestAnimationFrame(slow);
  };

  const finishCycle = () => {
    clearTimeout(stopTimer);
    stopTimer = undefined;
    cycleWorker?.terminate();
    cycleWorker = undefined;
  };

  const extendSpin = () => {
    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => cycleWorker?.postMessage({ type: 'stop' }), spinDuration);
  };

  const showRetry = (message) => {
    finishCycle();
    spinAnimation?.cancel();
    spinAnimation = undefined;
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
        easeToRest();
        return;
      }

      showRetry('The cycle paused before completion. You may turn the wheel again.');
    });

    cycleWorker.addEventListener('error', () => {
      showRetry('The cycle paused before completion. You may turn the wheel again.');
    });

    startSpinAnimation();
    cycleWorker.postMessage({ type: 'start', prayers });
    extendSpin();
  };

  showPrayer(catalog[0]);
  setWheelState('ready');
  spinButton.addEventListener('click', () => (cycleWorker ? extendSpin() : startPrayerCycle(catalog)));
  window.addEventListener('beforeunload', finishCycle);
  window.prayerWheel = { extendSpin, catalog, setWheelState, showPrayer, startPrayerCycle, spinButton };
})();
