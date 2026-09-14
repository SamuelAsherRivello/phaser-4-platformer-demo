## 1. Movement contract tests

- [x] 1.1 Extend `phaser4-platformer/test/page.test.mjs` with the doubled top-speed, 125 ms ramp-rate, delta-aware bounded-target, and no-instant-snap assertions; verify the focused `npm test` command fails before the scene change.

## 2. Player movement implementation

- [x] 2.1 Update `phaser4-platformer/src/main.js` to define the 240 source-pixels-per-second cap and delta-scaled 125 ms horizontal velocity ramp while preserving the bridge’s normalized keyboard and Move-control intent; verify the player’s vertical velocity and current collision setup remain unchanged.
- [x] 2.2 Apply the bounded target to fully deflected, partial, released, and reversed horizontal input without overshooting the target or the 240-pixel-per-second cap; verify `npm test` passes the focused movement contract.

## 3. Integration verification

- [x] 3.1 Run `npm run build` from the repository root and verify Vite produces a successful production build.
- [x] 3.2 Run the game in a real browser and verify a held Left/Right key and fully deflected Move control reach 240 source pixels per second over 125 ms, while releasing either reaches rest over 125 ms (with frame-boundary tolerance); confirm jump, gravity, collision, and movement dust still behave normally.
