# Prayer Wheel

A browser prayer wheel that will cycle repeatable prayers in memory, without recording prayer activity.

## Run locally

PHP CLI is required. From the project root, run:

```sh
./pw start
```

Open the local address reported by the command (by default, <http://127.0.0.1:8080>). Set `PW_PORT` to use a different port.

The initial catalog lives in `app/prayers.txt`, with one prayer paragraph per blank-line-separated entry. `app/prayers.php` reads that file and serves it to the browser. It is a temporary, server-provided seed catalog; visitor contributions are deliberately deferred.

## What a spin does

Each spin sends the current server-provided catalog to a browser Web Worker. The worker visits one catalog prayer per iteration for exactly 1,000,000,000 iterations, allowing prayers to repeat, and then returns one prayer to display. The cycle is volatile: it does not write spin or prayer activity to a database, browser storage, log, or analytics service.

The initial wording is the original project prayer in `PRAYER.md`. Community-submitted prayers, storage, and moderation are intentionally outside this MVP.

If the launcher reports that PHP is unavailable, install PHP CLI and run `./pw start` again. If a cycle is interrupted, use the wheel’s retryable ready state to begin a new in-memory cycle.
