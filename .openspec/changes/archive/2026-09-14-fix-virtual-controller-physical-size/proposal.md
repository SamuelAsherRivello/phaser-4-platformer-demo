## Why

The virtual controller currently uses viewport-relative CSS sizing, so it shrinks with a window even though its fullscreen size is the desired usable touch-target size. The game presentation should continue to resize, but the controller should retain that physical on-screen size during window resizing.

## What Changes

- Set the Move and action joysticks to a shared fixed 120 CSS px size instead of scaling them with viewport width.
- Fit the controller labels and spacing into the supplied lower guide: a fixed 173 CSS px controller region, shifted 43 CSS px downward into that guide.
- Keep the controller anchored to the existing responsive safe-area edges while leaving Phaser gameplay and the non-controller UI responsive.
- Keep Phaser's recorded bottom virtual-controller layout envelope at the matching fixed height rather than a viewport-height ratio.
- Remove the touch-only virtual controls from sequential Tab navigation so focus advances through the surrounding page controls instead.
- Preserve all existing touch, keyboard, action, fullscreen, and controller-art behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `virtual-controller`: define fixed physical controller dimensions, a matching layout envelope, and touch-only focus behavior while the presentation resizes.

## Impact

- Affected UI: `phaser4-platformer/src/ui.css` and the existing React controller in `phaser4-platformer/src/ui.jsx`.
- Affected game layout: the virtual-controller exclusion-zone calculation in `phaser4-platformer/src/main.js`.
- Affected verification: focused source tests in `phaser4-platformer/test/page.test.mjs` plus browser resize checks.
- No new dependencies, APIs, assets, settings, or remappable controls.
