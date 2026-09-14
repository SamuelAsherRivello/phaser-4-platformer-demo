## 1. React UI foundation

- [x] 1.1 Add the minimal `react` and `react-dom` runtime dependencies and verify the lockfile resolves them with the project's supported npm install command.
- [x] 1.2 Replace the static header, body, and footer children of `#ui_layer` with one React mount and verify the React UI renders the existing title, renderer status, FPS status, repository link, and version text.
- [x] 1.3 Move the existing UI-layer layout styles into the React-owned UI structure and verify the header, body, and footer preserve their current grid positions and non-controller content.

## 2. React virtual controller and game bridge

- [x] 2.1 Implement the React body controller using the current Move, Action 1, and Action 2 artwork, labels, safe-area placement, and approximate control sizes; verify it is bottom-aligned within the body at desktop and narrow viewport sizes.
- [x] 2.2 Implement pointer capture plus release/cancel handling for the React controls and verify horizontal movement resets and both action controls release when an interaction ends outside their original bounds.
- [x] 2.3 Add a narrow UI-to-Phaser controller-intent bridge and verify React move, jump, and attack interactions cause the same horizontal movement, grounded jump, and player flicker as the former game-layer controls.
- [x] 2.4 Synchronize React controller visuals with keyboard A/D, Left/Right, C, and V input and verify vertical keyboard and joystick movement still have no gameplay action.
- [x] 2.5 Remove Phaser controller texture loading, controller scene objects, labels, and pointer handling while retaining the lower physics exclusion zone; verify the player cannot enter the UI controller space after a resize.

## 3. Regression coverage and validation

- [x] 3.1 Update the focused source tests to assert the React-owned full UI layer, React controller placement, UI-to-game bridge, retained gameplay bindings, and absence of Phaser-rendered controls; verify `npm test` passes.
- [x] 3.2 Run `npm run build` from the repository root and verify Vite produces a successful production build.
- [x] 3.3 Run the app in a real browser and verify header, body controller, footer/version, touch/pointer controls, keyboard feedback, gameplay actions, and resize behavior at standard and narrow touch-sized viewports.
