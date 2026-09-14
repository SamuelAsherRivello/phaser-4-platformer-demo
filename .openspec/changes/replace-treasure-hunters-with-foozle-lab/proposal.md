## Why

The current 81 by 51 Tiled world has the right playable extent, 32 by 32
tile scale, native 100 percent presentation, and map-authored player spawn,
but it is built from TreasureHunters artwork and an obsolete two-layer level
contract. Level 1 needs to become a FoozleLab sci-fi environment without
discarding the existing world size or the map-to-runtime player placement.

## What Changes

- Replace the TreasureHunters Tiled source map, external tilesets, and embedded
  runtime export with FoozleLab equivalents; retain all artwork directories,
  including the supplied FoozleLab source art.
- Preserve the existing 81 by 51, 32 by 32 world (2,592 by 1,632 source
  pixels) and its native 100 percent Phaser presentation.
- Define the Level 1 editor layer stack as `Background`, `Midground1`,
  `Midground2`, `Foreground`, and `Objects`. `Midground1` is behind the player
  and solid; `Midground2` is behind the player and pass-through; `Foreground`
  is in front of the player and begins empty.
- Keep exactly one map-authored `PlayerSpawn` point and create the existing
  player rectangle at that position before rendering the game scene.
- Use FoozleLab 32 by 32 tilesets for structure, decor, and the panel, laser
  spike, saw, and wall-blade animation frames. Tiled authors animated
  placements together in `Midground2`; runtime expansion renders every
  animated tile instance separately through Phaser's native Tiled tile
  animation support.
- Make the first implementation pass intentionally small: author one solid
  `Midground1` platform centered in the 81 by 51 map, place `PlayerSpawn`
  directly above it, and repeat a blocking tile only along the left edge, the
  top-right edge, and the bottom edge. Pause after browser verification and ask
  the user to test this layout before adding the fuller Level 1 composition.
- Keep animated set pieces visual-only in this change: no damage, death,
  reset, activation, or other gameplay interaction is introduced.

## Capabilities

### New Capabilities

- `foozle-lab-level`: FoozleLab Level 1 authoring, runtime layer expansion,
  and animated set-piece rendering.

### Modified Capabilities

- `tiled-platformer-level`: Replace the TreasureHunters palette, 15 by 15
  two-layer layout, and foreground collision contract with the retained 81 by
  51 FoozleLab world, four visual strata, `Midground1` collision, and one
  authored player spawn.
- `webgl-gpu-rendering`: Render the FoozleLab layer stack and per-instance
  animated tiles through WebGL GPU tile-map layers while preserving native
  Tiled animation data.

## Impact

- Affects the Tiled TMJ, external TSJ tilesets, embedded runtime JSON export,
  FoozleLab asset loading, Phaser layer/spawn composition, map-focused tests,
  and Tiled documentation.
- Preserves the existing Phaser 4.2.1, React UI, WebGL-only renderer, player
  dimensions and controls, native 100 percent scale, world bounds, and no-new-
  dependency policy.
- Acceptance for the first pass is visual and functional: the game loads the
  FoozleLab map, renders the player at its authored `PlayerSpawn` above the
  center platform, lands on that platform, and cannot cross the specified
  `Midground1` edge runs. The user will be asked to test this checkpoint before
  the broader Level 1 composition proceeds.
