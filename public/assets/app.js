(() => {
  const catalogElement = document.querySelector('#prayer-catalog');
  const spinButton = document.querySelector('#spin-button');
  const status = document.querySelector('#wheel-status');
  const prayer = document.querySelector('#current-prayer');
  const source = document.querySelector('#prayer-source');
  const catalog = JSON.parse(catalogElement.textContent);

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

  showPrayer(catalog[0]);
  setWheelState('ready');
  window.prayerWheel = { catalog, setWheelState, showPrayer, spinButton };
})();
