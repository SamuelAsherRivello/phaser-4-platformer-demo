## Why

The player shape and jump height have been changed in the running platformer
but were not expressed in the level capability's contract. Recording them
keeps future work from reverting the requested proportions or jump behavior.

## What Changes

- Document the player as a 14 by 28 source-pixel non-art physics rectangle.
- Document a jump that reaches twice the previous maximum height while gravity
  remains unchanged.
- Specify the implementation's base launch velocity of 270 source pixels per
  second and its square-root-of-two multiplier for the twofold height target.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `tiled-platformer-level`: Define the player rectangle's dimensions and its
  two-times-higher jump behavior alongside its existing collision and spawn
  contract.

## Impact

- Documents the current player constants and physics in
  `phaser4-platformer/src/main.js`.
- Aligns `phaser4-platformer/test/page.test.mjs` with the durable gameplay
  contract; no APIs or dependencies change.
