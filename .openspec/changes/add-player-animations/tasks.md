## 1. Character contract and asset catalog

- [x] 1.1 Add failing focused tests for the nine Foozle Player sheet paths, 32 by 32 frames, exact frame counts, loop flags, right-facing default, and animation priority; verify the new focused test fails before production code changes.
- [x] 1.2 Add a Foozle Player catalog and pure player-state module for jump allowance, wall-grab selection, attack timestamps, health, hit protection, and terminal death; verify the focused state tests cover every catalog entry and transition.
- [ ] 1.3 Load all supplied Foozle Player sheets and replace the blue visual rectangle with a native-size sprite and one 32 by 32 Arcade grid-cell collider; verify the scene test asserts the exact body dimensions, sprite origin, and all animation registrations.

## 2. Platforming and combat animation behavior

- [ ] 2.1 Integrate grounded idle/run, one ground jump plus one air jump, and the visual-only airborne directional wall-grab predicate; verify focused tests cover landing resets, second-air-jump rejection, and all wall-grab exit conditions.
- [ ] 2.2 Implement the strictly-less-than-500-ms Action 2 chain so slow presses are light and rapid presses alternate light/heavy without freezing movement; verify deterministic timestamp tests cover 499 ms, 500 ms, interrupted attacks, and dead-input rejection.
- [ ] 2.3 Update the control documentation to state that Action 1 supports the double jump and Action 2 selects the timed light/heavy chain; verify the README remains accurate to the unchanged keyboard and touch bindings.

## 3. Laser-spike hazards and terminal death

- [ ] 3.1 Add failing map/scene tests that identify every authored laser-spike placement separately from control panels, saws, and wall blades; verify the test fails before sensor creation.
- [ ] 3.2 Create a red 32 by 32 non-blocking overlap sensor for each laser-spike placement and no sensor for other animated set pieces; verify focused tests cover authored alignment, red rendering, pass-through behavior, and full set-piece coverage.
- [ ] 3.3 Apply 25-point laser damage, 500-ms hit protection, directional knockback, hurt playback, and one-time zero-health death that stops body motion and ignores all gameplay input until refresh; verify focused state and scene tests cover all four valid hits and the post-death no-op behavior.

## 4. Verification

- [ ] 4.1 Run the focused player-state and scene/map tests, then `npm test` and `npm run build`; verify all changed-scope checks pass and report unrelated pre-existing failures separately.
- [ ] 4.2 Perform a real-browser desktop and portrait check of idle, running both directions, ground jump, double jump, wall grab, the slow and rapid attack cadences, red laser-spike damage, knockback, four-hit death, blocked post-death input, sprite/body alignment, and console errors; record the live local URL and findings.
