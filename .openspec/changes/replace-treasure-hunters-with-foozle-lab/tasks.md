## 1. First-pass FoozleLab playable checkpoint

- [x] 1.1 Replace the focused map contract assertions with an initially failing FoozleLab Level 1 test that requires the 81 by 51, 32 by 32 map; `Background`, `Midground1`, `Midground2`, `Foreground`, and `Objects`; one PlayerSpawn; the centered Midground1 platform; and only the requested left, top-right, and bottom boundary runs; verify `npm test` fails before production changes.
- [x] 1.2 Add FoozleLab static external TSJ tilesets plus matching 81 by 51 TMJ and embedded runtime JSON; author the four strata, center platform, PlayerSpawn, and boundary runs; verify both map forms parse and agree on all cells, layers, and spawn data.
- [x] 1.3 Switch Phaser loading, GPU layer depths, collision, player-surface lookup, and spawn composition to the FoozleLab map so the player is created at PlayerSpawn and collides only with Midground1; verify the focused source test passes.
- [ ] 1.4 Run `npm run build` and a real-browser smoke check confirming the player visibly renders above the center platform, falls onto it, and is blocked by the requested edge runs; then pause and ask the user to test this first-pass layout.

## 2. Level 1 animated composition after user checkpoint

- [ ] 2.1 Add FoozleLab animated external TSJ tilesets for control panels, laser spikes, saws, and wall blades, preserving native Tiled animation records; verify each animation uses 32 by 32 frames and parses from the embedded runtime export.
- [ ] 2.2 Implement runtime expansion of each animated Midground2 tile instance into its own GPU tile-map render layer while retaining one Midground2 authoring layer; verify focused tests cover authored coordinates, animation metadata, per-instance rendering, and pass-through behavior.
- [ ] 2.3 Extend Level 1 from the first-pass geometry toward the approved sci-fi mockup using only the established strata; verify Midground1 remains the only solid layer and Foreground remains a non-solid front-of-player layer.

## 3. Final verification and authoring handoff

- [ ] 3.1 Update the README's Tiled instructions and paths for the FoozleLab map, tilesets, layer semantics, runtime export, and PlayerSpawn contract; verify the documented files exist.
- [ ] 3.2 Run `npm test` and `npm run build`, then perform a real-browser animation check showing each set piece changes frames while the player passes through it; record the local URL and outcomes.
