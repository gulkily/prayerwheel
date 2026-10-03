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
    return [
        [
            'text' => 'May every turn of this wheel carry a moment of compassion into the world.',
            'source' => 'Prayer for the Prayer Wheel',
        ],
    ];
}
