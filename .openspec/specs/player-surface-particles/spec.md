# player-surface-particles Specification

## Purpose

Make a player's contact with solid platform surfaces visible through restrained gray dust while preserving the existing platformer controls and physics.

## Requirements

### Requirement: Moving surface dust
The system SHALL render small gray dust particles at the player's feet while the player is both grounded on a solid foreground tile and moving horizontally. It SHALL emit no movement dust while the player is stationary, airborne, or unsupported by a solid foreground tile.

#### Scenario: Player moves across a platform
- **WHEN** the grounded player has horizontal movement across a solid foreground platform
- **THEN** small gray dust particles SHALL appear at the player's surface contact point behind the player at a bounded trail cadence

#### Scenario: Player is idle or airborne
- **WHEN** the player is stationary on a platform or is jumping or falling
- **THEN** the system SHALL NOT emit movement dust

### Requirement: Landing impact puff
The system SHALL render a one-shot gray dust puff at the player's feet when the player transitions from airborne to grounded on a solid foreground tile. Landing-puff particles SHALL be visibly larger than the moving surface dust particles.

#### Scenario: Player lands on a platform
- **WHEN** the player descends from a jump or fall and becomes grounded on a solid foreground platform
- **THEN** one gray landing puff SHALL be emitted at the player's surface contact point

#### Scenario: Player remains grounded
- **WHEN** the player continues standing or moving on the same grounded contact after a landing
- **THEN** no additional landing puffs SHALL be emitted until the player becomes airborne and lands again

### Requirement: Visual-only particle feedback
The system SHALL keep surface particles non-interactive and visual-only. The effect SHALL NOT change the player's velocity, jump height, collision results, input bindings, tile data, or HTML user interface.

#### Scenario: Existing platformer movement is used
- **WHEN** a player moves, jumps, and lands with surface particles enabled
- **THEN** the existing movement speed, gravity, grounded jump eligibility, and foreground collision behavior SHALL remain unchanged
