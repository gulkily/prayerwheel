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
