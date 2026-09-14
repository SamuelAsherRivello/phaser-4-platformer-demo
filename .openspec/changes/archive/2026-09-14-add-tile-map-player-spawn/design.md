## Context

The Phaser 4 scene currently loads the embedded runtime map at
`phaser4-platformer/assets/maps/treasure-hunters-level.json`, but creates the
player from JavaScript constants for a 10 by 5 map. The editable Tiled source
is `phaser4-platformer/assets/tiled/treasure-hunters-level.tmj`; the project
README requires a matching embedded JSON export after map edits. The current
scene creates only the two named tile layers, and its resize layout caps Arcade
Physics bounds at the virtual-controller region, which is incompatible with a
480-pixel-tall level and the requested lower-left-of-center spawn. See
`proposal.md` and the `tiled-platformer-level` delta spec for the behavior
contract.

## Goals / Non-Goals

**Goals:**

- Make the Tiled map the single authored source for both level extent and
  player-start placement.
- Keep the 320 by 180 viewport, 32-pixel grid, existing tilesets, WebGL tile
  layers, square player, and foreground collision behavior intact.
- Keep source and export verifiably synchronized and make the expanded world
  physically traversable.

**Non-Goals:**

- Adding new art, an additional tile layer, enemies, collectibles, controls,
  UI, or a new runtime dependency.
- Changing camera behavior beyond allowing its existing map-derived bounds to
  use the larger map.
- Supporting multiple player spawn points, runtime spawn selection, or a
  fallback to an arbitrary fixed spawn position.

## Decisions

### Author one named Tiled point object in a non-tile layer

Add an `Objects` object layer to the authoring TMJ and place one `PlayerSpawn`
point at tile column 6, row 9's center (208, 304). Maintain the `Background`
and `Foreground` layers as the map's only tile layers, extending their data to
15 rows by 15 columns and keeping the spawn's destination platform immediately
below it. Export the same objects and tile data to the embedded runtime JSON.

This records a level-designer-controlled coordinate in Tiled without weakening
the established two-tile-layer contract.

Alternative considered: retain a JavaScript center-position formula. Rejected
because it would drift whenever the map or intended start location changes.

### Resolve the spawn from the loaded runtime map before creating the player

After the map is constructed, locate the single `PlayerSpawn` point in the
`Objects` layer and pass its source-pixel coordinates to the existing player
creation path. Treat a missing, duplicate, or non-point object as an explicit
map-contract failure instead of silently returning to the previous centered
spawn. Keep collision setup after the player is created so the player falls
onto the authored foreground platform.

Alternative considered: add a custom map property with X/Y values. Rejected
because a visual point object is easier to edit and validate in Tiled.

### Derive physical bounds from map dimensions, not the HUD controller area

Set Arcade Physics world bounds to the loaded map's full pixel width and
height. The React controller's screen-space safe area remains a UI/input
concern and must not limit world coordinates. Existing camera code already
reads map dimensions, so it will inherit the 480 by 480 world bounds.

Alternative considered: leave the controller-area cap in place. Rejected
because it would clamp or reject the required 304-pixel spawn in the taller
world.

### Verify authored and runtime maps as matching gameplay inputs

Extend the focused Node tests to parse both maps, verify their 15 by 15
dimensions, retained tile-layer names, matching tileset references/data, and
the exact `Objects`/`PlayerSpawn` point. Add source checks for map-object spawn
lookup and full-world physics bounds. Browser verification will confirm that
the player begins below viewport center, falls, lands on the intended platform,
and can move through the larger scrollable world.

Alternative considered: only inspect the TMJ manually in Tiled. Rejected
because the game loads a separate export and could otherwise ship stale data.

## Risks / Trade-offs

- [The TMJ and embedded runtime JSON diverge] → Parse and compare their
  gameplay-relevant map metadata in focused tests, then document exporting the
  JSON after Tiled edits.
- [The point coordinate represents a tile corner rather than its center] →
  Assert the explicit 208 by 304 source-pixel coordinate and create the
  center-anchored square there.
- [The existing physics bounds continue to use controller-area geometry] →
  Replace that cap with full map dimensions and test the map-bound expression.
- [A change to the in-flight camera-deadzone work overlaps map setup] → Keep
  this change limited to the loaded map dimensions and avoid duplicating camera
  logic; resolve any source overlap while applying changes.

## Migration Plan

1. Resize and lay out the TMJ, add `Objects` and `PlayerSpawn`, then export the
   equivalent embedded runtime JSON.
2. Replace fixed map-size/spawn constants with runtime map dimensions and the
   required spawn-object lookup; expand physics bounds to the full map.
3. Add focused map-alignment and scene-contract tests, run the repository test
   and build commands, and perform a browser smoke check.
4. Roll back by restoring the prior map pair and fixed spawn path together; do
   not revert only one map representation.
