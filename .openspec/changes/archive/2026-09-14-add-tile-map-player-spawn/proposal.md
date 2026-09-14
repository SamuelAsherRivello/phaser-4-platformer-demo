## Why

The current 10 by 5 Tiled level is too small to exercise scrolling and its
player is spawned from fixed scene dimensions rather than authored level data.
Expanding the editable level and defining a spawn point in the map makes level
layout, starting position, and runtime behavior agree.

## What Changes

- Expand the playable Tiled level from 10 by 5 tiles to a 15 by 15 tile grid,
  retaining its 32 by 32 source-pixel tile measurements.
- Keep exactly the existing `Background` and `Foreground` tile layers while
  extending their authored terrain and solid-platform layout across the larger
  map.
- Add a named player-spawn point object to the Tiled map at a lower-left-of-
  center location, positioned above a foreground platform.
- Export the matching embedded runtime map and create the player at that map
  object instead of deriving its position from fixed level constants.
- Add focused checks that keep the Tiled authoring map, runtime export, map
  dimensions, and spawn-object contract aligned.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `tiled-platformer-level`: Define the larger playable grid and a Tiled-authored
  player spawn object that the Phaser scene uses.

## Impact

- Affects the Tiled authoring map, embedded runtime JSON export, Phaser scene
  map/spawn setup, and focused source checks.
- Preserves the existing Phaser, Tiled, WebGL, physics, and dependency
  contracts; no new package, API, service, or artwork is needed.
