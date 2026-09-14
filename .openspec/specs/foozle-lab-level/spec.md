# foozle-lab-level Specification

## Purpose

Provide an editable FoozleLab Level 1 whose animated sci-fi set pieces render from Tiled-authored placements without adding gameplay hazard behavior.

## Requirements

### Requirement: FoozleLab animated-scene authoring
The system SHALL provide FoozleLab 32 by 32 source-pixel tilesets for static structure and decor plus animated control-panel, laser-spike, saw, and wall-blade tiles. Tiled SHALL expose all animated placements on one `Midground2` tile layer.

#### Scenario: Level 1 is opened in Tiled
- **WHEN** a developer opens the FoozleLab Level 1 source map
- **THEN** its palette SHALL expose the FoozleLab static and animated tilesets
- **AND** all animated set-piece placements SHALL appear on `Midground2`

### Requirement: Per-instance animated rendering
The system SHALL render every animated `Midground2` tile instance independently at its authored map position while preserving that tile's Tiled animation sequence. Animated set pieces SHALL be visible only and SHALL NOT damage, reset, block, or otherwise change player movement.

#### Scenario: The loaded Level 1 contains animated placements
- **WHEN** Level 1 is rendered in WebGL
- **THEN** every authored animated tile SHALL visibly advance through its Tiled-defined frames at its authored coordinate
- **AND** the player SHALL be able to move through every animated set piece
