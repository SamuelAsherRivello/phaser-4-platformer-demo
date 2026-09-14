## Context

The Vite application loads Phaser assets through `?url` imports. The React virtual controller and C/V keyboard handlers both send action intent through `platformer-ui-bridge.js`, which calls the Phaser scene's shared jump and attack methods. The bundled MP3 files already live under `phaser4-platformer/assets/audio/sfx/`.

## Goals / Non-Goals

**Goals:**

- Load the two bundled effects with the Phaser scene and play one fixed, distinct key from each shared action method.
- Keep touch and keyboard activation on the same scene path so neither input method needs separate audio behavior.

**Non-Goals:**

- Add audio dependencies, background music, volume controls, or sound-preference persistence.
- Change the existing action feedback animation or movement behavior.

## Decisions

- Import each MP3 with Vite's `?url` suffix and preload it with `this.load.audio`. This keeps asset paths build-safe and lets Phaser manage decoded sound resources. Direct public-path references were rejected because they would not be coupled to Vite's emitted asset names.
- Define distinct scene-level keys for Action 1 and Action 2, then call `this.sound.play` at the beginning of `jumpPlayer` and `attackPlayer`. Those are the bridge's shared endpoints for keyboard and on-screen input, so playback remains once per accepted press without duplicating logic in React. UI-level playback was rejected because it would split behavior across control methods and bypass direct scene action calls.
- Use C for Action 1 and V for Action 2 in the visible labels, supported-key set, and keyboard action state. This restores the specified C/V contract alongside the matching touch controls.

## Risks / Trade-offs

- [Browser audio restrictions can delay non-user-initiated playback] → Both effects are triggered from keyboard or pointer action events, while Phaser preloads them before use.
- [A missing or renamed asset could leave an action silent] → The focused source test requires both Vite imports, preload calls, and distinct playback keys; the production build confirms both emitted MP3 files.
- [Rapid repeated input can intentionally overlap short effects] → Keep Phaser's default sound behavior because each user activation is required to produce immediate feedback.

## Migration Plan

1. Ship the imported and preloaded bundled assets with the scene code.
2. Verify C, V, and both on-screen controls in a browser after deployment.
3. Roll back by removing the two audio imports, preload calls, and playback calls; no saved state or data migration is involved.
