const sliceSize = 200_000;

let stopRequested = false;

const runCycle = (prayers) => {
  let completed = 0;
  let prayer = prayers[0];

  const runSlice = () => {
    if (stopRequested) {
      self.postMessage({ type: 'complete', completed, prayer });
      return;
    }

    for (let i = 0; i < sliceSize; i += 1) {
      prayer = prayers[completed % prayers.length];
      completed += 1;
    }

    self.postMessage({ type: 'progress', completed });
    setTimeout(runSlice, 0);
  };

  runSlice();
};

self.addEventListener('message', ({ data }) => {
  try {
    if (data.type === 'stop') {
      stopRequested = true;
      return;
    }

    if (data.type !== 'start') {
      return;
    }

    const { prayers } = data;
    if (!Array.isArray(prayers) || prayers.length === 0) {
      throw new Error('A non-empty prayer catalog is required.');
    }

    stopRequested = false;
    runCycle(prayers);
  } catch (error) {
    self.postMessage({ type: 'error', message: error instanceof Error ? error.message : 'Prayer cycle failed.' });
  }
});
