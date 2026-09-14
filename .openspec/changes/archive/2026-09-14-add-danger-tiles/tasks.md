## 1. Danger-tile runtime behavior

- [x] 1.1 Classify FoozleLab laser-spike, saw, wall-blade, and marked static tile GIDs 51, 60, and 79 as `Midground2` danger tiles while excluding control panels; verify every matching placement is discovered during rendering.
- [x] 1.2 Create one visible red, static 32 by 32 source-pixel overlap sensor for each discovered danger-tile placement; verify the sensors do not create a solid collision response.
- [x] 1.3 Route every danger-sensor overlap through the existing player-damage lifecycle; verify an accepted overlap removes 25 health and retains existing hit-protection, knockback, hurt, and death handling.

## 2. Regression coverage and validation

- [x] 2.1 Extend the map/runtime source test to assert animated danger placements plus static GIDs 51, 60, and 79 receive sensors and the two control panels remain harmless; verify the focused danger-tile test passes.
- [x] 2.2 Run `npm test` and `npm run build`; verify all change-related tests and the production build pass, and record any unrelated existing test failure separately.
- [x] 2.3 Run the local Vite app in a real browser; verify the marked spike and two stacked laser cells render the same red collider as the existing trap and that contact follows the 25-damage flow.

## Validation Notes

- `npm test` confirms the danger-tile coverage passes. Existing failures remain for renamed Tiled tileset labels and removed README control wording; neither failure is caused by this change.
- `npm run build` passes.
