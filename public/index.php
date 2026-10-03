<?php

declare(strict_types=1);

require_once __DIR__ . '/../app/prayers.php';

$catalogJson = json_encode(
    getPrayerCatalog(),
    JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR,
);
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Prayer Wheel</title>
  <link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
  <main class="page-shell">
    <h1 class="sr-only">Prayer Wheel</h1>
    <section class="wheel-section" aria-labelledby="wheel-heading">
      <h2 id="wheel-heading" class="sr-only">Prayer wheel</h2>
      <div class="wheel-halo">
        <button id="spin-button" class="prayer-wheel" type="button" aria-describedby="wheel-status">
          <span class="sr-only">Spin the prayer wheel</span>
          <span class="wheel-finial" aria-hidden="true"></span>
          <span class="wheel-cap" aria-hidden="true"></span>
          <span class="wheel-drum">
            <span class="wheel-panels" aria-hidden="true"></span>
          </span>
          <span class="wheel-base" aria-hidden="true"></span>
          <span class="wheel-handle" aria-hidden="true"></span>
        </button>
      </div>
      <p id="wheel-status" class="wheel-status" aria-live="polite"></p>
    </section>

    <p class="about">Click the wheel to spin it. For about five seconds, your browser cycles through a small catalog of prayers over and over, as many times as it can, and then shows how many prayers passed through. Click again while it is spinning to speed it up and keep it going. Everything happens in your device's memory; nothing is saved or recorded.</p>

    <section class="prayer-card" aria-labelledby="prayer-heading">
      <h2 id="prayer-heading" class="sr-only">Current prayer</h2>
      <p id="current-prayer" class="prayer-text"></p>
      <p id="prayer-source" class="prayer-source"></p>
    </section>

  </main>
  <script id="prayer-catalog" type="application/json"><?= $catalogJson ?></script>
  <script src="/assets/app.js"></script>
</body>
</html>
