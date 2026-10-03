(() => {
  const catalogElement = document.querySelector('#prayer-catalog');
  const spinButton = document.querySelector('#spin-button');
  const status = document.querySelector('#wheel-status');
  const prayer = document.querySelector('#current-prayer');
  const source = document.querySelector('#prayer-source');
  const catalog = JSON.parse(catalogElement.textContent);
  const prayerTarget = 1_000_000_000;
  let cycleWorker;

  const messages = {
    ready: 'The wheel is ready for your intention.',
    active: 'The wheel is carrying your prayers through memory.',
    complete: 'The prayer cycle is complete. May its intention travel with you.',
    retry: 'The cycle paused before completion. You may turn the wheel again.',
  };

  const setWheelState = (state) => {
    document.body.dataset.wheelState = state;
    status.textContent = messages[state];
    spinButton.disabled = state === 'active';
  };

  const showPrayer = (entry) => {
    prayer.textContent = entry.text;
    source.textContent = `— ${entry.source}`;
  };

  const finishCycle = () => {
    cycleWorker?.terminate();
    cycleWorker = undefined;
  };

  const showRetry = (message) => {
    finishCycle();
    setWheelState('retry');
    status.textContent = message;
  };

  const startPrayerCycle = (prayers, targetCount) => {
    if (cycleWorker || prayers.length === 0) {
      showRetry('The cycle could not begin. Please turn the wheel again.');
      return;
    }

    setWheelState('active');
    cycleWorker = new Worker('/assets/prayer-cycle-worker.js');

    cycleWorker.addEventListener('message', ({ data }) => {
      if (data.type === 'progress') {
        status.textContent = `${data.completed.toLocaleString()} prayers are passing through memory.`;
        return;
      }

      if (data.type === 'complete' && data.completed === targetCount) {
        showPrayer(data.prayer);
        finishCycle();
        setWheelState('complete');
        return;
      }

      showRetry('The cycle paused before completion. You may turn the wheel again.');
    });

    cycleWorker.addEventListener('error', () => {
      showRetry('The cycle paused before completion. You may turn the wheel again.');
    });

    cycleWorker.postMessage({ type: 'start', prayers, targetCount });
  };

  showPrayer(catalog[0]);
  setWheelState('ready');
  spinButton.addEventListener('click', () => startPrayerCycle(catalog, prayerTarget));
  window.addEventListener('beforeunload', finishCycle);
  window.prayerWheel = { catalog, setWheelState, showPrayer, startPrayerCycle, spinButton };
})();
