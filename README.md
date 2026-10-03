# Prayer Wheel

A browser prayer wheel that will cycle repeatable prayers in memory, without recording prayer activity.

## Run locally

PHP CLI is required. From the project root, run:

```sh
./pw start
```

Open the local address reported by the command (by default, <http://127.0.0.1:8080>). Set `PW_PORT` to use a different port.

The initial catalog lives in `app/prayers.php`. It is a temporary, server-provided seed catalog; visitor contributions are deliberately deferred.
