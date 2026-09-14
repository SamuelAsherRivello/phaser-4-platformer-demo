## Why

The touch controller is currently rendered and hit-tested inside the Phaser
scene, while the surrounding UI is static HTML. Making the whole UI layer a
React-rendered interface separates browser UI from game rendering while
preserving the established mobile control layout and visible header/footer
content.

## What Changes

- Replace the static UI-layer header, body, and footer markup with one React
  UI application mounted in `#ui_layer`, preserving the existing title,
  renderer status, FPS status, repository link, and version text.
- Render the virtual controller through React inside that application's body
  region and anchor its controls along the body region's bottom edge.
- Move the Move, Action 1, and Action 2 visual assets, labels, pointer
  handling, pressed states, and keyboard-feedback rendering out of Phaser and
  into that React UI component.
- Establish a narrow UI-to-Phaser input bridge so React control events retain
  the existing horizontal movement, jump, and attack behavior.
- Retain Phaser's non-rendered lower controller exclusion zone so the player
  cannot enter the space visually occupied by the UI controls.
- Preserve the current three-control order, artwork, approximate logical
  dimensions, safe-area insets, and left/right alignment.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `virtual-controller`: Render and operate the controller through the React UI
  layer rather than Phaser while preserving its layout, feedback, and gameplay
  contract.

## Impact

- Affects `phaser4-platformer/index.html`, `phaser4-platformer/src/main.js`,
  a new React UI entry/component area, focused source checks, and project
  dependencies to add React rendering.
- Adds a browser-local UI-to-game input boundary; no network, persistence, or
  public API changes are expected.
