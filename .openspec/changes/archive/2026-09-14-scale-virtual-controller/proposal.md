## Why

The controller is too small after interpreting a percentage literally. The
user-supplied yellow boxes define the intended visual envelopes for each
control and its label.

## What Changes

- Size the Move control and label to fill most of the left yellow guide box,
  using a 200 px desktop art target.
- Size each Action control and label to fill most of its right yellow guide
  box, using a 160 px desktop art target.
- Set matching label, spacing, layout-height, and Phaser exclusion-zone values
  so the rendered controls occupy the supplied guide regions without moving
  their safe-edge anchors.
- Preserve the existing three-control order, artwork, bindings, pointer and
  keyboard feedback, safe-area anchoring, and left/right placement.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `virtual-controller`: Size the three controls, labels, layout, and matching
  safe-area exclusion zone to the user-supplied visual guide boxes while
  retaining the existing interaction contract.

## Impact

- Affects the React UI controller layout/styles and the Phaser controller-zone
  calculation in `phaser4-platformer/src/`.
- Requires focused controller-layout tests and real-browser checks at desktop
  and narrow touch-sized viewports.
- No new dependencies, APIs, input bindings, assets, or settings are expected.
