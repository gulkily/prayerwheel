(() => {
  const catalogElement = document.querySelector('#prayer-catalog');
  const spinButton = document.querySelector('#spin-button');
  const status = document.querySelector('#wheel-status');
  const prayer = document.querySelector('#current-prayer');
  const source = document.querySelector('#prayer-source');
  const catalog = JSON.parse(catalogElement.textContent);
  const panels = document.querySelector('.wheel-panels');
  const chain = document.querySelector('.wheel-chain');
  const wheelBody = document.querySelector('.wheel-body');
  const spinDuration = 5000;
  const rampDuration = 600;
  const revolutionMs = 3000;
  const startSpeed = 1.5;
  const speedBoost = 1;
  const maxSpeed = 4;
  const statusInterval = 250;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let cycleWorker;
  let stopTimer;
  let wheelAnimation;
  let spinAnimation;
  let spinSpeed = 0;
  let spinStartedAt = 0;
  let rampStartedAt = 0;
  let lastStatusAt = 0;
  let chainAngle = 0;
  let chainVelocity = 0;
  let loopRunning = false;
  let lastFrame = 0;
  let prayerShown = false;
  let swingMax = 38;

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

  const writePrayer = (entry) => {
    prayer.textContent = entry.text;
    source.textContent = `— ${entry.source}`;
  };

  // Reserve the height of the longest prayer so a new prayer never moves the page.
  const reservePrayerSpace = () => {
    const probe = prayer.cloneNode(false);
    probe.removeAttribute('id');
    probe.style.cssText = `position:absolute;visibility:hidden;min-height:0;width:${prayer.clientWidth}px`;
    prayer.parentNode.append(probe);
    let tallest = 0;
    catalog.forEach((entry) => {
      probe.textContent = entry.text;
      tallest = Math.max(tallest, probe.offsetHeight);
    });
    probe.remove();
    prayer.style.minHeight = `${tallest}px`;
  };

  const showPrayer = (entry) => {
    const changed = prayer.textContent !== entry.text;
    if (!prayerShown || !changed || reducedMotion.matches || !prayer.animate) {
      writePrayer(entry);
      prayerShown = true;
      return;
    }

    const targets = [prayer, source];
    const fadeOut = targets.map((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }));
    Promise.all(fadeOut.map((animation) => animation.finished)).then(() => {
      writePrayer(entry);
      targets.forEach((el) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out' }));
      fadeOut.forEach((animation) => animation.cancel());
    }, () => writePrayer(entry));
  };

  // Swing outward as far as 38 degrees, but never past the edge of the screen.
  const swingLimit = () => {
    const unit = parseFloat(getComputedStyle(spinButton).fontSize);
    const bodyBox = wheelBody.getBoundingClientRect();
    const pivotX = bodyBox.left + bodyBox.width / 2 + 5.9 * unit;
    const room = window.innerWidth - pivotX - 1.2 * unit;
    const reach = Math.asin(Math.min(1, Math.max(0, room / (8.2 * unit)))) * (180 / Math.PI);
    return Math.min(38, reach);
  };

  const easeIn = (now) => {
    const t = Math.min(1, Math.max(0, (now - rampStartedAt) / rampDuration));
    return t * t * (3 - 2 * t);
  };

  const currentSpeed = (now = performance.now()) =>
    spinSpeed * Math.max(0, 1 - (now - spinStartedAt) / spinDuration) * easeIn(now);

  // The chain is a damped spring: it swings out with the wheel's speed and settles back.
  const updateChain = (speed, dt) => {
    if (reducedMotion.matches) {
      return false;
    }

    const target = swingMax * (1 - Math.exp(-speed / 1.2));
    chainVelocity += ((target - chainAngle) * 70 - chainVelocity * 6.5) * dt;
    chainAngle = Math.max(-8, chainAngle + chainVelocity * dt);
    chain.style.transform = `rotate(${(-chainAngle).toFixed(2)}deg)`;
    return Math.abs(target - chainAngle) > 0.05 || Math.abs(chainVelocity) > 0.2;
  };

  const frame = (now) => {
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    const speed = spinAnimation ? currentSpeed(now) : 0;
    if (spinAnimation) {
      spinAnimation.playbackRate = speed;
    }

    if (updateChain(speed, dt) || spinAnimation) {
      requestAnimationFrame(frame);
    } else {
      loopRunning = false;
    }
  };

  const ensureLoop = () => {
    if (!loopRunning) {
      loopRunning = true;
      lastFrame = performance.now();
      requestAnimationFrame(frame);
    }
  };

  const startSpinAnimation = () => {
    stopSpinAnimation();
    swingMax = swingLimit();
    spinSpeed = startSpeed;
    spinStartedAt = performance.now();
    rampStartedAt = spinStartedAt;
    if (reducedMotion.matches || !panels.animate) {
      return;
    }

    // One persistent animation turns the drum clockwise seen from above: the front surface moves right to left.
    wheelAnimation ??= panels.animate(
      [
        { transform: 'translateZ(-5.3em) rotateY(0deg)' },
        { transform: 'translateZ(-5.3em) rotateY(-360deg)' },
      ],
      { duration: revolutionMs, iterations: Infinity },
    );
    spinAnimation = wheelAnimation;
    spinAnimation.playbackRate = 0;
    spinAnimation.play();
    ensureLoop();
  };

  const stopSpinAnimation = () => {
    spinAnimation?.pause();
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
    rampStartedAt = -Infinity;
    if (spinAnimation) {
      spinAnimation.playbackRate = spinSpeed;
    }

    if (!reducedMotion.matches) {
      // A small visible impulse: the wheel jolts and the chain is kicked outward.
      chainVelocity += 90;
      wheelBody.animate?.(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.022) translateY(-.15em)' }, { transform: 'scale(1)' }],
        { duration: 240, easing: 'ease-out' },
      );
      ensureLoop();
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
        status.textContent = `${data.completed.toLocaleString()} prayers passed through memory.\n${messages.complete}`;
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
  reservePrayerSpace();
  window.addEventListener('resize', reservePrayerSpace);
  setWheelState('ready');
  spinButton.addEventListener('click', () => (cycleWorker ? extendSpin() : startPrayerCycle(catalog)));
  window.addEventListener('beforeunload', finishCycle);
  window.prayerWheel = { extendSpin, catalog, setWheelState, showPrayer, startPrayerCycle, spinButton };
})();
