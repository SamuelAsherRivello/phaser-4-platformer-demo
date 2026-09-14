## 1. FoozleLab Terrain Set

- [ ] 1.1 Add a Structure-versus-empty-space Edge Set to `foozle-lab-structure.tsj`, label local IDs `0–2`, `9–11`, and `18–20`, keep transformations disabled, and verify the Terrain Sets view in Tiled matches the reference frame.
- [ ] 1.2 Use the Terrain Brush to paint one safe three-by-three demonstration block on `Level01.tmj`'s `Midground1`; verify its GIDs are `1–3`, `10–12`, and `19–21` in the expected frame order and the existing level geometry is unchanged.
- [ ] 1.3 Use Terrain Brush and Shape Fill to exercise a three-by-three and a larger rectangular `Midground1` block; verify both have complete borders and that editing updates neighboring edge/corner tiles without AutoMap.

## 2. Authoring workflow

- [x] 2.1 Document the Structure Edge Set, Terrain Brush, Shape Fill, rectangle-only initial scope, save flow, and required `npm run sync:level` handoff in `README.md`; verify every named path and command exists.

## 3. Automated and browser verification

- [ ] 3.1 Extend `phaser4-platformer/test/page.test.mjs` to validate the external tileset's Edge Set metadata, reference tile IDs, `Midground1` demo frame, and export parity; verify with `npm test`.
- [x] 3.2 Run `npm run sync:level` after saving the verified map and confirm the editor-data and WebGL runtime exports preserve the demonstration `Midground1` structure tiles.
- [x] 3.3 Start the Vite app and perform a real-browser check at the active local URL; verify the demonstration block renders at native scale and blocks player movement only through `Midground1`.
