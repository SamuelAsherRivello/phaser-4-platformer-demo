## Context

The active Phaser 4.2.1 scene in `phaser4-platformer/src/main.js` owns the
Arcade physics rectangle, map loading, action callbacks, and animated
FoozleLab set pieces. The React controller and `platformer-ui-bridge.js`
deliver horizontal, Action 1, and Action 2 intent. All Foozle Player sheets
already exist in the runtime asset folder, are 32 pixels high, and face right.
The scene currently uses a 32 by 64 body while the older level specification
says 14 by 28. This change supersedes both values with the user-requested 32
by 32 native-grid body.

## Goals / Non-Goals

**Goals:**

- Keep arcade body ownership, `PlayerSpawn`, camera following, Midground1
  collision, UI control bindings, and existing action sounds in the scene.
- Add a small pure player-state boundary for timing, animation priority,
  jump allowance, health, hit protection, and input eligibility.
- Keep artwork and its one-grid-cell Arcade body at the native 32 by 32 size
  so visible feet, collision, and surface dust share the ground contact.
- Reuse the existing two authored laser-spike placements as non-blocking red
  damage sensors; controls panels, saws, and wall blades stay non-interactive.

**Non-Goals:**

- Changing map geometry, input bindings, camera, action sounds, or the
  visual-only behavior of non-laser animated set pieces.
- Adding a health HUD, attack hitboxes, enemies, wall-slide physics, an
  in-game restart, persistence, or third-party dependencies.

## Decisions

### Keep physics and state independent from sprite presentation

Create a pure player-state module for state transitions and a Foozle Player
catalog that maps the nine named sheets to exact frame counts and loop flags.
`PlatformerScene` will preload the sheets, create animations once, then own one
visible sprite and one 32 by 32 Arcade body. The sprite follows the body at the
same native footprint rather than replacing it as the physics object.

This makes the timing rules testable without Phaser and lets the current scene
retain responsibility for real collisions. A large generic actor framework was
considered and rejected: the repository has one player and no comparable actor
boundary to reuse.

### Align the art and collider to one native grid cell

Set the player body's width and height to `TILE_SIZE` and preserve its centered
origin. The visible 32 by 32 sprite uses a centered bottom origin at the body's
bottom edge, yielding matching bounds and feet placement. Collider debug must
show the one-cell outline exactly around the active sprite.

Keeping the two-cell-tall body was rejected because the user explicitly asked
for one grid width and height. Restoring the older 14 by 28 body was rejected
because it would no longer match either the player art or the grid contract.

### Use explicit animation priority and preserve movement during actions

State selection will use this priority: death, hurt, attack, wall grab, double
jump, jump, run, idle. Idle, run, and wall grab repeat. Jump, double jump,
light attack, heavy attack, hurt, and death play once; a selected attack can
replace an attack that is still playing. Body physics and camera follow remain
active during every state except death.

This prevents input polling from overwriting transient animations while still
honoring the current responsive movement behavior. Freezing the player during
attacks was rejected because the request specifies animation behavior but not
an attack movement lock.

### Represent double jump and attack chain as timestamped state

Ground contact resets the `airJumpUsed` flag. A grounded Action 1 jump clears
it; the first airborne Action 1 jump marks it used and selects double jump.
Action 2 records the time of its accepted press and whether its prior result
was light or heavy. A press at a strictly less-than-500-ms interval alternates;
otherwise it starts light. The same timestamp source will govern the 500-ms
laser-hit protection interval.

Using timestamps avoids frame-rate-dependent chains and accidental repeated
damage. Holding a button does not create repeated press events because the
existing bridge invokes actions only on a pressed-state transition.

### Make wall grab a visual predicate

Wall grab requires a living airborne body, a left or right solid-tile contact,
and matching directional input. It changes only animation selection; it does
not zero vertical velocity, cancel gravity, or replenish the double jump.

This is deliberately narrower than a wall-climb system and honors the request
to decide the grab criterion without enlarging the movement rules.

### Derive laser-spike sensors from authored set-piece records

While expanding animated set pieces, the scene will identify laser-spike
records and create a 32 by 32 non-blocking Arcade overlap sensor at each
authored tile center. A red outline at that same rectangle makes the active
collision area observable. On overlap, the scene asks player state whether the
hit is valid, applies 25 damage and horizontal knockback away from the sensor,
then selects hurt or terminal death.

The sensor is tied to the existing authored tile identity rather than to fixed
world coordinates, so future Tiled placements inherit the correct behavior.
Making every animated set piece harmful was rejected because the request asks
for one dangerous obstacle type and the existing level contract keeps the
others visual-only.

### Make death terminal for the scene lifetime

When player state reaches zero health, the scene stops body velocity, disables
its movement and action handlers, and plays death once. The UI may continue to
render pressed controls, but their bridge callbacks are no-ops while dead. A
browser refresh rebuilds the scene and its initial health.

An in-game reload control was rejected because the user explicitly requires a
refresh to play again.

## Risks / Trade-offs

- [A one-cell body can change landing and wall-contact timing] → update focused
  physics assertions and verify grounded jump, wall grab, and hazard overlap
  in the real browser.
- [The expanded per-instance sprite path is currently shared by harmless and
  harmful set pieces] → attach sensors only for the laser-spike identity and
  assert every other set-piece type remains sensor-free.
- [An overlap callback fires each physics step] → use player-state hit
  protection rather than relying on body separation.
- [Asset sheet timing may feel too quick or slow] → choose explicit frame rates
  in the catalog, verify every animation visually, and keep rates centralized.

## Migration Plan

1. Add failing pure-state and scene/map tests for the full catalog, animation
   selection, one air jump, attack timing, sensor alignment, damage, and death.
2. Add the catalog and state modules; load all sheets and attach the visual
   sprite to a 32 by 32 Arcade player body and assert exact art/body alignment.
3. Integrate input, animation priority, laser-spike sensors, knockback, and
   terminal death; update control documentation to describe the revised actions.
4. Run focused tests, `npm test`, and `npm run build`, then use a real browser
   at desktop and portrait sizes to inspect every animation, wall contact,
   attack cadence, four-hit death, red sensors, and console errors.
5. If the feature regresses physics, remove only the new actor modules and
   integration while retaining map data and the supplied Foozle Player assets.
