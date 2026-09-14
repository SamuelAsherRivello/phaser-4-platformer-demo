# Edit Level Design

## Open the level

Open [Level01.tmj](../phaser4-platformer/assets/tiled/Level01.tmj) through
[PhaserPlatformer.tiled-project](../phaser4-platformer/assets/tiled/PhaserPlatformer.tiled-project).
The map uses these editor layers:

- `Background`, `Midground1`, and `Midground2` render behind the player.
- `Foreground` renders in front of the player.
- Only `Midground1` blocks player movement.
- `Objects` contains the `PlayerSpawn` point, which controls the player's
  game position.

The map uses FoozleLab external tilesets from
`phaser4-platformer/assets/tiled/tilesets/`.

## Paint deterministic structure frames

1. Create a tile layer named `StructureMask` directly below `Midground1`.
   `Midground1` stays visible on top and remains the only collision layer.
2. On `StructureMask`, choose the plain center tile (the middle cell of the
   3 by 3 FoozleLab room frame) and use Shape Fill to drag a solid rectangle
   at least 3 by 3 tiles.
3. Choose **Map → AutoMap While Drawing**. The project rule writes exactly one
   matching corner, edge, or center tile into `Midground1` as the rectangle is
   changed. Press `Ctrl+M` once if you are applying an existing mask.
4. Do not use Terrain Fill Mode for these rooms. The source sheet has a 3×3
   room frame, not all of the tile variations required for general freeform
   terrain blobs.

This rule intentionally supports solid rectangles. Add matching art variants
before using it for irregular blobs or rooms smaller than 3 by 3 tiles.

## Save and run

1. Save the map in Tiled.
2. From the repository root, run `npm run sync:level` to update the editor-data
   copy and WebGL-safe runtime map.
3. Reload the browser and check the edited structure in the game.
