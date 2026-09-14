## Context

See proposal.md for motivation. The controller is rendered by the React UI in
`phaser4-platformer/src/ui.jsx`; its CSS currently sizes art, labels, and
action spacing with `vw`-based `clamp()` values. Phaser's `layout()` method in
`phaser4-platformer/src/main.js` reserves the matching gameplay exclusion area
with a viewport-height ratio and minimum. The game canvas and all non-controller
UI are already intended to respond to presentation resizing.

## Goals / Non-Goals

**Goals:**

- Preserve the established fullscreen controller guide dimensions in CSS pixels
  after a presentation resize.
- Keep the controller safely anchored to the responsive UI edges and keep the
  Phaser exclusion zone aligned with its fixed footprint.
- Retain the existing touch and keyboard intent path without changing its
  behavior.
- Keep touch-only controls out of sequential keyboard focus.

**Non-Goals:**

- Changing Phaser's game scaling, camera behavior, safe-area policy, or the
  layout of header, footer, and non-controller UI.
- Adding a setting, asset, dependency, input remapping, or an alternate mobile
  controller layout.
- Making controller dimensions independent of browser zoom or device pixel
  ratio; fixed size means fixed CSS-pixel dimensions during ordinary window
  resizing.

## Decisions

### Use fixed CSS dimensions for the controller-only visual envelope

Replace the controller-specific viewport-relative sizing with the established
guide dimensions: 200 CSS px for Move and 160 CSS px for each action control.
Use fixed label typography, gaps, and controller-region height that fit those
art sizes, while retaining the existing flexible left/right placement and
safe-area inset. This scopes the non-scaling behavior to the controller.

Viewport-relative controller sizing was rejected because it causes the exact
fullscreen result the user wants to change when the window becomes smaller.
Changing the whole UI or game canvas to fixed dimensions was rejected because
those parts must remain responsive.

### Make Phaser reserve the same fixed controller envelope

Replace the ratio-based controller-zone height with a named fixed controller
envelope value that covers the rendered art, label, spacing, and bottom
placement. Continue recalculating the layout rectangle's position and width
when the Phaser presentation layout changes, but do not reduce its height with
the viewport. Keep the controller geometry explicit and documented near the
layout constants so future visual size changes update the matching layout
record.

Measuring the React element each resize was rejected: it introduces a cross-
layer runtime dependency when the guide geometry is static and can be stated
directly. Retaining the existing percentage rule was rejected because it would
make the recorded layout envelope change independently of an unscaled
controller after a resize.

### Keep the virtual controller touch-only for focus navigation

Set the Move and action buttons to an explicit negative tab index. They remain
semantic buttons for pointer and touch input, but the browser skips them during
sequential Tab navigation because the game already receives its fixed keyboard
controls from the page-level input handler. Removing the button semantics or
disabling the controls was rejected because either change would break pointer
interaction and assistive labeling.

### Verify visual and layout behavior at two presentation sizes

Extend the focused tests to assert the fixed controller values and the fixed
Phaser exclusion-envelope contract. Use a real browser at the current
fullscreen-like baseline and then a smaller window to confirm that only the
game and surrounding UI scale while the three controller controls retain their
CSS-pixel dimensions, safe-edge anchoring, and pointer interactions.

## Risks / Trade-offs

- [A very small viewport has less remaining gameplay area and can crowd the fixed controls] → Preserve the requested non-scaling behavior, keep safe-edge anchoring, and cover a representative smaller desktop window in browser verification.
- [CSS and Phaser use separate layout layers] → Keep their fixed controller-envelope values explicit, name them consistently, and validate their alignment with the existing controller-zone test and browser check.
- [Existing source tests assert the viewport-relative implementation] → Replace only assertions that encode the superseded responsive controller sizing; retain tests for artwork, labels, bindings, and touch/keyboard behavior.
- [Touch controls no longer receive sequential keyboard focus] → Keep the existing page-level keyboard bindings and verify that pointer interaction remains functional.

## Migration Plan

1. Update the controller-only CSS and Phaser exclusion-zone constants together.
2. Run focused tests and build the Vite application.
3. Verify fullscreen-like and smaller-window layouts in a real browser.
4. Roll back by restoring the prior controller CSS and ratio-based exclusion
   constant if the fixed footprint proves unusable on supported small screens.
