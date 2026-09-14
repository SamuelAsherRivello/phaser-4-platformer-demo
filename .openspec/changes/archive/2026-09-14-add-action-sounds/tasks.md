## 1. Action-audio implementation

- [x] 1.1 Extend the focused source test to require the two bundled audio
  assets, Phaser audio loading, and one distinct playback key per action; verify
  that `npm test` initially fails before the scene change.
- [x] 1.2 Import and preload `Attack01.mp3` and `Arrow01.mp3` through Vite asset
  URLs, then play the matching sound from the shared Action 1/Action 2 trigger
  path; verify the focused source test passes.

## 2. Integration verification

- [x] 2.1 Run `npm test` and `npm run build`; verify both complete successfully.
- [x] 2.2 Run the browser game and activate each action through C/V and its
  touch control; verify each activation keeps its existing visual feedback and
  plays the corresponding distinct sound once.
