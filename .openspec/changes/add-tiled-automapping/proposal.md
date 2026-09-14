## Why

Building a FoozleLab block currently requires placing each edge, corner, and fill
tile by hand. The attached Tiled example shows the desired framed block: an
author should be able to paint a simple solid footprint and let Tiled generate
the matching structure tiles.

## What Changes

- Add a project-level Tiled Automapping configuration and versioned rule assets
  for FoozleLab structure blocks.
- Provide a first, documented block rule set that converts a painted rectangular
  `Midground1` footprint into the matching top, side, bottom, and corner tiles
  from the FoozleLab Structure tileset, including the pictured framed result.
- Make the rule safe to re-run after a block is edited, so stale generated edge
  tiles are reset before the current boundary is emitted.
- Document the small authoring workflow: paint the designated base tile on
  `Midground1`, run AutoMap (or enable AutoMap While Drawing), save, then run
  `npm run sync:level` before browser verification.

## Capabilities

### New Capabilities

- `tiled-automapping`: Tiled authors can generate and update FoozleLab
  structure-block boundaries from a simple paintable footprint.

### Modified Capabilities

- None.

## Impact

- Tiled authoring data under `phaser4-platformer/assets/tiled/`, including the
  project configuration, a `rules.txt` registry, and FoozleLab rule map(s).
- The Tiled authoring instructions in `README.md` and focused level validation
  in `phaser4-platformer/test/page.test.mjs`.
- No new runtime dependency or Phaser gameplay API is expected; generated
  structure remains on the existing solid `Midground1` layer and reaches the
  runtime through the existing `npm run sync:level` export.
