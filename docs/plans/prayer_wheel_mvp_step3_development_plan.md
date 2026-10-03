> **Feature plan:** [Step 1](./prayer_wheel_mvp_step1_solution_assessment.md) · [Step 2](./prayer_wheel_mvp_step2_feature_description.md) · [Step 3](./prayer_wheel_mvp_step3_development_plan.md) · [Step 4](./prayer_wheel_mvp_step4_implementation_summary.md)

## Completion Contract

- Normal entry: `./pw start` reports a local address with a ready wheel.
- Outcome: one spin cycles exactly 1,000,000,000 repeatable catalog prayers in browser RAM, then displays one.
- Recovery: missing PHP explains the fix; an interrupted cycle returns to retry with no partial result.
- External verification: test launch, primary/retry flows, and storage behavior in a supported desktop browser.
- Release: all Step 2 success criteria pass with no activity persistence.

## Key Risks

- **High risk: cycle usability.** Impact: frozen or impractically slow UI; validate: run a real cycle early; mitigate: isolate work from the page and show truthful progress.
- **High risk: storage writes.** Impact: breaks the core promise; validate: inspect browser/server storage during a spin; mitigate: omit tracking and persistence.
- Provenance. Impact: harms trust; validate: review the seed catalog; mitigate: ship reviewed content with context.
- PHP availability. Impact: demo cannot launch; validate: test a clean shell; mitigate: prerequisite check and corrective error.

## Stage 1

- Goal: Deliver a launchable, catalog-backed ready page.
- Dependencies: PHP CLI; approved project prayer.
- Expected changes: executable `pw` with `start`; PHP entry point; hard-coded replaceable catalog; ready page and usage note. Catalog signature: `getPrayerCatalog(): array`.
- Verification approach: launch, open the reported address, and see a catalog prayer; validate the missing-PHP message.
- Risks or open questions:
  - Impact: launch failure blocks the demo.
  - Early warning / validation: fresh-shell launch.
  - Mitigation: PHP built-in server and minimal launcher surface.
- Canonical components/API contracts touched: new `pw start` and server catalog contracts.

## Stage 2

- Goal: Make a clear, intentional prayer-wheel interaction.
- Dependencies: Stage 1 page and catalog contract.
- Expected changes: wheel, spin control, active/complete/retry states, and catalog/no-persistence context.
- Verification approach: test pointer/keyboard activation, state visibility, and retry in a supported desktop browser.
- Risks or open questions:
  - Impact: unclear or inaccessible ritual.
  - Early warning / validation: keyboard and visual pass before cycle wiring.
  - Mitigation: one clear action, status, and ready fallback.
- Canonical components/API contracts touched: new prayer-wheel state presentation; reuse server catalog.

## Stage 3

- Goal: Complete a real, responsive billion-prayer RAM cycle.
- Dependencies: Stage 2 interaction states and Stage 1 catalog contract.
- Expected changes: worker cycle accepting catalog/target and reporting progress, completion, or failure; one exact-billion cycle per spin. Signature: `startPrayerCycle(prayers, targetCount)`; messages: `start`, `progress`, `complete`, `error`.
- Verification approach: run a real billion-cycle spin; confirm responsiveness, prayer result, retry, and no reload state.
- Risks or open questions:
  - Impact: **High risk:** frozen or falsely completed cycle.
  - Early warning / validation: real-cycle benchmark.
  - Mitigation: off-page work and actual progress only.
  - Impact: **High risk:** hidden write.
  - Early warning / validation: inspect storage during spin.
  - Mitigation: no sessions, SQLite, telemetry, or logs.
- Canonical components/API contracts touched: reuse catalog; new worker-message contract; extend wheel states.

## Stage 4

- Goal: Prepare the hackathon-ready vertical slice.
- Dependencies: successful Stage 3 real-cycle validation.
- Expected changes: provenance/deferred-contribution copy, setup note, and final recovery/no-write checks; no database changes.
- Verification approach: fresh-shell setup; test launch, spin, retry, and storage inspection.
- Risks or open questions:
  - Impact: unsafe or fragile-feeling demo.
  - Early warning / validation: independent page/run-note read-through.
  - Mitigation: concise catalog context and exact launch instruction.
- Canonical components/API contracts touched: verify, do not expand, wheel and launcher contracts.
