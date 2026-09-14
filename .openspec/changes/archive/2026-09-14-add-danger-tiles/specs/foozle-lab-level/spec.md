## MODIFIED Requirements

### Requirement: Per-instance animated rendering
The system SHALL render every animated `Midground2` tile instance independently at its authored map position while preserving that tile's Tiled animation sequence. Every laser-spike, saw, and wall-blade placement, plus the marked static trap tiles with GIDs 51, 60, and 79 on `Midground2`, SHALL be non-solid danger tiles with a visible red 32 by 32 source-pixel overlap collider. On an accepted hero overlap, a danger tile SHALL apply 25 damage through the existing player-damage lifecycle. Control panels and any other animated set pieces SHALL remain visual-only and SHALL NOT damage, reset, block, or otherwise change player movement.

#### Scenario: The loaded Level 1 contains animated placements
- **WHEN** Level 1 is rendered in WebGL
- **THEN** every authored animated tile SHALL visibly advance through its Tiled-defined frames at its authored coordinate
- **AND** every authored laser spike, saw, wall blade, and marked static trap tile SHALL show a red 32 by 32 source-pixel collider and be non-solid to the hero
- **AND** control panels and other non-hazard animated set pieces SHALL not affect the hero

#### Scenario: The hero contacts a danger tile
- **WHEN** the hero overlaps an authored laser spike, saw, wall blade, or marked static trap-tile collider outside the existing hit-protection interval
- **THEN** the hero SHALL lose 25 health through the existing damage lifecycle
- **AND** the collider SHALL not block the hero's movement
