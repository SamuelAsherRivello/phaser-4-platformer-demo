## Context

The current Phaser 4.2.1 scene loads a Tiled JSON export, creates its player
from the sole `Objects`/`PlayerSpawn` point, and renders an 81 by 51 world at
32 by 32 source pixels and native scale. It currently creates only
TreasureHunters `Background` and `Foreground` GPU tile layers, with the
foreground supplying collision. See proposal.md and the change delta specs for
the required FoozleLab behavior.

## Goals / Non-Goals

**Goals:**

- Preserve the live map extent, tile size, native scale, authored spawn path,
  player dimensions, controls, camera, and world bounds.
- Replace the old Tiled assets with FoozleLab source and runtime map forms.
- Give level designers one normal `Midground2` authoring layer while rendering
  each animated placement independently at runtime.
- Deliver the requested center-platform and boundary test layout before the
  fuller Level 1 composition.

**Non-Goals:**

- Adding trap damage, deaths, respawns, switches, barriers, or other gameplay
  interactions.
- Changing the React UI, controller, player controls, player dimensions,
  jump-height multiplier, renderer selection, or adding dependencies.
- Removing any supplied artwork; only obsolete Tiled map and tileset files are
  removed after their FoozleLab replacements load successfully.

## Decisions

### Preserve the current map dimensions and spawn contract

Author and export the FoozleLab map at 81 by 51 32-pixel cells. Retain the
single point object named `PlayerSpawn`, place it immediately above the center
platform, and keep the existing strict missing-or-duplicate spawn validation.
The player therefore remains map-driven rather than being created from a
hard-coded world coordinate.

Alternative considered: shrink the first-pass map to the mockup viewport.
Rejected because the user explicitly approved the current world size.

### Make Midground1 the only collision layer

The scene will create the four authored strata in depth order: Background,
Midground1, Midground2, player, Foreground. Only Midground1 gets collision and
the player collider; surface-contact effects will read Midground1 rather than
the retired foreground layer.

Alternative considered: keep foreground as the physics surface. Rejected
because Foreground is reserved for future visual occlusion and starts empty.

### Keep one editor Midground2 layer and expand animation at runtime

The Tiled map keeps all animated placements in one familiar Midground2 layer.
At load time, identify animated tiles from their parsed Tiled tileset data and
do not render Midground2 as one multi-tileset GPU layer. Instead, create an
independent one-tile runtime map/layer at each authored coordinate, bound to
that tile's original tileset, so Phaser's TilemapGPULayer receives one
tilesheet and native Tiled animation metadata per instance. Static
non-animated Midground2 tiles remain on the normal Midground2 GPU layer.

Alternative considered: merge animation strips into a generated atlas.
Rejected because individual source tilesets and per-instance runtime layers
preserve direct ownership of animation sequences without altering source art.

### Stage the first browser-test checkpoint before fuller composition

The first map layout has one central solid platform, spawn above it, and only
the specified repeated boundary runs. After source tests, build, and browser
smoke verification, pause and ask the user to test. Do not expand the scene
with the mockup's fuller routes until that feedback arrives.

## Risks / Trade-offs

- [The old authoring map and embedded runtime export diverge] → Parse and
  compare their dimensions, layer order, tilesets, cells, and PlayerSpawn in
  focused tests.
- [A per-instance animated layer loses its original tile animation metadata] →
  assert animation records in the runtime export and inspect frame changes in
  the real browser.
- [Existing code still reads foreground surfaces] → route collision and
  surface-contact lookup through Midground1 and preserve the visual-only
  particle behavior.
- [Deleting old Tiled files breaks imports] → add and load replacement files
  before removing old map paths, then run the focused tests and production
  build.

## Migration Plan

1. Add FoozleLab external tilesets, the 81 by 51 TMJ, and its matching embedded
   runtime JSON with the requested first-pass geometry and PlayerSpawn.
2. Switch Phaser imports, tileset registration, static layer creation,
   collision, and player-surface lookup to the FoozleLab map contract; add the
   animated-placement expansion path but defer fuller scene placement.
3. Remove the old TreasureHunters Tiled authoring files and runtime export only
   after their FoozleLab replacements load.
4. Add focused source checks, run tests and build, then verify the browser and
   ask the user to test the first-pass level.
5. If the first pass fails, restore the prior Tiled file set and runtime import
   together rather than leaving an authoring/export mismatch.
