<?php

declare(strict_types=1);

/**
 * Returns the catalog distributed to every visitor.
 *
 * This small seed catalog is intentionally replaceable by a future shared
 * contribution source. Prayer-cycle activity is never stored.
 *
 * @return list<array{text: string, source: string}>
 */
function getPrayerCatalog(): array
{
    $contents = file_get_contents(__DIR__ . '/prayers.txt');

    if ($contents === false) {
        throw new RuntimeException('The prayer catalog could not be read.');
    }

    $prayers = preg_split('/\R\s*\R/', trim($contents)) ?: [];

    return array_map(
        static fn (string $prayer): array => [
            'text' => trim($prayer),
            'source' => 'Prayer for the Prayer Wheel',
        ],
        array_values(array_filter($prayers, static fn (string $prayer): bool => trim($prayer) !== '')),
    );
}
