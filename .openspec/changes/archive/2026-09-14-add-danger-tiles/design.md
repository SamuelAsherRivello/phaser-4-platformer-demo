## Context

See `proposal.md` for motivation. FoozleLab animated set pieces are sourced from `Midground2` placements and are rendered independently in the Phaser scene. The player-state module already owns 25-damage, hit-protection, hurt animation, knockback, and death outcomes.

## Goals / Non-Goals

**Goals:**

- Give each authored laser-spike, saw, wall-blade, and marked static trap-tile placement the same full-tile red damage sensor.
- Reuse the existing player-damage lifecycle so all danger sources share invulnerability and terminal-death handling.
- Preserve non-solid movement through danger tiles and harmless control panels.

**Non-Goals:**

- Adding new trap artwork, map placements, damage UI, alternate damage values, or trap activation/deactivation states.
- Changing `Midground1` collision, map dimensions, controls, or the player-state damage rules.

## Decisions

- Use one explicit `Midground2` danger-tile classification for laser spikes, saws, wall blades, and the marked static GIDs 51, 60, and 79. This keeps the map-to-gameplay contract clear and prevents trap-specific overlap code from drifting. Control-panel tiles are intentionally excluded.
- Create a sensor per authored danger-tile placement rather than making the animated display sprite physical. The display remains responsible for visual animation; the sensor owns overlap detection and red collider rendering.
- Delegate every accepted overlap to the established player-damage lifecycle. This retains the existing 25-damage amount, hit-protection interval, knockback, hurt animation, and death behavior without duplicating state transitions.
- Use a full 32 by 32 source-pixel sensor, matching the Tiled grid and the already approved laser-spike collider treatment. Smaller sprite-content hitboxes were not selected because the user requested the same red collider behavior across all marked tiles.

## Risks / Trade-offs

- [A continuously overlapping hero could receive repeated damage] → Reuse the existing hit-protection interval and verify the accepted-hit behavior with player-state tests.
- [A future animated tileset is accidentally classified as dangerous] → Keep danger classification explicit and cover harmless control panels in the map-to-sensor regression test.
- [A Tiled placement has no corresponding runtime sensor] → Derive sensors from the same authored `Midground2` placement iteration used for animated rendering and assert the expected placement counts in tests.

## Migration Plan

1. Add the danger-tile classification and create a red static sensor for each matching authored placement.
2. Wire every sensor overlap to the existing player-damage handler.
3. Extend focused map/runtime tests, run the full test suite and production build, then confirm the marked spike and two stacked laser cells receive the same red colliders as the existing trap cells in a real browser.
4. Roll back by removing the danger-tile classification and sensors; no saved state, map migration, or dependency rollback is required.
