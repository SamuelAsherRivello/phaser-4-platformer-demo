## Why

FoozleLab's laser spike, saw, and wall-blade artwork is already authored as red-collider hazards, but only laser spikes can currently affect the hero. The other placed traps need the same clear, consistent damage behavior so visual danger matches gameplay danger.

## What Changes

- Treat the laser-spike, saw, wall-blade, and the three marked static trap-tile placements on `Midground2` as danger tiles.
- Create a red, non-solid 32 by 32 source-pixel overlap sensor for every authored danger-tile placement.
- Route each danger-tile overlap through the existing hero damage flow, which removes 25 health per accepted hit and preserves its existing hit-protection and death behavior.
- Keep control panels and other animated set pieces non-damaging.
- Replace the current FoozleLab specification statement that every animated set piece is visual-only.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `foozle-lab-level`: Animated and marked static hazard tiles gain consistent, non-solid damage behavior while non-hazard set pieces remain visual-only.

## Impact

- `phaser4-platformer/src/main.js` danger-tile sensor creation and overlap handling.
- `phaser4-platformer/test/page.test.mjs` map-to-sensor regression coverage.
- No new dependencies, map dimensions, physics-solid layers, or control changes.
