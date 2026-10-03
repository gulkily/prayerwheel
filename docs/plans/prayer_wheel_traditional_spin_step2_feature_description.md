> **Feature plan:** [Step 1](./prayer_wheel_traditional_spin_step1_solution_assessment.md) · [Step 2](./prayer_wheel_traditional_spin_step2_feature_description.md) · [Step 3](./prayer_wheel_traditional_spin_step3_development_plan.md) · [Step 4](./prayer_wheel_traditional_spin_step4_implementation_summary.md)

## Problem

The MVP wheel looks like a generic round button, and a spin lasts however long a billion in-memory iterations take on the visitor's device. Visitors should see a recognisable traditional prayer wheel that spins for about 5 seconds and can be kept spinning with another click.

## User Stories

- As a visitor, I want the wheel to look like a traditional hand-held prayer wheel so that the ritual feels familiar and respectful.
- As a visitor, I want each spin to last about 5 seconds so that the ritual has a predictable, calm rhythm on any device.
- As a visitor, I want to click again while the wheel is spinning so that the 5 seconds restart and the wheel keeps turning without stopping.
- As a demo host, I want the no-storage promise to still hold so that the project's central claim stays true.

## Core Requirements

- The wheel is presented as a traditional prayer wheel: a drum body, a decorative band, a top finial and a handle, with the drum visibly turning around its spindle.
- A spin lasts about 5 seconds from the latest click, then the wheel comes to rest and shows a prayer from the server catalog.
- Clicking during a spin resets the remaining time to about 5 seconds and does not stop, restart or visibly jerk the wheel.
- The prayer count is whatever the in-memory cycle completes within the spin time, with repeats allowed; the UI and README no longer claim "exactly one billion".
- No spin or prayer data is written to durable client or server storage.

## Completion Boundary

- Normal entry: the visitor opens the page, sees the traditional wheel at rest, and clicks it.
- Outcome: the wheel spins for about 5 seconds (longer if clicked again), then stops and presents a prayer and the number of prayers cycled.
- Recovery: if the cycle is interrupted or fails to start, the wheel stops and offers the existing retry path.
- Release condition: the normal flow, re-click extension and recovery work in a supported desktop browser, and reduced-motion visitors still get a clear active state.

## Risks

- **Re-click during a busy cycle:** impact: the current worker loop never yields, so it cannot hear a second click and the timer could not be extended; earliest validation: prototype a click during a spin before Step 3; mitigation: have the page own the deadline and let the worker be told to continue or stop.
- **Dropping the "exactly one billion" claim:** impact: changes the project's headline promise and copy; earliest validation: confirm wording with the owner at Step 2 approval; mitigation: show the real count cycled in the spin and update the heading, lede and README together.
- **Visual and timing drift:** impact: the wheel could stop animating before the cycle ends, or the reverse; earliest validation: time several spins and re-clicks in the browser before Step 3; mitigation: drive the animation and the cycle from the same deadline.
- **Accessibility of the new look:** impact: a non-button drawing could lose keyboard and screen-reader access; earliest validation: tab to the wheel and activate it by keyboard before Step 3; mitigation: keep one real button as the control for the whole wheel.

## Shared Component Inventory

- Wheel control (`#spin-button` in `public/index.php`, styled in `public/assets/styles.css`): extend it into the traditional wheel rather than adding a second control.
- Spin state and status text (`public/assets/app.js`): extend the existing ready/active/complete/retry states and messages.
- Prayer cycle worker (`public/assets/prayer-cycle-worker.js`): extend its message contract for a time-boxed run; no second worker.
- Prayer card, catalog and README wording: reuse the card and catalog unchanged; update the copy that mentions one billion.

## User Flow

1. Visitor opens the page and sees the traditional wheel at rest.
2. Visitor clicks the wheel; it begins turning and the in-memory cycle starts.
3. Visitor may click again at any time; the 5-second timer resets and the wheel keeps turning.
4. About 5 seconds after the last click, the wheel slows to rest.
5. The page shows a prayer and the count cycled, and is ready to spin again; a failure instead offers retry.

## Success Criteria

- With no extra clicks, a spin ends 5 seconds, give or take 0.5 s, after the click, on a typical desktop.
- A click at any point during a spin leaves the wheel turning and ends the spin about 5 seconds after that click, in 10 of 10 manual trials.
- The wheel is recognisable as a traditional prayer wheel to a reviewer, with drum, band, finial and handle visible.
- The wheel is operable by keyboard and mouse, and reduced-motion visitors see a clear active state.
- Browser storage is empty after a spin and no activity is logged by the server.
