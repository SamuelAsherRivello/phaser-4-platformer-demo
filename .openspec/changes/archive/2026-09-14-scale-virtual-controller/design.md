## Context

The React-owned controller in `ui.jsx` uses CSS in `ui.css` for its three
control-art sizes, action-group gap, and bottom layout height. Phaser reserves
the corresponding gameplay exclusion zone in `main.js` with independent
height-ratio and minimum-height constants. Pointer movement already derives
from the rendered Move button bounds, so it will retain its normalized
left/right behavior as the art is resized. The yellow boxes are a visual
reference only and are not runtime UI. See `proposal.md` for motivation
and `specs/virtual-controller/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Align Move art and label to the left yellow guide envelope with a 200 px
  desktop art target.
- Align each Action art and label to its right guide envelope with a 160 px
  desktop art target, plus matching spacing and controller-zone height.
- Prove the guide-aligned dimensions in the existing source-focused test suite
  and check the rendered controller at desktop and narrow touch-sized viewports.

**Non-Goals:**

- Changing controller artwork, order, labels, input bindings, or controller
  event handling.
- Adding a setting, responsive alternative scale, dependency, or new UI layer.
- Altering the level, camera, player movement, or game physics beyond the
  existing exclusion-zone extent.

## Decisions

### Use guide-aligned target dimensions in both rendering layers

The CSS controller values will target 200 px Move art, 160 px Action art, and
1.05 rem label text at the desktop guide viewport, with proportional clamps for
smaller screens. The controller layout uses a 30 percent height target and a
90 px minimum. `main.js` uses the matching 30 percent exclusion-zone ratio and
90 px minimum height. Keeping the values aligned in both layers makes the
relationship reviewable even though CSS and Phaser do not share a runtime
layout object.

The alternative of applying another percentage is rejected because the current
and prior screenshots showed that percentage semantics are ambiguous. The
yellow-box visual envelopes provide an observable, user-supplied target.

### Retain viewport-relative clamping and safe-edge anchoring

The current `clamp()`-based sizing remains proportional to viewport width and
the existing flex layout continues to place Move at the left safe edge and the
action group at the right safe edge. The clamp preferred values reach their
guide-aligned maximums at the desktop reference viewport while their minimums
preserve usability on touch-sized screens without a new mobile-only layout.

The alternative of switching to fixed pixels would make the controller less
adaptive across desktop and touch-sized displays.

### Add source regression coverage before production changes

The focused Node test will first assert the guide-aligned CSS art, label,
spacing/layout extent, and the matching Phaser exclusion zone. After the
implementation passes that test, the full test suite, production build, and
browser checks will verify the visual result and input surface.

## Risks / Trade-offs

- [The visual guides are approximate rather than programmatic bounds] → Use
  stable target dimensions derived from the guide boxes and browser screenshots
  to confirm the production controls occupy their intended envelopes.
- [CSS and Phaser use separate layout calculations] → Preserve one documented
  scale factor and assert both sides in the focused regression test.
- [Existing unrelated working-tree edits affect the same UI/game files] → Keep
  this change limited to controller-size declarations, the zone constants, and
  its focused assertions; do not discard or rewrite other edits.

## Migration Plan

1. Update the regression test so it fails until both the rendered dimensions
   and exclusion zone use the guide-aligned values.
2. Update the CSS and Phaser constants together.
3. Run the focused test, full test suite, production build, and browser checks.
4. If a control does not fit its visual envelope, revise only this change's
   sizing declarations and matching test assertions; no saved user data or
   migration is involved.
