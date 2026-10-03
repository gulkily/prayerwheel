> **Feature plan:** [Step 1](./prayer_wheel_traditional_spin_step1_solution_assessment.md) · [Step 2](./prayer_wheel_traditional_spin_step2_feature_description.md) · [Step 3](./prayer_wheel_traditional_spin_step3_development_plan.md) · [Step 4](./prayer_wheel_traditional_spin_step4_implementation_summary.md)

## Original Query

I built an MVP, and now I want the prayer wheel to:
- look more like a traditional prayer wheel
- I want the spin cycle to last about 5 seconds.
- I want an additional click to reset the spinning time and keep the wheel spinning.

## Problem Statement

Make the prayer wheel look like a traditional hand-held prayer wheel and spin for about 5 seconds per cycle, where clicking again during a spin restarts the 5-second timer and keeps the wheel turning.

## Options

### Option A — Fixed-duration timer over the existing worker cycle

- Pros: smallest change; keeps the one-billion-iteration worker as is; restyles the wheel with CSS only.
- Cons: the billion-iteration cycle takes however long the device takes, so it will not reliably fit ~5 seconds; re-clicks have no clear meaning for an in-flight worker run.

### Option B — Time-boxed cycle: the worker runs until a 5-second deadline, and re-clicks extend it

- Pros: spin length is predictable (~5 s) on any device; a re-click simply pushes the deadline out to 5 s from now while the same worker keeps running, so the wheel never stops; fits the existing worker boundary; prayer count becomes whatever fits in the time, still in RAM with nothing stored.
- Cons: changes the "exactly 1,000,000,000 prayers" promise in the UI and README; needs a new count and progress message contract between page and worker.

### Option C — Cosmetic 5-second spin decoupled from the prayer cycle

- Pros: the visual spin and the 5-second timer are fully deterministic and re-clicks are trivial; the worker is untouched.
- Cons: the animation no longer reflects real prayer work; the billion-prayer claim and the visible wheel can drift apart, which weakens the core idea.

## Recommendation

Choose **Option B**, with the traditional look (a handled wheel with a drum body, a decorative band and a spindle, drawn in CSS/SVG) shipped in the same slice. It is a releasable vertical slice: load the page, click to spin for ~5 s, click again to restart the timer while the wheel keeps turning, see the wheel come to rest and receive a prayer. Interruption and retry stay as they are. The "exactly one billion" wording is replaced by a time-based count and needs your confirmation in Step 2.
