## Context

The current scene uses `Phaser.AUTO`, a full-window resize canvas, a manually
moved rectangle player, and a status label that incorrectly says WebGPU. See
proposal.md for the motivation. The installed Phaser 4 build supports the
requested GPU layer APIs through WebGL, not WebGPU. The existing
`virtual-controller` capability sizes its controller zone in unscaled canvas
pixels, which would fill a 320 by 180 logical scene if left unchanged.

## Goals / Non-Goals

**Goals:**

- Keep authoring, game-world, and collision values in a consistent 32-pixel
  source grid while presenting a crisp low-resolution game.
- Make the Tiled files useful directly in the editor and make their exported
  map reliable at runtime.
- Use the specified GPU layer APIs within their real single-texture WebGL
  constraints.
- Preserve the existing HTML shell and supplied control/player assets.

**Non-Goals:**

- WebGPU rendering, a Canvas fallback, new runtime dependencies, new player
  artwork, enemy gameplay, scrolling camera progression, projectiles, or a
  combat system.
- A claim or stress test that this small demo draws one million sprites.

## Decisions

### Require WebGL and report it truthfully

Configure Phaser to require WebGL, rather than allowing `AUTO` to choose a
fallback, and derive the status text from the actual canvas plus the fixed
logical-size contract. This matches the installed Phaser renderer and prevents
the WebGPU status from misleading users.

`AUTO` with a Canvas fallback was considered, but it cannot meet the requested
GPU-layer requirement. WebGPU was rejected because this Phaser installation
does not expose it as a renderer option.

### Use a 320 by 180 logical scene with FIT presentation scaling

The game stays at 320 by 180 logical pixels, uses pixel-art sampling, and
fit-scales into the available display. At the requested 1280 by 720 target,
the presentation scale is exactly 4x: a 32-pixel Tiled tile remains 32 in
world/physics space and is drawn as 128 presentation pixels. Other aspect
ratios or sizes are fit-scaled rather than modifying Tiled tile dimensions.

Scaling the map, physics bodies, and controller constants by four was
considered, but it would make editor measurements diverge from runtime
collision measurements.

### Keep separate Tiled authoring and runtime map forms

The authored project will contain an editable `.tmj` level and external `.tsj`
tilesets for all three supplied image sheets. A runtime JSON export will embed
the tileset definitions while preserving the same layer names, grid, and tile
data. This accommodates the Phaser Tiled parser's embedded-tileset requirement
without sacrificing editor-friendly external tilesets.

Using only an externally referenced runtime map was rejected because the
installed parser warns that external tilesets are unsupported. Using only an
embedded map was rejected because separate `.tsj` files make the palette and
collision metadata reusable in Tiled.

### Assign one tilesheet to each GPU-rendered map layer

The authored map will include all three tilesets. The repeated `Background`
will use the Pirate Ship terrain-and-back-wall image, while `Foreground` will
use the Pirate Ship platforms image for its five-tile platforms. Palm Tree
Island terrain remains available in the Tiled palette for future painting.
This permits one GPU tile-map layer per map layer, each backed by one source
texture. Existing static scenery such as a supplied cloud image will be placed
in a WebGL sprite GPU layer behind the tile maps.

Combining tiles from multiple source images in a single GPU tile-map layer was
rejected because the selected GPU tile-map facility accepts one tileset texture
per layer. Rendering every tile as an individual sprite was rejected because it
would not meet the requested batching approach.

### Use Arcade Physics for the square player and foreground collision

The existing rectangle becomes a physics body with gravity. The runtime marks
foreground platform tiles collidable and creates a player/foreground collider;
background remains visual-only. The player begins above one platform. Horizontal
velocity is set from the Move joystick or A/D/Left/Right, Action 1 applies an
upward velocity only when grounded, and Action 2 applies a short alpha flicker
tween to the same square.

Free two-axis manual translation was rejected because it bypasses platform
collision and gravity. New sprite artwork and attack entities are outside the
requested slice.

### Measure controller UI in logical coordinates

The controller zone minimum changes from 180 canvas pixels to 45 logical
pixels, which presents as 180 pixels at the 4x target. Joystick and action
sizes will similarly use source-size constants that preserve their intended
physical presence at 4x. The move input consumes only its horizontal component;
vertical direction may move the handle visually only insofar as needed to
return it to center, but never changes player motion.

Keeping the old 180-pixel minimum was rejected because it consumes the entire
180-pixel logical game height.

## Risks / Trade-offs

- [A Tiled edit can leave the embedded runtime export stale] → Document the
  export target and validate both authoring and runtime map layer/tileset data
  in focused tests.
- [GPU tile-map layers require one image source per layer] → Keep the painted
  background and foreground restricted to their assigned source tilesheets;
  retain the third tileset as an editor palette item.
- [FIT scaling can be fractional away from 1280 by 720] → Keep the exact 4x
  target documented and retain pixel-art sampling; do not change source tile
  or physics sizes for other displays.
- [A renderer unsupported by the browser prevents startup] → This is an
  intentional consequence of requiring WebGL without a Canvas fallback; test
  in a WebGL-capable desktop browser.

## Migration Plan

1. Add the Tiled authoring files, embedded runtime export, and source checks
   before replacing scene startup behavior.
2. Switch the scene, renderer status, controller mappings, and README together
   so the UI and behavior do not advertise obsolete controls or WebGPU.
3. Run focused tests, production build, and a WebGL-capable browser smoke test.
4. If a release rollback is necessary, deploy the preceding build; this change
   introduces no stored player data or data migration.
