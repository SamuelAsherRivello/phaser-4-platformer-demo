## 1. Tiled automapping assets

- [ ] 1.1 Set the `automappingRulesFile` in `PhaserPlatformer.tiled-project` to a tracked Level 1 rules registry and verify Tiled discovers it when the project and `Level01.tmj` are opened.
- [ ] 1.2 Create the ordered FoozleLab normalization and boundary-emission rule maps using the existing 32 by 32 Structure tileset plus Tiled's Automapping Rules Tileset; verify their input/output layer names target `Midground1`, contain no legacy `regions` layers, and use an AutomappingRadius of 1.
- [ ] 1.3 Encode the base, four-corner, and four-straight-edge mappings so a three-by-three base footprint produces the reference framed block and larger rectangular footprints retain their base-tile interiors; verify the exact rule-map tile coordinates and GIDs in Tiled.

## 2. Authoring workflow and safeguards

- [ ] 2.1 Exercise a new three-by-three and a larger rectangular `Midground1` footprint with Tiled `Map > AutoMap`; verify each has a complete FoozleLab perimeter and no missing corners.
- [ ] 2.2 Resize or erase part of an automapped footprint, rerun AutoMap, and verify normalization removes stale edge/corner variants before the new boundary is emitted.
- [ ] 2.3 Document the selected base tile, manual AutoMap baseline, optional AutoMap While Drawing setting, save flow, and required `npm run sync:level` handoff in `README.md`; verify the instructions name the actual project and asset paths.

## 3. Automated and browser verification

- [ ] 3.1 Extend `phaser4-platformer/test/page.test.mjs` to validate the project registry, ordered rules, source tileset references, required rule layers/properties, and representative three-by-three mapping; verify with `npm test`.
- [ ] 3.2 Run `npm run sync:level` after saving the verified Tiled map and confirm the editor-data and WebGL runtime exports preserve the generated `Midground1` structure tiles.
- [ ] 3.3 Start the Vite app and perform a real-browser check at the active local URL; verify the generated block renders at native scale and blocks player movement only through `Midground1`.
