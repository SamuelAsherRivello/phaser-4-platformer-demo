## MODIFIED Requirements

### Requirement: Per-instance animated rendering
The system SHALL render every animated `Midground2` tile instance independently
at its authored map position while preserving that tile's Tiled animation
sequence. Control panels, saws, and wall blades SHALL remain visible-only and
SHALL NOT damage, reset, block, or otherwise change player movement. Each
laser-spike placement SHALL remain non-blocking, but SHALL have a matching red
damage sensor that can apply the animated player's laser-spike damage behavior.

#### Scenario: The loaded Level 1 contains animated placements
- **WHEN** Level 1 is rendered in WebGL
- **THEN** every authored animated tile SHALL visibly advance through its
  Tiled-defined frames at its authored coordinate
- **AND** the player SHALL be able to move through control panels, saws, and
  wall blades without gameplay effects

#### Scenario: The player reaches a laser-spike placement
- **WHEN** the player contacts an authored laser-spike placement
- **THEN** a red, non-blocking damage sensor aligned to that placement SHALL
  be present
- **AND** the sensor SHALL apply the laser-spike damage behavior without
  preventing movement through the animated tile
