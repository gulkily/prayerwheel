const progressSteps = 20;

self.addEventListener('message', ({ data }) => {
  try {
    if (data.type !== 'start') {
      return;
    }

    const { prayers, targetCount } = data;
    if (!Array.isArray(prayers) || prayers.length === 0 || !Number.isSafeInteger(targetCount) || targetCount < 1) {
      throw new Error('A non-empty prayer catalog and positive target are required.');
    }

    const progressInterval = Math.max(1, Math.floor(targetCount / progressSteps));
    let nextProgress = progressInterval;
    let completed = 0;
    let prayer = prayers[0];

    while (completed < targetCount) {
      prayer = prayers[completed % prayers.length];
      completed += 1;

      if (completed === nextProgress || completed === targetCount) {
        self.postMessage({ type: 'progress', completed });
        nextProgress = Math.min(targetCount, nextProgress + progressInterval);
      }
    }

    self.postMessage({ type: 'complete', completed, prayer });
  } catch (error) {
    self.postMessage({ type: 'error', message: error instanceof Error ? error.message : 'Prayer cycle failed.' });
  }
});
