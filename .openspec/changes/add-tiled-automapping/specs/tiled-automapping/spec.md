## Purpose

Give FoozleLab level authors a repeatable Tiled workflow for turning a simple
painted structure footprint into correctly bordered, collision-ready blocks.

## ADDED Requirements

### Requirement: Project-scoped FoozleLab automapping rules
The system SHALL configure the FoozleLab Tiled project to discover a versioned
Automapping rules registry and its FoozleLab structure rule maps when the
project is opened. The rules SHALL be scoped to the project's Level 1 map and
SHALL use the existing 32 by 32 FoozleLab Structure tileset.

#### Scenario: An author opens the Tiled project
- **WHEN** an author opens `PhaserPlatformer.tiled-project` and then `Level01.tmj`
- **THEN** Tiled SHALL discover the project's Automapping rule registry
- **AND** the rule registry SHALL select the FoozleLab structure rules for
  Level 1 without requiring a machine-local rules path

### Requirement: Framed structure-block generation
The system SHALL provide automapping rules that transform a rectangular
`Midground1` footprint painted with the documented base structure tile into
the appropriate FoozleLab top, side, bottom, and corner structure tiles. A
three-by-three painted footprint SHALL produce the framed FoozleLab block
shown in the reference image, including its dark center tile and continuous
outer border.

#### Scenario: A new three-by-three block is automapped
- **WHEN** an author paints a three-by-three base-tile footprint on
  `Midground1` and runs Tiled AutoMap
- **THEN** the footprint SHALL be replaced by the corresponding framed
  FoozleLab structure block
- **AND** the result SHALL contain no missing edge or corner tile
- **AND** the generated tiles SHALL remain on `Midground1`

#### Scenario: A wider or taller rectangular footprint is automapped
- **WHEN** an author paints a rectangular base-tile footprint at least three
  tiles wide and three tiles high on `Midground1` and runs Tiled AutoMap
- **THEN** the outer perimeter SHALL use the matching straight-edge and corner
  tiles
- **AND** the interior SHALL retain the documented base structure tile

### Requirement: Repeatable block editing
The system SHALL make structure-block automapping safe to run again after a
painted footprint changes. Prior generated boundary variants SHALL be
normalized before the current footprint's boundary is emitted, so removed or
reshaped edges do not persist as stale artwork.

#### Scenario: A block is resized and automapped again
- **WHEN** an author edits a previously automapped `Midground1` block using
  the documented base tile and runs Tiled AutoMap again
- **THEN** the block's new perimeter SHALL be complete
- **AND** no prior edge or corner variant SHALL remain outside that perimeter

### Requirement: Authoring and runtime handoff
The system SHALL document the base tile, Tiled AutoMap action, optional
AutoMap While Drawing behavior, and existing level-sync handoff. Generated
tiles SHALL continue to enter the game through `npm run sync:level`, and only
`Midground1` generated structure tiles SHALL block the player.

#### Scenario: An automapped level is run
- **WHEN** an author saves an automapped Level 1 and runs `npm run sync:level`
- **THEN** the exported maps SHALL contain the generated structure tiles
- **AND** the browser game SHALL render them at the authored locations
- **AND** the player SHALL collide with generated `Midground1` tiles
