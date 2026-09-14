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

## Paint structure terrain

1. Select the `Midground1` layer.
2. Open the `FoozleLab Structure` tileset and choose the `FoozleLab Structure`
   Edge Set in Tiled's Terrain Sets view.
3. Use the Terrain Brush to paint or adjust a structure block. The Edge Set
   chooses the matching corner, edge, and center tiles.
4. Use Shape Fill for rectangular blocks at least 3 by 3 tiles.

This first terrain set supports rectangular blocks only and does not use
Automapping.

## Save and run

1. Save the map in Tiled.
2. From the repository root, run `npm run sync:level` to update the editor-data
   copy and WebGL-safe runtime map.
3. Reload the browser and check the edited structure in the game.
