## Context

`phaser4-platformer/src/main.js` contains the single `PlatformerScene`, including the non-art Arcade Physics player rectangle, the solid `Foreground` tile layer, and the `update()` loop that applies horizontal intent. The installed Phaser 4.2.1 package provides particle emitters through `this.add.particles(...)`, manual `emitParticleAt(...)` bursts, runtime graphics texture generation, and tile-layer world-coordinate lookup. See `proposal.md` and `specs/player-surface-particles/spec.md` for product behavior.

## Goals / Non-Goals

**Goals:**

- Provide crisp, low-volume gray surface dust that visibly originates at the player's foot contact point.
- Base movement and landing emission on the physics body's grounded state plus a solid foreground-tile lookup, preventing airborne and world-bound-only effects.
- Make landing detection edge-triggered so one landing produces one impact burst.
- Keep the effect performant by reusing bounded emitter pools and avoiding per-frame object creation.

**Non-Goals:**

- Material-specific colors, textures, sound, decals, persistence, or particle collision.
- Changes to the player's physics body, input bridge, map, rendered tile layers, or HTML UI.
- A player-facing setting for the effect.

## Decisions

### Create a small generated texture and two bounded Phaser emitters

Create one compact gray dot texture from an off-list graphics object during scene setup, then use it for a small movement-dust emitter and a separate, slightly larger landing-puff emitter. Keep both emitters stopped between explicit bursts, with short lifespans, fade-out, restrained spread, and bounded particle pools.

Using a generated texture avoids adding artwork for a simple effect and keeps pixel-art sizing under the scene's existing rendering setup. Separate emitters make the landing-puff scale and count independent from the movement trail. A single emitter whose scale and quantity are mutated for each event was considered, but separate fixed profiles avoid cross-event configuration state and make the intended visual distinction easier to preserve.

### Emit from the confirmed foreground surface contact

Centralize a helper that derives the player foot position from the Arcade body, confirms grounded contact, and queries the `Foreground` tile layer at the support position. Movement and landing emitters use that returned foot position; no effect is emitted if it is absent.

Checking only `body.blocked.down` / `body.touching.down` was considered but rejected because it could represent a world-bound contact without a foreground tile. Looking up the foreground layer ensures the visual feedback describes tile-surface friction as requested.

### Use intent/velocity and a cadence gate for moving dust

After the existing horizontal velocity assignment, treat non-zero horizontal motion while on a confirmed surface as eligible for movement dust. Track the last movement-dust emission time or traveled distance to emit intermittent tiny bursts instead of an unbounded stream every update.

Using a continuously following emitter was considered but rejected: it risks leaving a trail while the player is idle or airborne unless additional start/stop transitions are maintained, and does not inherently enforce a readable print-like cadence.

### Detect landings with a persistent prior-grounded flag

Store whether the player had a confirmed foreground surface contact in the previous update. Emit the landing puff only on the false-to-true transition, then update the stored value after processing. Initialize the state to avoid a spawn-time puff unless the player has first been airborne.

Testing vertical velocity alone was considered but rejected because collision resolution can change it before the effect logic runs and because it does not prevent repeated bursts while standing.

## Risks / Trade-offs

- [Particle API behavior differs from the installed Phaser 4 build] → Verify the exact emitter factory, generated texture, manual emission, and tile-lookup calls against the installed source before coding; run the build and browser smoke test.
- [Grounded collision flags update a frame later than visual expectations] → Evaluate contact after Arcade Physics resolution in the scene update and test both a jump landing and an initial fall.
- [Dust obscures the player or tile art] → Set emitter depth behind the player but above the foreground surface as visually validated, use short lifetimes, gray tint, low alpha, and bounded counts.
- [Rapid direction changes make too many particles] → Keep a cadence/distance gate and a maximum particle pool; verify idle and airborne states produce no emissions.

## Migration Plan

1. Add the visual-only scene resources and contact-state logic without changing existing movement or collision code paths.
2. Add focused checks and verify emitted effects in a real browser at the dev-server URL.
3. Roll back by removing the particle setup and its update hooks; no saved data, assets, maps, or public interfaces require migration.
