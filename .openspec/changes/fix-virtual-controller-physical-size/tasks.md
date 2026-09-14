## 1. Fixed Controller Geometry

- [ ] 1.1 Replace the virtual-controller CSS viewport-relative art sizes, labels, action gaps, and controller height with the established fixed CSS-pixel guide envelope while preserving its responsive safe-edge anchors; verify the controller stylesheet contains no viewport-based size rule for that envelope.
- [ ] 1.2 Replace Phaser's ratio-based virtual-controller exclusion-zone height with the corresponding named fixed envelope while continuing to recalculate its position and width on layout; verify the layout source reserves that fixed height and retains safe-area alignment.

## 2. Regression Coverage

- [ ] 2.1 Update `phaser4-platformer/test/page.test.mjs` so it asserts the fixed Move and action dimensions, fixed controller-envelope layout contract, and the removal of the superseded responsive controller sizing; verify `npm test` passes.
- [ ] 2.2 Preserve the existing virtual-controller artwork, labels, input bindings, and Phaser-exclusion assertions when updating the focused test; verify the full focused test suite still covers those behaviors.

## 3. Browser Verification

- [ ] 3.1 Build the Vite app from the repository root and verify `npm run build` succeeds.
- [ ] 3.2 Run the app in a real browser at a fullscreen-like desktop viewport and a smaller desktop window; verify the game and surrounding UI resize, while the Move and action controls retain their fixed CSS-pixel sizes, remain safely anchored, accept pointer input, and keep gameplay outside the controller envelope.
