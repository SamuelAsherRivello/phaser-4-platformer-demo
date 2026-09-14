## Context

The game runs a Phaser 4.2.1 scene behind a React-owned HTML HUD. The current
working tree also contains the in-flight `move-virtual-controller` change,
which establishes `platformer-ui-bridge.js` as the boundary between the React
UI and Phaser. The loaded Tiled map supplies the level dimensions, and Phaser
already provides camera following, camera bounds, and a dynamically centered
deadzone. See `proposal.md` and the `camera-deadzone-debug` delta spec for the
requested behavior.

## Goals / Non-Goals

**Goals:**

- Keep Phaser authoritative for the camera and debug drawing while the React
  HUD owns the accessible control and browser-local setting.
- Derive all camera geometry from the active viewport and loaded map rather
  than hard-coded target-resolution or level-size values.
- Keep the debug outline accurate after both camera movement and resize.

**Non-Goals:**

- Changing level content, player controls, physics, zoom, camera smoothing,
  or the WebGL-only rendering contract.
- Persisting settings to a server, account, file chosen by the user, or shared
  device profile.
- Adding a general settings menu or a UI dependency.

## Decisions

### Use Phaser's follow and deadzone APIs

After the player and map exist, configure the main camera with the map's pixel
bounds, follow the player with pixel rounding, and set a deadzone whose width
and height are half of the current camera viewport. Reapply only the deadzone
dimensions on Phaser resize events; Phaser keeps its deadzone centered while
following. This uses the installed engine's `startFollow`, `setBounds`, and
`setDeadzone` behavior, which already moves the view only after the followed
target leaves the deadzone.

Alternative considered: calculate camera scroll manually in `update`. Rejected
because it duplicates engine follow/bounds behavior and risks edge and resize
differences from Phaser's camera contract.

### Resize the Phaser canvas to the active browser viewport

The loaded map remains the world and camera-bounds source, but the Phaser
canvas must use the active browser viewport rather than the map dimensions.
With the existing `Scale.NONE` configuration, initialize its width and height
from the browser viewport and call `ScaleManager.resize` whenever that viewport
changes. The scene's existing Phaser resize listener then recalculates the
half-viewport deadzone and redraws the camera-fixed outline. Replace the
obsolete source check that requires the canvas to be map-sized with focused
checks for initial viewport sizing and the resize path.

Alternative considered: retain the map-sized canvas and derive an outline from
the cropped DOM viewport. Rejected because it would not be Phaser's actual
camera deadzone, could not make camera scroll observable on narrow screens,
and would violate the screen-aligned outline requirement.

### Draw a camera-fixed Phaser graphics outline

Create one Phaser graphics object for the debug boundary, make it ignore
camera scrolling, and redraw its centered rectangle from the current viewport
and deadzone dimensions after resize or a visibility change. Its visibility
will be controlled by the bridge state; when disabled it draws nothing and is
hidden. This keeps the outline in the game renderer, matches the actual
camera's screen-space geometry, and does not become a HUD DOM approximation.

Alternative considered: draw an HTML/CSS rectangle. Rejected because it could
drift from the Phaser viewport after scaling or resize and would not inspect
the engine's actual deadzone.

### Store HUD preferences locally and notify Phaser through the existing bridge

The React HUD will initialize camera-debug state from one namespaced,
versionable browser-local settings record, defaulting to `false` when absent
or unreadable. Activating `Camera ✅` updates the React state,
immediately writes that setting back to `localStorage`, and publishes the new
value through the UI bridge. Phaser subscribes to the value to update the
debug graphics. Storage reads and writes will be guarded so blocked browser
storage leaves a usable, non-persistent default rather than breaking gameplay.

Alternative considered: have Phaser read and write `localStorage` directly.
Rejected because the React HUD owns interactive settings and the bridge keeps
the game layer independent of browser UI concerns.

### Keep the camera control in the existing header's right-side action group

Add the `Camera ✅` control directly beneath the repository GitHub icon in a
top-right vertical action stack, with pointer events enabled, keyboard
operability, and an `aria-pressed` state.

Alternative considered: place the control in the game scene. Rejected because
it would compete with engine rendering and bypass the established React HUD.

## Risks / Trade-offs

- [The current viewport is as large as or larger than the map] → Camera bounds
  prevent exposing outside-world space; tests and browser checks will include a
  scrollable map extent so deadzone behavior remains observable.
- [HUD and Phaser changes overlap with the in-flight controller migration] →
  Integrate camera-state publication with the final bridge API rather than
  duplicating a second UI-to-game channel, and preserve unrelated working-tree
  changes.
- [Browser storage is unavailable or contains invalid data] → Treat it as an
  absent setting, retain the off default, and continue without persistence.
- [A debug graphic incorrectly scrolls with the world] → Verify it remains at
  the viewport center while the player moves the camera.
- [A prior source check assumes the canvas is map-sized] → Replace that check
  with focused viewport-size and Phaser-resize assertions; map dimensions stay
  authoritative for world and camera bounds.

## Migration Plan

1. Add the camera setup and resize-safe geometry, then add the camera-fixed
   graphics outline behind a disabled bridge setting.
2. Add the header control, local preference read/write, and bridge publishing.
3. Extend focused tests, build, and perform browser checks for off/on and
   refresh restoration at more than one viewport size.
4. Roll back by removing the new camera setup, debug graphics, and HUD setting;
   the existing player and UI behavior remain independent of persisted data.
