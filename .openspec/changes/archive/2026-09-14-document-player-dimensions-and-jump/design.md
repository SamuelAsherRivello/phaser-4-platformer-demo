## Context

The Phaser scene creates the player as a rectangle and attaches an Arcade
Physics body before colliding it with the foreground tile layer. Gravity
remains 800 source pixels per second squared. See `proposal.md` for the
motivation and the delta spec for the gameplay contract.

## Goals / Non-Goals

**Goals:**

- Preserve the player's 14-source-pixel horizontal width while doubling its
  visible and physical height to 28 source pixels.
- Express a twofold vertical jump rise without changing global gravity.

**Non-Goals:**

- Change horizontal movement speed, controls, platform geometry, or Tiled
  spawn coordinates.
- Replace the non-art player rectangle with sprite artwork.

## Decisions

- Use separate width and height constants, rather than one square-size
  constant, so the rectangle and its Arcade Physics body share the requested
  14 by 28 geometry. This avoids a visual-only height change that would leave
  collision at the old square size.
- Multiply the existing 270 source-pixel-per-second launch speed by the square
  root of two. Under unchanged constant gravity, maximum rise is proportional
  to the square of launch velocity, so this yields exactly twice the prior
  height. Doubling velocity was rejected because it would yield four times the
  rise; changing gravity was rejected because it would alter all world physics.

## Risks / Trade-offs

- A taller physics body can contact overhead tiles sooner → retain foreground
  collision and verify the targeted gameplay test after documentation changes.
- The contract refers to the prior jump configuration → preserve the base
  launch velocity as the comparison baseline in the implementation and test.

## Migration Plan

1. Keep the verified player constants and geometry in the current scene.
2. Sync the completed delta specification into `tiled-platformer-level`.
3. Archive this documentation change after the focused test passes.
