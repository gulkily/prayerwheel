> **Feature plan:** [Step 1](./prayer_wheel_traditional_spin_step1_solution_assessment.md) · [Step 2](./prayer_wheel_traditional_spin_step2_feature_description.md) · [Step 3](./prayer_wheel_traditional_spin_step3_development_plan.md) · [Step 4](./prayer_wheel_traditional_spin_step4_implementation_summary.md)

## Completion Contract

- Normal entry: `./pw start`, open the page, and see a traditional prayer wheel at rest.
- Outcome: one click spins the wheel for about 5 seconds while prayers cycle in browser RAM, then it rests and shows a prayer plus the count cycled.
- Recovery: a failed or interrupted cycle stops the wheel and offers retry; a re-click during a spin extends it instead of failing.
- External verification: time spins and re-clicks, check keyboard use, reduced motion and empty browser storage in a supported desktop browser.
- Release: all Step 2 success criteria pass with no activity persistence.

## Key Risks

- **High risk: worker cannot hear a re-click.** Impact: timer cannot be extended; validate: Stage 2 clicks mid-spin; mitigate: the page owns the deadline and the worker works in short slices that yield to messages.
- **High risk: storage writes.** Impact: breaks the core promise; validate: inspect browser storage and server output after a spin; mitigate: no new persistence, logging or telemetry.
- Timing drift. Impact: wheel and cycle end at different moments; validate: time 10 spins and re-clicks; mitigate: one deadline drives both.
- Accessibility. Impact: keyboard or screen-reader users lose the control; validate: tab and activate before wiring timing; mitigate: keep a single real button.

## Stage 1

- Goal: Show a traditional prayer wheel at rest that is still the spin control.
- Dependencies: none.
- Expected changes: restyle `#spin-button` into a drum with decorative band, top finial, spindle and handle (inline SVG or CSS inside the button); spinning part isolated so only the drum turns; reduced-motion state still readable.
- Verification approach: view at desktop and phone widths; tab to it and press Enter/Space; confirm the existing click still starts the old cycle.
- Risks or open questions:
  - Impact: the look loses the button's accessible name or focus ring.
  - Early warning / validation: keyboard pass.
  - Mitigation: keep one `button` with its label and visible focus style.
- Canonical components/API contracts touched: extend `#spin-button` markup and `styles.css`; no contract change.

## Stage 2

- Goal: Make the cycle time-boxed and stoppable.
- Dependencies: Stage 1.
- Expected changes: worker starts with `start` (catalog only, no target), cycles in short slices that yield, counts prayers, and ends on a `stop` message with `complete` carrying count and prayer; `progress` reports the running count. Page signature: `startPrayerCycle(prayers)`; the old fixed one-billion target is removed.
- Verification approach: start a spin, send `stop` from the console, confirm a count and prayer return and the page stays responsive.
- Risks or open questions:
  - Impact: **High risk:** slices too long to hear `stop`, or too short to cycle much.
  - Early warning / validation: measure stop latency and count per second.
  - Mitigation: tune slice size; target stop latency under 50 ms.
  - Impact: leftover worker after stop.
  - Early warning / validation: confirm termination after complete and on error.
  - Mitigation: reuse existing `finishCycle`.
- Canonical components/API contracts touched: extend worker message contract (`start`, `stop`, `progress`, `complete`, `error`).

## Stage 3

- Goal: Spin for about 5 seconds, with a re-click that resets the time and keeps the wheel turning.
- Dependencies: Stage 2.
- Expected changes: page keeps one deadline of 5 s from the latest click and sends `stop` when it passes; a click while active resets the deadline without restarting the worker or the animation; the drum eases to rest on completion; the button is no longer disabled while active. Signature: `extendSpin(): void`.
- Verification approach: time 10 plain spins (5 s ± 0.5 s) and 10 with mid-spin clicks (ends about 5 s after the last click); check no animation jump on re-click; retry after a forced worker error.
- Risks or open questions:
  - Impact: animation restarts or jerks on re-click.
  - Early warning / validation: watch the wheel on rapid clicks.
  - Mitigation: keep the animation on one element and change only the timer.
  - Impact: reduced-motion visitors cannot tell it is spinning.
  - Early warning / validation: enable reduced motion and spin.
  - Mitigation: status text and a visible active style.
- Canonical components/API contracts touched: extend `app.js` states (ready, active, complete, retry); reuse the prayer card.

## Stage 4

- Goal: Make the copy and docs truthful, and verify the release.
- Dependencies: Stage 3.
- Expected changes: replace "billion" wording in the heading, lede, status and completion text with the real count; update `README.md`; no new files besides summary docs.
- Verification approach: full pass of the Step 2 success criteria; browser storage empty after a spin; no server log of spins.
- Risks or open questions:
  - Impact: stale one-billion claim left somewhere.
  - Early warning / validation: search the repo for "billion".
  - Mitigation: update every hit or confirm it is intended.
- Canonical components/API contracts touched: `index.php` copy, `app.js` messages, `README.md`.
