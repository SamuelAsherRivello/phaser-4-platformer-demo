## Why

The virtual controller currently uses viewport-relative CSS sizing, so it shrinks with a window even though its fullscreen size is the desired usable touch-target size. The game presentation should continue to resize, but the controller should retain that physical on-screen size during window resizing.

## What Changes

- Lock the Move joystick to its established 200 px guide size and each action joystick to its established 160 px guide size instead of scaling them with viewport width.
- Keep the controller labels, control spacing, and controller-region height at the matching fullscreen guide scale so the full controller remains readable and usable in a smaller window.
- Keep the controller anchored to the existing responsive safe-area edges while leaving Phaser gameplay and the non-controller UI responsive.
- Make Phaser's bottom virtual-controller exclusion zone follow the fixed controller envelope rather than a viewport-height ratio, preventing gameplay from appearing under the unscaled controls.
- Preserve all existing touch, keyboard, action, fullscreen, and controller-art behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `virtual-controller`: define fixed physical controller dimensions and an exclusion zone that stays aligned with them while the presentation resizes.

## Impact

- Affected UI: `phaser4-platformer/src/ui.css` and the existing React controller in `phaser4-platformer/src/ui.jsx`.
- Affected game layout: the virtual-controller exclusion-zone calculation in `phaser4-platformer/src/main.js`.
- Affected verification: focused source tests in `phaser4-platformer/test/page.test.mjs` plus browser resize checks.
- No new dependencies, APIs, assets, settings, or remappable controls.
