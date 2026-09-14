# ui-settings Specification

## Purpose

Provide accessible, unobtrusive upper-right controls for the platformer's
visual debug settings while keeping their rendered behavior and saved state
easy to inspect.

## Requirements

### Requirement: Upper-right visual debug settings

The system SHALL place camera-deadzone and tilemap debug settings beneath the
existing GitHub link in the upper-right header area.

#### Scenario: Settings are available from the game header

- **WHEN** the platformer UI loads
- **THEN** the GitHub link is followed by the Camera and Tilemap debug controls
  in a vertically aligned upper-right settings stack.

### Requirement: Accessible text-style controls

The system SHALL expose each visual debug setting as a native control with an
`aria-pressed` state and shared, FPS-status text styling without persistent
button border or background chrome.

#### Scenario: A setting receives pointer or keyboard focus

- **WHEN** a player hovers or focuses a visual debug setting
- **THEN** its interaction feedback is presented as text treatment rather than
  a persistent button container.

### Requirement: Tilemap checked state and tile borders

The system SHALL show `Tilemap ⬜` while tilemap debug is disabled and
`Tilemap ✅` while it is enabled, and SHALL draw a box around every tile only
while it is enabled.

#### Scenario: Enable tilemap debug

- **WHEN** the player activates Tilemap while it is disabled
- **THEN** the control becomes pressed, displays `Tilemap ✅`, and boxes are
  rendered around the map tiles.

#### Scenario: Disable tilemap debug

- **WHEN** the player activates Tilemap while it is enabled
- **THEN** the control becomes unpressed, displays `Tilemap ⬜`, and no tile
  boxes are rendered.

### Requirement: Persistent visual debug preferences

The system SHALL persist camera-deadzone and tilemap debug preferences in
browser storage and apply both current settings to the Phaser scene.

#### Scenario: Reload after changing a visual debug setting

- **WHEN** the player reloads after changing either visual debug setting
- **THEN** the saved setting state is restored and its associated debug
  rendering is applied.
