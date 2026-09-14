## Why

Building a FoozleLab block currently requires placing each edge, corner, and
fill tile by hand. The supplied 3 by 3 FoozleLab structure set is suited to
Tiled's Terrain Brush, which can select the matching border tiles while an
author paints a block directly.

## What Changes

- Add an Edge Set to the existing FoozleLab Structure external tileset, using
  the reference image's top-left 3 by 3 cells as Structure-versus-empty-space
  terrain patterns.
- Let authors paint rectangular FoozleLab blocks at least 3 by 3 tiles on
  `Midground1` with the Terrain Brush and Shape Fill, producing matching edge,
  corner, and center tiles as the block changes.
- Add one safe 3 by 3 terrain-painted demonstration block to Level 1, using
  the reference tileset cells without changing existing level geometry.
- Document the Terrain Brush and Shape Fill workflow, then retain the existing
  save, `npm run sync:level`, and browser-verification handoff.

## Capabilities

### New Capabilities

- `tiled-automapping`: Tiled authors can paint and update FoozleLab
  structure blocks with the native Terrain Brush. The legacy capability path
  is retained because this existing change is being revised in place.

### Modified Capabilities

- None.

## Impact

- Tiled authoring data under `phaser4-platformer/assets/tiled/`, primarily the
  existing FoozleLab Structure external tileset and Level 1 source map.
- The Tiled authoring instructions in `README.md` and focused level validation
  in `phaser4-platformer/test/page.test.mjs`.
- No new runtime dependency or Phaser gameplay API is expected; generated
  structure remains on the existing solid `Midground1` layer and reaches the
  runtime through the existing `npm run sync:level` export.
