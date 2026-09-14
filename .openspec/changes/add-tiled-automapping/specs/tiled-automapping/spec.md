## Purpose

Give FoozleLab level authors a direct Terrain Brush workflow for painting
correctly bordered, collision-ready structure blocks without hand-placing each
edge and corner tile.

## ADDED Requirements

### Requirement: FoozleLab Structure Edge Set
The system SHALL provide an Edge Set in the existing 32 by 32 FoozleLab
Structure external tileset. It SHALL label the top-left 3 by 3 source cells as
Structure-versus-empty-space patterns: local tile IDs `0` through `2`, `9`
through `11`, and `18` through `20`. The set SHALL not require Tiled
Automapping rules, a `rules.txt` registry, or tile transformations.

#### Scenario: An author opens the Structure tileset
- **WHEN** an author opens the FoozleLab Structure tileset in Tiled
- **THEN** the Terrain Sets view SHALL expose the Structure Edge Set
- **AND** its labeled tiles SHALL match the reference top-left 3 by 3 frame

### Requirement: Terrain-painted structure blocks
The system SHALL let authors paint rectangular FoozleLab Structure blocks at
least three tiles wide and three tiles high directly on `Midground1` using the
Terrain Brush. Tiled SHALL select matching top, side, bottom, corner, and
center tiles from the Edge Set as the footprint changes. A three-by-three
painted footprint SHALL produce the framed FoozleLab block shown in the
reference image, including its dark center tile and continuous outer border.

#### Scenario: A new three-by-three block is terrain-painted
- **WHEN** an author paints a three-by-three Structure footprint on
  `Midground1` with the Terrain Brush
- **THEN** Tiled SHALL place the corresponding framed FoozleLab structure
  block
- **AND** the result SHALL contain no missing edge or corner tile
- **AND** the generated tiles SHALL remain on `Midground1`

#### Scenario: A larger rectangle is terrain-painted
- **WHEN** an author paints or Shape Fills a rectangular Structure footprint
  at least three tiles wide and three tiles high on `Midground1`
- **THEN** the outer perimeter SHALL use the matching straight-edge and corner
  tiles
- **AND** the interior SHALL use the matching center Structure tile

### Requirement: Direct terrain block editing
The system SHALL update neighboring tiles when an author extends, reshapes, or
erases a terrain-painted `Midground1` block. The editing workflow SHALL not
require a separate reset pass or manual rerun of an Automapping command.

#### Scenario: A block is resized with the Terrain Brush
- **WHEN** an author edits a previously terrain-painted `Midground1` block
  with the Terrain Brush
- **THEN** the block's new perimeter SHALL be complete
- **AND** no prior edge or corner variant SHALL remain outside that perimeter

### Requirement: Authoring and runtime handoff
The system SHALL document the Structure Edge Set, Terrain Brush, Shape Fill,
and existing level-sync handoff. Terrain-painted tiles SHALL continue to enter
the game through `npm run sync:level`, and only `Midground1` Structure tiles
SHALL block the player.

#### Scenario: A terrain-painted level is run
- **WHEN** an author saves a terrain-painted Level 1 and runs `npm run sync:level`
- **THEN** the exported maps SHALL contain the generated structure tiles
- **AND** the browser game SHALL render them at the authored locations
- **AND** the player SHALL collide with generated `Midground1` tiles
