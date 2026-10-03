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
    <header class="intro">
      <p class="eyebrow">A digital prayer wheel</p>
      <h1>A billion moments of compassion</h1>
      <p class="lede">With each turn, a billion prayers pass through memory—without leaving a trace on storage.</p>
    </header>

    <section class="wheel-section" aria-labelledby="wheel-heading">
      <h2 id="wheel-heading" class="sr-only">Prayer wheel</h2>
      <div class="wheel-halo">
        <button id="spin-button" class="prayer-wheel" type="button" aria-describedby="wheel-status">
          <span class="wheel-rim">Spin the wheel</span>
          <span class="wheel-core">☸</span>
        </button>
      </div>
      <p id="wheel-status" class="wheel-status" aria-live="polite">The wheel is ready for your intention.</p>
    </section>

    <section class="prayer-card" aria-labelledby="prayer-heading">
      <p class="eyebrow">A prayer in this wheel</p>
      <h2 id="prayer-heading" class="sr-only">Current prayer</h2>
      <p id="current-prayer" class="prayer-text"></p>
      <p id="prayer-source" class="prayer-source"></p>
    </section>

    <p class="catalog-note">This is a small, server-provided seed catalog. Community prayer additions are coming in a future release.</p>
  </main>
  <script id="prayer-catalog" type="application/json"><?= $catalogJson ?></script>
  <script src="/assets/app.js"></script>
</body>
</html>
