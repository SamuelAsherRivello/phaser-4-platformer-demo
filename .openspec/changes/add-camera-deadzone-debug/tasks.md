## 1. Phaser camera behavior

- [x] 1.1 Configure the main Phaser camera to follow the existing player, bound it to the loaded map's pixel dimensions, and recalculate a centered 50-percent-width by 50-percent-height deadzone on viewport resize; verify focused source checks cover follow, bounds, half-viewport geometry, and resize handling.
- [x] 1.2 Add a camera-fixed Phaser graphics outline that is absent while camera debugging is off and exactly traces the current centered deadzone when on; verify it remains centered on-screen while camera scroll and resize occur.

## 2. Persistent HUD control and bridge

- [x] 2.1 Extend the existing React-to-Phaser UI bridge with observable camera-debug state, and add guarded browser-local HUD-settings read/write behavior that defaults to off and immediately saves a changed value; verify focused tests cover the off default, persistence key/value flow, and bridge notification.
- [x] 2.2 Add the accessible `Camera ✅` control directly below the top-right GitHub icon, including its pressed state, pointer-event styling, and immediate bridge update; verify keyboard and pointer activation toggle the outline without affecting the existing header link or controller controls.

## 3. Regression coverage and validation

- [x] 3.1 Extend `phaser4-platformer/test/page.test.mjs` with focused assertions for the camera follow/deadzone APIs, deadzone debug graphics, persistent HUD control, and bridge behavior; verify `npm test` passes from the repository root.
- [x] 3.2 Run `npm run build` from the repository root and verify Vite completes successfully without adding dependencies.
- [ ] 3.3 Run the app in a real browser and verify camera movement begins only after the player reaches the centered 50-by-50-percent deadzone boundary, the default view has no outline, `Camera ✅` directly below GitHub toggles the exact outline, and its on/off state restores after a refresh at desktop and narrow viewport sizes.
