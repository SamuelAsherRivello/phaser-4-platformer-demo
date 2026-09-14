## 1. Responsive layout contract

- [x] 1.1 Replace the fixed-size controller assertions in `phaser4-platformer/test/page.test.mjs` with desktop and compact-portrait responsive-layout expectations, then run the focused test to confirm it fails before the implementation changes.
- [x] 1.2 Add the shared viewport-based controller layout calculation in `phaser4-platformer/src/main.js`, use its resolved height for the Phaser controller rectangle, and match Phaser's safe inset to the UI's smaller-dimension inset; verify the focused layout test passes.
- [x] 1.3 Update `phaser4-platformer/src/ui.css` to consume the resolved controller custom properties for artwork, labels, gaps, zone height, and offset while retaining left/right safe-area anchoring and non-clipped labels; verify the focused layout test passes.

## 2. Responsive verification

- [ ] 2.1 Run `npm test` and `npm run build` from the repository root; verify all automated checks and the production build pass.
- [x] 2.2 Run the Vite app in a real browser at a desktop viewport and a 390 by 844 portrait mobile viewport; verify desktop controls remain 120 px, portrait controls are smaller but at least 72 px, and every control/label bounding box remains within the UI safe area. Capture the portrait result in `output/playwright/`.
