## 1. Fixed controller input

- [x] 1.1 Replace the virtual controller's hard-coded keyboard key set and action state calculation so W/A/S/D and Arrow keys are recognized, C and Space request Action 1, and B requests Action 2; preserve the existing touch-intent composition and verify the focused controller checks cover the mapping.
- [x] 1.2 Update the virtual controller labels to show `Move (WASD / Arrows)`, `Action 1 (C)`, and `Action 2 (B)` without displaying Space or adding remapping UI; verify the rendered UI source checks assert the visible labels and hidden-binding constraint.

## 2. Documentation and verification

- [x] 2.1 Update the README Controls section to document the visible fixed bindings and not the hidden Space jump binding; verify the documented labels agree with the UI.
- [x] 2.2 Run `npm test` and `npm run build` from the repository root; verify both commands succeed and the change leaves the existing touch controller and Phaser input bridge intact.
