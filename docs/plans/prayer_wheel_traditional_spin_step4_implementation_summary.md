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

## Stage 3 - 5-second spin with re-click extension

- Changes:
  - The page keeps one 5-second stop timer; `extendSpin()` resets it. A click while spinning calls `extendSpin()` and does not create a worker or restart the animation; the button is no longer disabled while active.
  - The drum animation moved from CSS to a Web Animations object on `.wheel-panels`, so it can ease to rest (700 ms) when the worker reports `complete`; reduced-motion visitors skip the animation and keep the glowing drum.
  - Status text updates at most every 250 ms while spinning and reports the real count on completion.
- Verification:
  - `node --check public/assets/app.js` passed.
  - A Node harness with a fake DOM, fake `Worker` and virtual clock: click starts one worker and sends `start`; a re-click at 3 s leaves one worker and one animation; `stop` is not sent at 7.9 s and is sent by 8.1 s (5 s after the re-click); `complete` shows the count, terminates the worker and cancels the eased animation; a new click starts a fresh worker; a worker error shows the retry state.
- Notes:
  - Real-browser timing (10 plain and 10 re-click trials), visual smoothness on rapid clicks, keyboard use and reduced-motion still need a desktop check; no browser is available here.
  - A click in the short window after `stop` is sent but before `complete` arrives only resets a timer that `finishCycle` then clears, so that click is absorbed.

## Stage 4 - Truthful copy and release verification

- Changes:
  - Page heading and lede now say "countless" instead of "a billion"; the status text already reports the real count.
  - `README.md` describes the ~5-second time-boxed spin, the re-click that restarts the timer, and the real count shown at rest.
- Verification:
  - `grep` for "billion" and "1,000,000,000" outside the plan docs finds nothing.
  - `grep` of `public` and `app` finds no `localStorage`, `sessionStorage`, `indexedDB`, cookies, network calls or console logging; the server only serves the page and static files.
  - `php -l public/index.php` passed; the served page returned HTTP 200 with the new heading.
- Notes:
  - Still needed from a person at a desktop browser: the Step 2 timing trials (5 s ± 0.5 s plain; 10 of 10 re-click trials), the visual look at desktop and phone widths, keyboard activation, reduced motion, and an empty-storage check in dev tools.
  - Earlier MVP plan docs still describe the exact-billion behavior; they are historical and were left unchanged.
