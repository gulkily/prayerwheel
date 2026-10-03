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
</head>
<body>
  <main>
    <p>Prayer Wheel</p>
    <h1>A billion moments of compassion</h1>
    <p id="wheel-status">The wheel is ready.</p>
    <p id="current-prayer"></p>
    <p>This small server-provided catalog is a seed. Community additions are coming in a future release.</p>
  </main>
  <script id="prayer-catalog" type="application/json"><?= $catalogJson ?></script>
  <script>
    const catalog = JSON.parse(document.querySelector('#prayer-catalog').textContent);
    document.querySelector('#current-prayer').textContent = catalog[0].text;
  </script>
</body>
</html>
