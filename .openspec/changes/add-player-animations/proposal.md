## Why

The playable FoozleLab scene still renders its player as a blue physics
rectangle and its animated hazards are visual-only. Replacing that placeholder
with the supplied Foozle Player animation set makes movement, combat, damage,
and death legible in the actual game.

## What Changes

- Load all nine supplied 32 by 32 Foozle Player sprite sheets and replace the
  visible blue rectangle with a sprite and one 32 by 32 grid-cell collider,
  while retaining map-authored spawn, camera follow, and platform collision.
- Select idle, run, jump, double-jump, and wall-grab animations from grounded
  state, horizontal movement, air-jump state, and an intentional airborne
  wall-contact criterion.
- Permit one grounded jump plus exactly one additional airborne jump before a
  landing resets the jump allowance.
- Change Action 2 into an alternating attack chain: presses less than 500 ms
  apart alternate light and heavy attacks; presses 500 ms or more apart always
  start a light attack.
- Make the existing laser-spike set-piece type a red, non-blocking damage
  sensor. Each valid hit plays hurt, removes 25 health from the initial 100,
  knocks the player horizontally away, and gives a short hit cooldown so one
  overlap cannot count as several hits.
- Play death once at zero health, then disable all player gameplay input until
  the browser page is refreshed. No in-game revive or restart control is
  introduced.

## Capabilities

### New Capabilities

- `animated-player-combat`: Foozle Player animation, double-jump, attack-chain,
  damage, and terminal-death behavior.

### Modified Capabilities

- `foozle-lab-level`: Reclassify laser spikes from visual-only animated set
  pieces to explicitly authored, red non-blocking damage hazards; all other
  animated set pieces remain pass-through and non-damaging.
- `tiled-platformer-level`: Replace the obsolete player-body dimensions with a
  one-grid-cell, 32 by 32 source-pixel collider aligned to the Foozle Player.

## Impact

- Affects `phaser4-platformer/src/main.js`, the supplied Foozle Player assets,
  focused scene/state tests, the FoozleLab map hazard interpretation, and
  controls documentation.
- Preserves Phaser 4.2.1, React, WebGL, the current map and `PlayerSpawn`
  contract, existing control bindings, and the no-new-dependency policy.
- Replaces the current 32 by 64 runtime rectangle and older 14 by 28 spec
  value with one 32 by 32 grid-cell collider, verified against native artwork.
