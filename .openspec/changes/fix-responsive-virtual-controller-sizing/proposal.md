## Why

The fixed 120 CSS px virtual controls look appropriate on a PC but occupy too
much of a portrait phone viewport, causing the right action control and its
label to crowd or extend beyond the visible safe area. Players need controls
that remain comfortable to touch without obscuring the mobile game view.

## What Changes

- Replace the fixed controller artwork, layout-zone height, and downward offset
  contract with a responsive sizing contract.
- Preserve the current 120 CSS px control artwork at desktop-sized viewports.
- Reduce controller artwork, labels, gaps, layout-zone height, and vertical
  offset together at compact portrait widths so all three controls remain fully
  visible within the UI safe area.
- Keep the existing controller artwork, labels, fixed input bindings, and
  touch/keyboard behavior unchanged.
- Add automated layout coverage and real-browser checks for both desktop and
  portrait mobile viewports.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `virtual-controller`: Replace its fixed-size safe-area controller-zone
  requirement with responsive desktop and compact-mobile sizing requirements.

## Impact

- Affected code: `phaser4-platformer/src/ui.css`,
  `phaser4-platformer/src/main.js`, and the existing controller layout tests.
- No new dependencies, remapping UI, controller artwork, or input behavior.
