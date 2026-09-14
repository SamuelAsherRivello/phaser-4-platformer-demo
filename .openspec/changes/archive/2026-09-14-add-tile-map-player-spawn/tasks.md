## 1. Tiled map authoring and export

- [x] 1.1 Resize `treasure-hunters-level.tmj` to 15 by 15 32-pixel tiles, fill all Background cells, and arrange multiple five-tile Foreground platforms including one directly below the planned spawn; verify both tile layers contain 225 cells and preserve their names and tileset references.
- [x] 1.2 Add the sole `Objects`-layer point object named `PlayerSpawn` at source-pixel coordinate 208 by 304, then export matching embedded tile and object data to `assets/maps/treasure-hunters-level.json`; verify the authoring map and runtime export agree on dimensions, layers, tilesets, and the spawn object.

## 2. Map-driven scene setup

- [x] 2.1 Replace fixed level-size and centered-player placement in `src/main.js` with validation and lookup of the loaded map's single `Objects`/`PlayerSpawn` point; verify the square player is created at that authored source-pixel coordinate and still collides with Foreground.
- [x] 2.2 Set Arcade Physics world bounds from the loaded map's complete pixel width and height rather than the virtual-controller region; verify the 480 by 480 world permits the lower-left-of-center spawn and preserves world-bound collision.

## 3. Verification

- [x] 3.1 Extend `phaser4-platformer/test/page.test.mjs` to parse both map representations and assert the 15 by 15 grid, exactly two named tile layers, `Objects`/`PlayerSpawn` point, runtime spawn lookup, and full-map physics bounds; verify `npm test` passes.
- [x] 3.2 Build and run the Vite application, then perform a browser smoke check that the player begins at the authored lower-left-of-center point, falls onto its platform, and can move within the larger scrollable level; verify `npm run build` succeeds and record the live local URL used.
