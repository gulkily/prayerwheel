# Prayer Wheel

A traditional-looking browser prayer wheel that cycles repeatable prayers in memory, without recording prayer activity.

## Run locally

PHP CLI is required. From the project root, run:

```sh
./pw start
```

Open the local address reported by the command (by default, <http://127.0.0.1:8080>). Set `PW_PORT` to use a different port.

The initial catalog lives in `app/prayers.php`. It is a temporary, server-provided seed catalog; visitor contributions are deliberately deferred.

## What a spin does

Each spin sends the current server-provided catalog to a browser Web Worker, which visits one catalog prayer per iteration, allowing prayers to repeat, for about 5 seconds. Clicking the wheel again while it spins restarts the 5-second timer and keeps the wheel turning. When the time ends, the wheel eases to rest and shows a prayer along with the number of prayers that passed through memory. The cycle is volatile: it does not write spin or prayer activity to a database, browser storage, log, or analytics service.

The initial wording is the original project prayer in `PRAYER.md`. Community-submitted prayers, storage, and moderation are intentionally outside this MVP.

If the launcher reports that PHP is unavailable, install PHP CLI and run `./pw start` again. If a cycle is interrupted, use the wheel’s retryable ready state to begin a new in-memory cycle.
