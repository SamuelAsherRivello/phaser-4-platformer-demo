## Context

See proposal.md for motivation and the virtual-controller delta specification
for the behavior contract. The current UI stylesheet fixes controller artwork
at 120 CSS px and fixes its 173 px zone and 43 px offset. Phaser independently
reserves a fixed 173 px controller rectangle while its safe-area calculation
uses separate width and height percentages. That leaves a portrait viewport
with oversized controls and a layout envelope that can diverge from the CSS
safe area.

## Goals / Non-Goals

**Goals:**

- Derive one responsive controller layout from the current CSS-pixel viewport
  and use it for both the DOM controller and Phaser's non-rendered controller
  rectangle.
- Retain the current desktop geometry at 120 px controls, 173 px zone, and
  43 px offset while permitting compact portrait layouts down to 72 px controls.
- Keep every control and label inside the common safe area after resizing or
  rotating a device.

**Non-Goals:**

- Changing controller artwork, labels, input bindings, action behavior, or
  adding remapping.
- Changing the rest of the HUD layout or adding dependencies.

## Decisions

### Use one viewport-layout calculation

`main.js` will calculate a controller size from the CSS-pixel viewport width,
clamped from 72 px on small phones to the existing 120 px desktop maximum. A
16vw preferred size reaches the desktop maximum at 750 px and produces an
87 px control at a 545 px portrait viewport. The calculation will derive the
zone height, downward offset, action gap, and label sizing from the same scale.
It will apply the DOM-facing values as CSS custom properties on the existing UI
layer and use the calculated zone height for Phaser's controller rectangle.

This keeps the visual and non-rendered layouts synchronized without adding
React state or duplicating responsive constants in JavaScript and CSS. A
CSS-only solution was rejected because Phaser must reserve the same dynamic
height; independent CSS and game formulas can drift.

### Keep desktop geometry as the upper bound

At and above the responsive cap, the calculation will yield the unchanged 120
px artwork, 173 px zone, and 43 px offset. Below that cap, all controller
dimensions scale together, while label text has a readable lower bound and may
wrap within its control's width. The DOM layout will keep the Move control
anchored left and the two-action group anchored right.

Fixed 120 px controls were rejected because they reproduce the reported
portrait crowding. A breakpoint with only two hard-coded mobile sizes was
rejected because intermediate widths and rotation would still produce abrupt
layout changes.

### Match the safe-area model across layers

Phaser will calculate its inset from the smaller viewport dimension, matching
the UI's `min(5vw, 5vh)` inset. The controller rectangle will therefore share
the UI controller's horizontal and lower safe-area boundaries in portrait,
landscape, fullscreen, and resized desktop presentations.

## Risks / Trade-offs

- [A small phone's labels become dense] → Keep a 72 px minimum touch-art size,
  a readable label-size floor, and permit labels to wrap rather than clip.
- [CSS and Phaser drift after a later change] → Keep layout constants and the
  viewport calculation in `main.js`, then pass resolved values to CSS custom
  properties rather than maintaining a second CSS sizing formula.
- [Browser viewport values change during mobile address-bar or rotation events]
  → Recompute during the existing resize path and validate the final DOM bounds
  in a real portrait browser.

## Migration Plan

No data or user-preference migration is required. The layout recalculates on
the next render and on subsequent viewport resize events.
