## Why

Horizontal movement currently snaps the player instantly to 120 source pixels per second. Doubling the player’s pace while adding a brief, consistent ramp will make held keyboard input and a fully deflected virtual stick feel faster without feeling abrupt.

## What Changes

- Double the player’s maximum horizontal movement speed from 120 to 240 source pixels per second.
- Ramp horizontal velocity from rest to the requested maximum in 125 ms when the player fully holds Left, Right, A, D, or fully deflects the Move stick left or right.
- Ramp horizontal velocity from its current value to zero in 125 ms after horizontal input is released.
- Apply the same velocity model to keyboard and virtual-controller intent, including proportional virtual-stick directions and direction reversals.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `virtual-controller`: define the shared keyboard and touch horizontal movement speed and acceleration/deceleration timing.

## Impact

- Affected game physics: `phaser4-platformer/src/main.js`, specifically the per-frame horizontal velocity update.
- Existing input bridge and React Move control remain the sources of normalized horizontal intent; no new controls, settings, assets, APIs, or dependencies are needed.
- Verification will extend `phaser4-platformer/test/page.test.mjs`, run the focused test and build, and confirm the timed keyboard and virtual-stick behavior in a real browser.
