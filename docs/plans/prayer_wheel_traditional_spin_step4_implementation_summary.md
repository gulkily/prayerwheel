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

## Follow-up - Spin acceleration and gradual slowdown

- Changes:
  - Requested after Step 4 as a small tweak to Stage 3 behavior, so it was done as one follow-up commit without a new planning cycle.
  - The drum starts at 1.5x speed and slows linearly to a stop over the 5 seconds after the latest click, replacing the 0.7 s ease-to-rest.
  - Each re-click adds 1x to the current speed (capped at 4x) and restarts the 5-second slowdown; the speed is applied immediately.
  - Constants: `startSpeed`, `speedBoost`, `maxSpeed` in `public/assets/app.js`.
- Verification:
  - `node --check public/assets/app.js` passed.
  - Fake-DOM harness: rate 1.5 at start, 0.75 at 2.5 s, +1 on re-click (to 0.88 after 2.5 s more of decay), 3rd click to 1.87, many rapid clicks capped at about 4, rate 0.08 at 4.9 s after the last click, `stop` sent after 5 s, one worker and one animation throughout, animation cancelled on `complete`.
- Notes:
  - Whether the speeds and linear slowdown feel right needs a look in a real browser; tune the three constants if not.
  - Reduced-motion visitors have no animation, so they get no acceleration cue beyond the existing glow.

## Follow-up - Simpler interface and larger wheel

- Changes:
  - Removed the "A digital prayer wheel" and "A prayer in this wheel" eyebrows, the lede, the catalog note and the "Ready for your intention" status text (the status line stays for spin counts and errors).
  - Removed the "Spin the wheel" caption and ☸ glyph that covered the drum; the button keeps a screen-reader-only label. Added two gold bands on the drum instead.
  - Wheel dimensions are now in `em` and scale with viewport (`font-size` on `.prayer-wheel`), about 1.7x larger than before; the heading is smaller and spacing is tighter so the wheel and prayer card fit in a 900 px tall window.
- Verification:
  - `php -l public/index.php` and `node --check public/assets/app.js` passed; the Node harness still passes.
  - Headless Chrome screenshot at 1000x900 shows the heading, large wheel and prayer card with no scrolling and no text over the wheel.
- Notes:
  - A 390 px wide headless screenshot appeared cropped, which looks like headless Chrome's minimum window width rather than overflow; confirm on a real phone or with device emulation.
  - The drum scroll distance in `app.js` is now `4.5em` to match the stylesheet.

## Follow-up - Header removed, description added

- Changes:
  - Removed the visible "Countless moments of compassion" heading; a screen-reader-only `h1` ("Prayer Wheel") keeps the page structure.
  - Added one plain paragraph below the wheel explaining the spin, the count, the re-click and the no-storage behavior.
- Verification:
  - `php -l public/index.php` passed; headless Chrome screenshot at 1000x1000 shows the wheel, the paragraph, then the prayer card.
- Notes:
  - The paragraph says "about five seconds"; update it if the spin duration constant changes.

## Follow-up - Completion message on two lines

- Changes:
  - The completion status now shows the prayer count on one line and "The wheel is at rest. May its intention travel with you." on the next (`white-space: pre-line` on `.wheel-status`).
- Verification:
  - `node --check public/assets/app.js` passed; the status string contains a newline before the closing sentence.
- Notes:
  - Not checked in a real browser after a completed spin.
