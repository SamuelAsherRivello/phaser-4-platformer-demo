## 1. Particle Scene Resources

- [x] 1.1 In `phaser4-platformer/src/main.js`, create one small gray runtime particle texture and two bounded Phaser emitter profiles for moving dust and larger landing puffs; verify they use the same texture, short-lived fading particles, and remain visually behind the player.
- [x] 1.2 Add a foreground-surface contact helper that combines the player's grounded Arcade Physics state with a foreground tile lookup at the player's feet; verify it rejects idle airborne and world-bound-only contact positions.

## 2. Movement and Landing Effects

- [x] 2.1 Add cadence-gated movement dust emission from the confirmed surface contact point only while the player has horizontal movement; verify it emits tiny gray bursts during platform traversal and none while idle or airborne.
- [x] 2.2 Add prior-contact state and false-to-true landing detection that emits exactly one larger gray puff per airborne-to-foreground-surface landing; verify standing or continued movement does not repeat the puff until another airborne transition occurs.
- [x] 2.3 Preserve the existing player velocity assignment, jump gate, collision setup, map data, input bridge, and HTML UI; verify normal movement and jumping behavior remain unchanged by inspection and focused tests.

## 3. Verification

- [x] 3.1 Extend `phaser4-platformer/test/page.test.mjs` with focused assertions for the texture/emitter setup, confirmed surface gate, movement-dust gate and cadence, landing edge trigger, and visual-only boundaries; verify `npm test` passes.
- [x] 3.2 Build the Vite application with `npm run build`; verify the build succeeds without adding dependencies.
- [x] 3.3 Run the application in a real supported browser and manually verify gray dust appears only while traversing a foreground platform, stays absent while idle and airborne, and produces one visibly larger puff on landing.
