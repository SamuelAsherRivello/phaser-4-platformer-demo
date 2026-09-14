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

## Paint structure frames on the selected layer

1. Select the ordinary tile layer that should contain the artwork. There is no
   special mask layer and no required layer name. Keep `Midground1` selected
   when the room should block player movement.
2. In the bottom panel, open **Terrain Sets** and choose either **Blue Room
   Border** or **Dark Rounded Room Border**.
3. Select its **Structure** terrain color, enable **Terrain Fill Mode**, and
   choose Tiled's rectangular **Shape Fill** tool.
4. Drag a solid rectangle at least 3 by 3 tiles. Tiled chooses the matching
   corner, edge, and center tiles and writes them to that same selected layer.

Do not press `Ctrl+M`: AutoMap is disabled for this project. The two native
Terrain sets are intended for solid rectangular rooms. This source art has no
tiles for freeform holes, T-junctions, or concave corners.

## Save and run

1. Save the map in Tiled.
2. From the repository root, run `npm run sync:level` to update the editor-data
   copy and WebGL-safe runtime map.
3. Reload the browser and check the edited structure in the game.
