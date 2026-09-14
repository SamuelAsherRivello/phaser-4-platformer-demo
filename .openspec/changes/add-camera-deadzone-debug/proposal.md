## Why

The platformer world can extend beyond the visible game viewport, but the
player is currently not followed by a camera. A centered deadzone will keep
the player's view stable during small movements while revealing more of the
level only when the player reaches the deadzone edge.

## What Changes

- Configure Phaser's main camera to follow the existing player and use a
  deadzone that is 50 percent of the active game viewport width and 50 percent
  of its height.
- Bound camera scrolling to the loaded Tiled world's pixel dimensions and
  recalculate the deadzone when the game viewport changes size.
- Add a `Camera ✅` HUD toggle directly below the top-right GitHub icon,
  defaulting to off, to show or hide an exact visual outline of the camera
  deadzone.
- Persist the toggle's state in browser-local storage as HUD settings so its
  current value survives a refresh; do not add server, account, or network
  persistence.
- Add focused automated and browser verification for camera following,
  deadzone geometry, debug visibility, and persisted HUD state.

## Capabilities

### New Capabilities

- `camera-deadzone-debug`: Follow the player with a viewport-relative Phaser
  deadzone and expose a persistent HUD debug control for its visual boundary.

### Modified Capabilities

- None.

## Impact

- Affects the Phaser scene and its camera setup, the React HUD, the existing
  browser-local UI-to-Phaser bridge, UI styling, and focused tests.
- Uses existing Phaser camera support and browser `localStorage`; no new
  dependency, public API, or network service is required.
