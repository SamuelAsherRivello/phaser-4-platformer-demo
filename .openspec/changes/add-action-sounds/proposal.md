## Why

Action 1 and Action 2 currently provide visual feedback only, so their
different roles are not audible. The project already includes short action
sound effects that can make each input immediately recognizable without
adding a dependency or changing the controls.

## What Changes

- Add a Phaser scene audio path that preloads the selected bundled action sound
  effects.
- Play one distinct sound when Action 1 is triggered and another when Action 2
  is triggered, whether activation comes from the labeled touch controls or
  the C and V keyboard shortcuts.
- Preserve the current virtual-button feedback and movement behavior.

## Capabilities

### New Capabilities

- `action-audio`: Provides distinct Phaser sound-effect feedback for the two
  existing player actions.

### Modified Capabilities

- None.

## Impact

- Affected code: `phaser4-platformer/src/main.js` and its focused source test.
- Assets: existing `assets/audio/sfx/Attack01.mp3` and
  `assets/audio/sfx/Arrow01.mp3`.
- Dependencies: none; this uses the installed Phaser 4 audio APIs and Vite
  asset URLs.
