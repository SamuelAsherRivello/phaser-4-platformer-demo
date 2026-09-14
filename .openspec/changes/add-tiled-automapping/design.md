## Context

`Level01.tmj` is an 81 by 51 orthogonal Tiled map using the 9 by 9,
32-pixel FoozleLab Structure tileset. `Midground1` is the sole collision
layer. The existing external tileset has no terrain metadata. `npm run
sync:level` embeds editor tilesets and produces the WebGL-safe runtime map; it
already carries all authored tile-layer data forward.

The target is the attached three-by-three FoozleLab framed structure block,
with direct Terrain Brush support for larger rectangular blocks. See
`proposal.md` for motivation and `specs/tiled-automapping/spec.md` for the
user-visible contract.

## Goals / Non-Goals

**Goals:**

- Add an Edge Set to the external FoozleLab Structure tileset using the
  reference frame's top-left three-by-three cells.
- Let the Terrain Brush and Shape Fill directly select matching edges, corners,
  and the center tile on `Midground1`.
- Add one safe, terrain-painted three-by-three demonstration block to Level 1.
- Keep the generated geometry within the existing Tiled-to-runtime export and
  collision contract.

**Non-Goals:**

- New artwork, runtime procedural generation, a Phaser terrain feature, or
  changes to the map dimensions, layers, player, or collision semantics.
- Terrain support for decor, animated set pieces, irregular diagonal shapes, or
  randomized visual variants in this first rule set.

## Decisions

### Use an Edge Set on the existing external tileset

Add one Structure-versus-empty-space Edge Set to
`foozle-lab-structure.tsj`. Label only the top-left 3 by 3 reference frame:
the corners, straight borders, and dark center. Keep tile transformations off
because the supplied sci-fi artwork is directional.

Alternative: a Corner Set. Rejected because the supplied layout expresses
orthogonal top, bottom, left, and right borders. Alternative: a Mixed Set.
Rejected because it requires patterns beyond this rectangle-only scope.

### Paint directly on Midground1

Use Tiled's Terrain Brush for direct edits and Shape Fill for larger
rectangles. Terrain data is attached to the shared external tileset, while
the selected layer is `Midground1`, so the existing Phaser collision behavior
applies without a marker layer, a rules registry, or an export transformation.

Alternative: Automapping. Rejected by the user because the Terrain Brush is
the lower-friction authoring model for this exact edge-and-corner tile set.

### Verify authored assets and the existing browser handoff

Extend the focused map test to assert Edge Set metadata, its reference tile
IDs, and the representative block result in `Level01.tmj`. Keep `npm run
sync:level` as the only generated-map operation; after it runs, verify the map
parity test and real browser collision against the new structure.

## Risks / Trade-offs

- [The selected visual tile IDs differ from the intended reference frame] →
  confirm the 9 by 9 tileset coordinates in Tiled and add a fixture that
  asserts the exact three-by-three output GIDs.
- [The partial Edge Set lacks a pattern for an unsupported shape] → limit the
  first workflow to rectangles at least 3 by 3 and verify Shape Fill only
  selects labeled patterns.
- [A generated visual tile escapes collision] → all output stays on
  `Midground1`, which the existing scene marks solid; exercise it in the
  browser after syncing.
- [A future map needs different structure shapes] → add its patterns only
  after a separate terrain-scope decision; this first set stays rectangle-only.

## Migration Plan

1. Add and validate the Edge Set metadata without changing existing level
   geometry.
2. Paint and validate the intentional Level 1 demonstration block in Tiled.
3. Run `npm run sync:level`, the focused test, and a browser collision check.
4. Roll back by removing the Edge Set metadata and demonstration block;
   existing exported maps remain usable because terrain selection is
   authoring-time only.
