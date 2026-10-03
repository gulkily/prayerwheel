> **Feature plan:** [Step 1](./prayer_wheel_traditional_spin_step1_solution_assessment.md) · [Step 2](./prayer_wheel_traditional_spin_step2_feature_description.md) · [Step 3](./prayer_wheel_traditional_spin_step3_development_plan.md) · [Step 4](./prayer_wheel_traditional_spin_step4_implementation_summary.md)

## Stage 1 - Traditional wheel look

- Changes:
  - `#spin-button` is now a traditional hand-held wheel: finial, cap, red drum with gold band and scrolling panels, base and wooden handle, all CSS inside the one button.
  - Only the drum panels animate while active (the whole button no longer rotates); reduced-motion visitors get a glowing drum as the active cue.
- Verification:
  - `php -l public/index.php` and `node --check public/assets/app.js` passed.
  - Server on port 8099 returned the page with the new wheel markup and the stylesheet (HTTP 200).
- Notes:
  - No browser is available in this environment, so the visual look, focus ring and Enter/Space activation still need a desktop check.
  - The existing one-billion cycle is unchanged until Stage 2.

## Stage 2 - Time-boxed, stoppable cycle

- Changes:
  - Worker now takes `start` with the catalog only, cycles in 200,000-prayer slices that yield to the event loop, reports `progress`, and on `stop` replies `complete` with the count and last prayer.
  - Page calls `startPrayerCycle(prayers)`; the fixed one-billion target is removed. `window.prayerWheel.stopPrayerCycle()` sends `stop` (used for verification; Stage 3 wires it to the deadline).
- Verification:
  - `node --check` passed for `app.js` and the worker.
  - A Node worker-thread harness ran the worker for 2 s, then sent `stop`: it returned `complete` with 142,400,000 prayers (~71M/s), stop latency 1 ms (target < 50 ms), 712 progress messages and a prayer object.
- Notes:
  - Until Stage 3, a spin only ends when `stopPrayerCycle()` is called from the console, so this commit is an intermediate state.
  - The status text still says "carrying your prayers"; the count display and copy are updated in Stages 3 and 4.
  - About 350 progress messages per second is more than the page needs; Stage 3 may throttle the status update.
