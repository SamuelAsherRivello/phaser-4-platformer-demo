## Why

The current demo labels itself as WebGPU while it runs through Phaser's WebGL
renderer, and it provides free two-axis square movement rather than a
platformer level. This change establishes an honest WebGL-only rendering
contract and a small, Tiled-authored platformer slice using the supplied
TreasureHunters artwork.

## What Changes

- Require Phaser's WebGL renderer with no Canvas fallback and report the actual
  WebGL render mode and logical resolution in the HTML status UI.
- Add a 320 by 180 logical, pixel-art scene that is fit-scaled to the available
  display (1280 by 720 is an exact 4x presentation) while keeping Tiled and
  physics measurements at 32 by 32 source pixels.
- Add a Tiled project with one level, all supplied 32-pixel tilesheets, and
  exactly `Background` and `Foreground` tile layers. Paint a one-tile
  background and several five-tile foreground platforms.
- Render static existing-art decoration through `SpriteGPULayer` and each
  compatible map layer through `TilemapGPULayer`; do not present those WebGL
  batching features as WebGPU support.
- Replace free-flight player movement with Arcade Physics, platform collisions,
  left/right movement, grounded jumping, and a flicker-only attack response.
- **BREAKING** Change virtual movement from two-axis WASD/arrow movement to
  horizontal-only left/right input. Up and down have no gameplay action.

## Capabilities

### New Capabilities

- `webgl-gpu-rendering`: WebGL-only renderer reporting and GPU-layer rendering
  expectations for the Phaser scene.
- `tiled-platformer-level`: Tiled-authored level assets, scaling contract, map
  layers, and physics-backed platform presentation.

### Modified Capabilities

- `virtual-controller`: Redefine movement as horizontal-only and bind Action 1
  to jump and Action 2 to the attack flicker while retaining synchronized touch
  and keyboard feedback.

## Impact

- Affected runtime: `phaser4-platformer/src/main.js` and
  `phaser4-platformer/index.html`.
- Affected assets: new Tiled project/map/tileset files under
  `phaser4-platformer/assets/`, referencing only the supplied TreasureHunters
  artwork.
- Affected verification and documentation: focused source checks and the
  controls/rendering guidance in `README.md`.
- No new runtime dependency is proposed; the project continues to use Phaser 4
  and Vite.
