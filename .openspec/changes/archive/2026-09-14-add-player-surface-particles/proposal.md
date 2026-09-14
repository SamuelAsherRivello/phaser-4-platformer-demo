## Why

The player currently moves and lands without any surface feedback, so horizontal friction and jump impacts are visually invisible. Small dust trails and a distinct landing puff will make contact with solid tiles legible without changing movement or collision behavior.

## What Changes

- Add a Phaser particle effect for the player that renders little gray dust particles at the supporting foreground tile only while the player is moving horizontally on that surface.
- Emit a single, slightly larger gray dust puff when the player transitions from airborne to grounded after a jump or fall.
- Keep particles visual-only: they do not alter player velocity, jumping, tile collision, controls, map data, or the existing HTML UI.
- Add focused source-level coverage and a real-browser verification of moving dust, idle/jump suppression, and the landing puff.

## Capabilities

### New Capabilities

- `player-surface-particles`: Visual feedback for player movement and landings on solid foreground tile surfaces.

### Modified Capabilities

- None.

## Impact

- Affected implementation: `phaser4-platformer/src/main.js` and `phaser4-platformer/test/page.test.mjs`.
- Uses the installed Phaser 4.2.1 particle-emitter support and a runtime-generated simple particle texture; no dependency, Tiled-map, control, or UI-setting changes are expected.
