## Why

Developers need quick, discoverable access to the platformer's visual debug
settings without obscuring the game or mixing settings controls into the
virtual controller.

## What Changes

- Add an upper-right settings stack beneath the existing GitHub link.
- Provide camera-deadzone and tilemap debug controls that expose their state
  with `aria-pressed` and state-specific checkmark text.
- Give every settings control the shared FPS-status text styling and text-only
  interaction feedback rather than button chrome.
- Persist each debug setting in browser storage and apply it to the Phaser
  scene when the UI state changes.

## Capabilities

### New Capabilities

- `ui-settings`: Upper-right, accessible visual-debug settings controls and
  their consistent presentation and state behavior.

### Modified Capabilities

- None.

## Impact

- Affects `phaser4-platformer/src/ui.jsx`, `ui.css`,
  `platformer-ui-bridge.js`, and `main.js`.
- Extends the existing React overlay and Phaser scene bridge without adding
  dependencies or external services.
