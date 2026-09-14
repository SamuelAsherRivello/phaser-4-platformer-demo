## 1. Settings state and engine integration

- [x] 1.1 Add camera and tilemap debug booleans to the shared UI state, persist
  them in browser storage, and verify the bridge publishes changes to Phaser.
- [x] 1.2 Render and clear camera-deadzone and tilemap graphics from Phaser in
  response to the current settings, and verify each debug overlay can be
  enabled and disabled independently.

## 2. Upper-right settings presentation

- [x] 2.1 Add Camera and Tilemap native controls beneath the GitHub link with
  `aria-pressed`, and verify the header presents the settings as a vertical
  upper-right stack.
- [x] 2.2 Apply the shared FPS-status text style and text-only interaction
  feedback to settings controls, and verify no persistent border or background
  chrome is rendered.
- [x] 2.3 Show the Tilemap checked or unchecked emoji from its current state,
  and verify the label changes with the debug render state.

## 3. Verification

- [x] 3.1 Run the focused settings tests and production build, then verify in a
  real browser that the settings stack, text styling, and both Tilemap states
  render correctly.
