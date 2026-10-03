> **Feature plan:** [Step 1](./prayer_wheel_mvp_step1_solution_assessment.md) · [Step 2](./prayer_wheel_mvp_step2_feature_description.md) · [Step 3](./prayer_wheel_mvp_step3_development_plan.md) · [Step 4](./prayer_wheel_mvp_step4_implementation_summary.md)

## Original Query

I have 30 minutes to build a project for the mindful makers spirit tech hackathon. I want to build a digital equivalent of a buddhist prayer wheel with billions of prayers inside. Please start by initializing the repo with a file that contains a prayer for our project. Do not commit the prayer until I have reviewed it. Ask me questions.

## Problem Statement

Create a browser-based prayer wheel where every spin cycles one billion repeatable prayers from a server-provided catalog in RAM, without writing prayer activity to storage or blocking the participant’s experience.

## Clarification

Anyone can load the prayer wheel in a browser. Each spin must cycle billions of prayers, which may repeat, through RAM without storage-device wear. The server distributes the catalog; users will be able to add prayers in a later FDP cycle. The MVP may hard-code that catalog if it remains straightforward to replace with the future shared list.

## Options

### Option A — Static browser-only prayer catalog

- Pros: smallest build; prayers can repeat from a compact in-memory list; makes no disk writes.
- Cons: does not establish the server as the catalog source, so future user-contributed prayers require a catalog migration.

### Option B — Server-provided catalog with Web Worker prayer loop

- Pros: establishes a centrally distributed catalog now; actually cycles it in browser RAM while keeping the wheel responsive; makes no spin-history writes; supports later user submissions without changing the wheel contract.
- Cons: adds a server-to-browser catalog boundary and a worker boundary; cannot preserve spin history between page loads.

### Option C — SQLite catalog and user submissions now

- Pros: creates the eventual shared catalog and contribution path immediately.
- Cons: adds persistence, moderation, and recovery requirements beyond the 30-minute vertical slice.

## Recommendation

Choose **Option B**: PHP owns and serves a compact, hard-coded catalog through a replaceable catalog boundary; JavaScript gives it to a Web Worker, which cycles it one billion times in RAM per spin. Defer SQLite and user-submitted prayers to the next approved FDP cycle. This is a releasable vertical slice: load the page, receive the server catalog, spin the wheel, see responsive progress, complete the in-memory cycle, and receive a prayer without persistent activity.
