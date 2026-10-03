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
        <svg class="sprite" width="0" height="0" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="ball-shine" x1="0.3" y1="0.2" x2="0.8" y2="0.9">
              <stop offset="0" stop-color="#fff2c4"/>
              <stop offset="0.45" stop-color="#e3bd69"/>
              <stop offset="1" stop-color="#7e5522"/>
            </linearGradient>
          </defs>
          <symbol id="dharma-wheel" viewBox="0 0 100 100">
            <g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round">
              <circle cx="50" cy="50" r="42"/>
              <circle cx="50" cy="50" r="31" stroke-width="2.5"/>
              <path d="M50 8V92M8 50H92M20.3 20.3L79.7 79.7M79.7 20.3L20.3 79.7"/>
            </g>
            <g fill="currentColor">
              <circle cx="50" cy="50" r="9"/>
              <circle cx="50" cy="8" r="4.5"/><circle cx="50" cy="92" r="4.5"/>
              <circle cx="8" cy="50" r="4.5"/><circle cx="92" cy="50" r="4.5"/>
              <circle cx="20.3" cy="20.3" r="4.5"/><circle cx="79.7" cy="79.7" r="4.5"/>
              <circle cx="79.7" cy="20.3" r="4.5"/><circle cx="20.3" cy="79.7" r="4.5"/>
            </g>
          </symbol>
          <symbol id="ornament" viewBox="0 0 100 160">
            <g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
              <path d="M50 14L82 80L50 146L18 80Z"/>
              <path d="M50 38L66 80L50 122L34 80Z" stroke-width="2.5"/>
              <circle cx="50" cy="80" r="9"/>
              <path d="M50 24Q60 34 50 44Q40 34 50 24Z" fill="currentColor" stroke="none"/>
              <path d="M50 136Q60 126 50 116Q40 126 50 136Z" fill="currentColor" stroke="none"/>
            </g>
            <g fill="currentColor">
              <circle cx="14" cy="80" r="3.5"/><circle cx="86" cy="80" r="3.5"/>
            </g>
          </symbol>
        </svg>
        <button id="spin-button" class="prayer-wheel" type="button" aria-describedby="wheel-status">
          <span class="sr-only">Spin the wheel</span>
          <span class="wheel-lift" aria-hidden="true">
            <span class="wheel-body">
              <span class="wheel-chain">
                <svg viewBox="0 0 12 84" width="12" height="84" focusable="false">
                  <path d="M6 0V68" fill="none" stroke="#7e5522" stroke-width="3.6" stroke-linecap="round"/>
                  <path d="M6 0V68" fill="none" stroke="#e3bd69" stroke-width="2" stroke-linecap="round" stroke-dasharray="3.2 2.4"/>
                  <circle cx="6" cy="75" r="7" fill="url(#ball-shine)" stroke="#5a3a1c" stroke-width="1"/>
                </svg>
              </span>
              <span class="wheel-finial"></span>
              <span class="wheel-cap"></span>
              <span class="wheel-drum">
                <span class="wheel-panels">
<?php for ($face = 0; $face < 12; $face++): ?>
                  <span class="wheel-face <?= $face % 2 === 0 ? 'face-emblem' : 'face-ornament' ?>" style="--i: <?= $face ?>">
                    <svg viewBox="0 0 <?= $face % 2 === 0 ? '100 100' : '100 160' ?>" focusable="false"><use href="#<?= $face % 2 === 0 ? 'dharma-wheel' : 'ornament' ?>"/></svg>
                  </span>
<?php endfor; ?>
                </span>
                <span class="drum-shade"></span>
              </span>
              <span class="wheel-base"></span>
              <span class="wheel-collar"></span>
              <span class="wheel-handle"></span>
            </span>
          </span>
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
