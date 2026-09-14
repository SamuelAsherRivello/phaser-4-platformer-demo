## Context

`Level01.tmj` is an 81 by 51 orthogonal Tiled map using the 9 by 9,
32-pixel FoozleLab Structure tileset. `Midground1` is the sole collision
layer. The project file already has an `automappingRulesFile` field but it is
empty. `npm run sync:level` embeds editor tilesets and produces the WebGL-safe
runtime map; it already carries all authored tile-layer data forward.

The target is the attached three-by-three FoozleLab framed structure block,
but the authoring action needs to scale to larger rectangular blocks. See
`proposal.md` for motivation and `specs/tiled-automapping/spec.md` for the
user-visible contract.

## Goals / Non-Goals

**Goals:**

- Make a single documented base Structure tile the paintable representation of
  a block on `Midground1`.
- Convert that footprint to the existing matching edge, corner, and interior
  variants, including the reference three-by-three block.
- Allow manual AutoMap and support AutoMap While Drawing by searching one tile
  beyond a changed cell.
- Keep the generated geometry within the existing Tiled-to-runtime export and
  collision contract.

**Non-Goals:**

- New artwork, runtime procedural generation, a Phaser automapping feature, or
  changes to the map dimensions, layers, player, or collision semantics.
- Automapping decor, animated set pieces, irregular diagonal shapes, or
  randomized visual variants in this first rule set.

## Decisions

### Use modern, project-local Tiled Automapping assets

Set `PhaserPlatformer.tiled-project`'s `automappingRulesFile` to a tracked
`automapping/rules.txt` path. The registry will list a small ordered set of
rule maps, relative to itself, and filter them to `Level01`. This avoids
machine-specific Tiled configuration and puts the editor asset beside the
source map.

Alternative: save `rules.txt` next to every map. Rejected because the project
field makes the feature explicit and scalable to later levels without copying
registries.

### Model blocks as a normalized `Midground1` footprint

The base Structure tile is the author-controlled source state. A first rule
map converts every edge/corner output tile back to that base before a second
rule map applies the current boundary variants. Both rule maps target
`Midground1`; the normalizer is listed first, and the emitter second.

This follows Tiled's ordered rule-map behavior while avoiding an extra
editor-only marker layer or a runtime-map stripping path. The emitter uses
the Automapping Rules Tileset's Empty matching tile to distinguish a footprint
edge from its interior. Its output rules cover the four corners, four straight
edges, and preserve the base interior.

Alternative: persist a hidden marker layer and generate a frame onto
`Midground1`. Rejected because it adds a second authoring representation and
requires the export/test contract to ignore it. Alternative: rely on Terrain
sets. Rejected because this is an explicit boundary-emission rule set rather
than a terrain-label workflow.

### Support both deliberate and live application

The README will present `Map > AutoMap` as the reliable baseline and
`AutoMap While Drawing` as an optional convenience. Set `AutomappingRadius`
to 1 on each rule map so a modification updates neighboring edge decisions.
Rules use current Tiled 1.12 behavior and must not add legacy `regions` layers.

Alternative: require live automapping. Rejected because the manual command is
clearer for a first-time Tiled author and easier to recover from during bulk
edits.

### Verify authored assets and the existing browser handoff

Extend the focused map test to assert the project registry, rule-map input and
output layer names, required tileset references, and the representative block
result in `Level01.tmj`. Keep `npm run sync:level` as the only generated-map
operation; after it runs, verify the map parity test and real browser collision
against the new structure.

## Risks / Trade-offs

- [The selected visual tile IDs differ from the intended reference frame] →
  confirm the 9 by 9 tileset coordinates in Tiled and add a fixture that
  asserts the exact three-by-three output GIDs.
- [Repeated live updates leave stale variants] → normalization is a separate,
  first rule map; test an edit/removal followed by AutoMap.
- [A generated visual tile escapes collision] → all output stays on
  `Midground1`, which the existing scene marks solid; exercise it in the
  browser after syncing.
- [Automapping affects a future map unexpectedly] → use a `Level01` filename
  filter in the registry until future level rules are deliberately added.

## Migration Plan

1. Add the project registry and rule maps without changing the current level
   geometry.
2. Validate the rule maps with an isolated representative block, then add the
   intentional Level 1 example only after its authored result is confirmed.
3. Run `npm run sync:level`, the focused test, and a browser collision check.
4. Roll back by removing the rule registry reference and rule assets; existing
   exported maps remain usable because automapping is authoring-time only.
