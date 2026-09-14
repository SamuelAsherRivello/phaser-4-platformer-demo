## 1. Fixed Controller Geometry

- [x] 1.1 Replace the virtual-controller CSS viewport-relative art sizes, labels, action gaps, and controller height with the measured fullscreen fixed CSS-pixel envelope while preserving its responsive safe-edge anchors; verify the controller stylesheet contains no viewport-based size rule for that envelope.
- [x] 1.2 Replace Phaser's ratio-based virtual-controller layout-envelope height with the corresponding named fixed envelope while continuing to recalculate its position and width on layout; verify the layout source retains that fixed height and safe-area alignment.
- [x] 1.3 Remove the Move and action touch buttons from sequential Tab navigation without changing their pointer handlers or the page-level keyboard bindings; verify the JSX uses an explicit negative tab index for all three controls.

## 2. Regression Coverage

- [x] 2.1 Update `phaser4-platformer/test/page.test.mjs` so it asserts the fixed Move and action dimensions, fixed controller-envelope layout contract, and the removal of the superseded responsive controller sizing; verify `npm test` passes.
- [x] 2.2 Add a regression test that sequential Tab navigation skips the three touch buttons while existing controller artwork, labels, pointer handlers, and global keyboard bindings remain present; verify the full focused test suite still covers those behaviors.

## 3. Browser Verification

- [x] 3.1 Build the Vite app from the repository root and verify `npm run build` succeeds.
- [x] 3.2 Run the app in a real browser at a fullscreen-like desktop viewport and a smaller desktop window; verify the surrounding UI resizes while the Move and action controls retain their fixed CSS-pixel sizes, remain safely anchored, accept pointer input, and are skipped by sequential Tab navigation.

## 4. Lower Guide Fit

- [x] 4.1 Resize the Move and action art, labels, gaps, and controller row to fit the supplied lower purple guide without reintroducing viewport-relative controller sizing.
- [x] 4.2 Update Phaser's recorded controller layout envelope to the matching lower-guide height.
- [x] 4.3 Update the focused regression test and verify `npm test` passes.
- [x] 4.4 Verify in a real 1280 by 649 CSS-pixel browser viewport that all three controls and labels sit inside the lower guide and remain skipped by Tab navigation.
