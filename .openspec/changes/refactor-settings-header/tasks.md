## 1. Settings header structure and styles

- [x] 1.1 Refactor `phaser4-platformer/src/ui.jsx` so the existing Camera, Tilemap, Screen, and Fullscreen buttons form a right-aligned Settings sub-group below the GitHub link, with a non-interactive `Settings` subtitle above them; verify all four retain their current labels, order, `aria-pressed` bindings, and handlers.
- [x] 1.2 Refactor `phaser4-platformer/src/ui.css` to provide named UI Label and UI Subtitle styles, apply UI Label to every settings button and the slightly larger UI Subtitle to `Settings`, and consolidate the borderless pointer/hover/focus treatment; verify the status-text styles and GitHub link presentation remain independent and unchanged.

## 2. Automated coverage

- [x] 2.1 Update `phaser4-platformer/test/page.test.mjs` for the Settings grouping, semantic style assignments, responsive type-size relationship, right alignment, and shared control treatment; verify the existing Camera, Tilemap, Screen, and Fullscreen behavior assertions remain covered.
- [x] 2.2 Run `npm.cmd test` and `npm.cmd run build` from the repository root; verify both complete successfully.

## 3. Browser verification

- [x] 3.1 Run the Vite app and inspect it in a real browser at the active and a narrow viewport; verify `Settings` is visible above the right-aligned controls, visually larger than `Camera`, and does not overlap the header.
- [x] 3.2 Activate Camera, Tilemap, Screen, and Fullscreen in the browser; verify each control still updates its visible state and preserves its existing rendered or browser-owned behavior.
