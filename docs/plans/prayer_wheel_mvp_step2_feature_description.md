> **Feature plan:** [Step 1](./prayer_wheel_mvp_step1_solution_assessment.md) · [Step 2](./prayer_wheel_mvp_step2_feature_description.md) · [Step 3](./prayer_wheel_mvp_step3_development_plan.md) · [Step 4](./prayer_wheel_mvp_step4_implementation_summary.md)

## Problem

Visitors need a simple, contemplative digital prayer-wheel ritual that performs a genuine billion-prayer, repeatable cycle without creating storage wear. The MVP must be easy to run locally, establish the server as the prayer-catalog source, and keep contributions out of scope.

## User Stories

- As a visitor, I want to spin a digital prayer wheel so that I can intentionally send a billion prayers through the world.
- As a visitor, I want the wheel to remain clear and responsive during a spin so that the ritual feels calm rather than technical.
- As a future contributor, I want a centrally distributed prayer catalog so that new prayers can eventually reach every visitor.
- As a demo host, I want to run `./pw start` so that I can launch the prayer wheel locally with one memorable command.

## Core Requirements

- The project provides `./pw start`, which starts a local PHP-served version of the app and clearly reports how to access it.
- The prayer catalog is supplied by the server and is hard-coded only for this MVP; it is replaceable by a future shared catalog, and the UI makes deferred user additions clear.
- Each completed spin cycles exactly one billion prayers, allowing repeats, in volatile browser memory.
- The MVP records neither spin activity nor prayer-cycle data in durable client or server storage.
- A visitor can start a spin from the normal page entry and receive a displayed prayer when it completes.

## Completion Boundary

- Normal entry: a demo host runs `./pw start`, opens the reported local address, and sees the ready wheel.
- Outcome: one initiated spin completes a billion in-memory prayer cycles and presents a prayer from the server catalog.
- Recovery: if local startup fails or a cycle is interrupted, the user receives a clear corrective or retry path without a stored partial result.
- Release condition: local startup, the normal flow, and recovery paths work in a supported desktop browser, with no durable activity writes.

## Risks

- **Billion-cycle performance:** impact: the ritual could appear frozen or take impractically long; earliest validation: benchmark one real cycle before Step 3; mitigation: keep the catalog compact and preserve a responsive progress state.
- **Storage-write violation:** impact: undermines the project’s central promise; earliest validation: inspect application behavior and browser storage during a spin before Step 3; mitigation: exclude persistence and activity tracking from MVP scope.
- **Prayer provenance and sensitivity:** impact: an inappropriate or unattributed prayer damages trust; earliest validation: review the initial catalog before release; mitigation: use a small, reviewed set with clear source/context.
- **Local runtime availability:** impact: the demo host cannot launch the app; earliest validation: verify `./pw start` on a clean local shell before Step 3; mitigation: validate the PHP prerequisite and provide a clear corrective message.

## Shared Component Inventory

- No existing host-repository UI or API surfaces render prayer-catalog data; this feature needs a new canonical prayer-wheel page and catalog boundary.

## User Flow

1. Demo host runs `./pw start` and opens the reported local address.
2. The page receives the current server-provided prayer catalog and shows the ready wheel.
3. Visitor spins the wheel and sees the active cycle state.
4. The billion-prayer cycle completes in memory.
5. The page presents a prayer and returns to a ready state; a failed or interrupted cycle instead offers retry.

## Success Criteria

- A visitor can complete the primary spin flow in a supported desktop browser.
- `./pw start` launches the local app and reports a working local address when PHP is available.
- Each completed spin performs exactly 1,000,000,000 repeatable prayer cycles from the server-provided catalog.
- No spin or cycle information persists across a page reload.
- A reviewed prayer is presented after each successful cycle.
- The UI makes the MVP’s catalog limitation and deferred submission capability clear.
