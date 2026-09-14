## Context

See proposal.md for motivation and the virtual-controller delta specification
for the behavior contract. The React Move control and keyboard listeners both
publish a normalized horizontal value from -1 through 1 to
`platformer-ui-bridge.js`. `PlatformerScene.update()` currently overwrites the
Arcade body's X velocity with that value times a 120-pixel-per-second constant
every frame. The scene already owns the body, its collision behavior, and the
movement dust effect; the input bridge has no physics responsibility.

## Goals / Non-Goals

**Goals:**

- Use elapsed frame time to make a 125 ms velocity transition stable across
  the supported frame rates.
- Preserve the bridge’s normalized keyboard and touch intent, including
  intermediate Move-control deflections.
- Keep the player’s vertical gravity, jump, collision, camera, controller UI,
  and dust behavior intact while changing horizontal motion.

**Non-Goals:**

- Changing the input bindings, controller sizing or layout, player geometry,
  gravity, jump speed, or controller safe-area exclusion zone.
- Adding momentum persistence, friction surfaces, configurable movement
  settings, new assets, or dependencies.

## Decisions

### Derive a bounded target velocity from normalized input

The scene will treat the bridge value as a normalized horizontal target and
multiply it by a named 240 source-pixels-per-second maximum. Its per-frame
movement update will move the existing body velocity toward that target by at
most `240 / 0.125`, or 1,920 source pixels per second squared, scaled by the
received frame delta. A zero input uses the same rate with a zero target.

This gives a full input exactly the requested 125 ms rest-to-cap transition,
prevents overshooting the requested value, lets partial touch input retain its
proportional target, and naturally brakes before a direction reversal. Directly
assigning the target remains rejected because it preserves the current snap.

### Perform the ramp in the scene instead of configuring Arcade acceleration and drag

The scene will calculate the next X velocity and set only that component on
the existing Arcade body. This keeps the requested timing and the analog
target explicit while retaining Arcade Physics for gravity and collision.

Using a fixed Arcade acceleration plus a global maximum velocity was rejected:
it can cap full input but does not by itself establish a lower, stable target
for partial virtual-stick deflections. Arcade drag was also rejected as the
primary deceleration mechanism because it only operates when acceleration is
zero and makes the exact target transition depend on physics configuration.

### Verify the contract at source and in the browser

The existing Node source-check suite will assert named top-speed and ramp-rate
constants, delta-aware bounded X-velocity movement, and the removal of the
instantaneous assignment. A real-browser check will validate a held keyboard
direction and a fully deflected Move control reach the doubled cap after the
125 ms ramp, then verify release comes to rest over the same interval.

## Risks / Trade-offs

- [Frame scheduling can delay the observation just beyond 125 ms] → Base the
  calculation on the delivered delta and validate against frame-boundary
  tolerance in the browser rather than assuming a fixed refresh rate.
- [Changing direction preserves physical braking rather than snapping] → Use
  the same bounded target movement so reversal is smooth and cannot exceed the
  configured cap.
- [Existing dust emission reads body velocity] → Keep that data flow unchanged
  and confirm particles continue to follow nonzero horizontal velocity.

## Migration Plan

1. Add the focused source assertion, then update the scene’s horizontal
   velocity calculation and named constants.
2. Run the focused test and Vite production build.
3. Verify held and released keyboard and touch movement in a real browser.
4. Roll back by restoring the prior 120-pixel-per-second constant and direct
   X-velocity assignment if the new movement timing is unsuitable.
