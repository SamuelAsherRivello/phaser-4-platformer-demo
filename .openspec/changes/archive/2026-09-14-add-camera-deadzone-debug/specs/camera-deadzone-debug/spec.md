## Purpose

Provide stable player-follow camera behavior and an inspectable, persistent
HUD control for the camera's centered deadzone boundary.

## ADDED Requirements

### Requirement: Player-follow camera with centered half-viewport deadzone

The system SHALL follow the existing player with the game camera. The camera
deadzone SHALL be centered in the active game viewport and measure exactly 50
percent of that viewport's width and 50 percent of its height. While the
player remains within that rectangle, the camera SHALL NOT scroll; once the
player reaches or crosses an edge, the camera SHALL scroll only enough to
keep the player at that edge. Camera scrolling SHALL remain within the loaded
level's world bounds.

#### Scenario: Player moves inside and beyond the deadzone

- **WHEN** the player moves while inside the centered deadzone
- **THEN** the camera view SHALL remain stationary
- **AND WHEN** the player reaches or crosses a deadzone edge
- **THEN** the camera SHALL follow the player in that direction
- **AND** the camera SHALL NOT reveal space outside the loaded level

#### Scenario: Game viewport changes size

- **WHEN** the active game viewport is resized
- **THEN** the camera deadzone SHALL remain centered in that viewport
- **AND** its width and height SHALL each be recalculated to 50 percent of
  the corresponding viewport dimension

### Requirement: Persistent camera deadzone debug control

The top-right HUD SHALL provide an interactive control labeled `Camera ✅`
directly below the GitHub icon. It SHALL default to off when no saved HUD
setting exists. When off,
the game SHALL render no camera-deadzone debug outline. When on, the game
SHALL render a visible outline that exactly matches the centered, current
camera deadzone and remains screen-aligned as the camera scrolls.

#### Scenario: Debug outline is toggled

- **WHEN** the user activates `Camera ✅` while it is off
- **THEN** the HUD SHALL show its on state
- **AND** the game SHALL display the exact deadzone outline
- **WHEN** the user activates the control again
- **THEN** the HUD SHALL show its off state
- **AND** the game SHALL remove the outline

#### Scenario: Debug setting survives a refresh

- **WHEN** the user changes `Camera ✅`
- **THEN** the HUD setting SHALL be written to browser-local persistent
  storage immediately
- **WHEN** the page is refreshed in the same browser storage context
- **THEN** the control and debug outline SHALL restore the saved setting
