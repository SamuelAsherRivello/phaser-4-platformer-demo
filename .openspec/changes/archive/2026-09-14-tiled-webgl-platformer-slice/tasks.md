## 1. Tiled level assets

- [x] 1.1 Create the Tiled authoring project, one TMJ level, and external TSJ tilesets for the three supplied 32 by 32 TreasureHunters image sheets; verify each tileset opens in Tiled with the correct image path and grid.
- [x] 1.2 Author the runtime embedded-tileset JSON export with exactly Background and Foreground tile layers, a repeated background tile, and multiple exactly five-tile foreground platforms; verify a focused map-structure test confirms its layers, palette, and platform runs.

## 2. WebGL scene and GPU batches

- [x] 2.1 Replace the auto renderer and resize-only scene configuration with required WebGL, pixel-art 320 by 180 logical dimensions, and FIT/centered presentation scaling; verify the renderer-status source check and a 1280 by 720 browser viewport report WebGL and the 4x logical presentation.
- [x] 2.2 Load the runtime Tiled export and supplied images, render static decoration through SpriteGPULayer, and render Background and Foreground through separate TilemapGPULayer instances with their assigned single tilesheets; verify focused source checks cover both batch types and the level visibly renders in a WebGL browser.

## 3. Physics and controller behavior

- [x] 3.1 Give the existing square player an Arcade Physics body, gravity, a foreground tile collision, and an airborne spawn above a five-tile platform; verify a browser smoke test shows it falling and landing without background collision.
- [x] 3.2 Replace free two-axis movement with A/D and Left/Right horizontal velocity, ignore W/S and Up/Down gameplay movement, and resize the safe controller zone and controls in logical coordinates; verify focused input checks cover horizontal-only movement and the controls remain inside the 5-percent safe area.
- [x] 3.3 Bind Action 1/C to a grounded jump and Action 2/V to a short flicker tween on the existing square while retaining touch pressed-state feedback; verify each action through keyboard and virtual-control browser interaction and confirm no player art or projectile is added.

## 4. Documentation and validation

- [x] 4.1 Update the README controls and rendering notes to identify WebGL, the 32-pixel grid, 320 by 180 logical dimensions, 1280 by 720 exact-4x presentation, and the Tiled authoring/export locations; verify the documented paths exist.
- [x] 4.2 Update focused tests for renderer selection, Tiled asset structure, GPU layers, physics, and controller actions; verify npm test passes from the repository root.
- [x] 4.3 Build and smoke-test the complete slice in a WebGL-capable browser at 1280 by 720; verify npm run build passes and the scene visibly shows the background, platforms, player landing, left/right movement, jump, and attack flicker.
