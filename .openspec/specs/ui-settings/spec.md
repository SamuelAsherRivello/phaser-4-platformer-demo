# ui-settings Specification

## Purpose

Provide accessible, unobtrusive upper-right controls for the platformer's
visual debug settings while keeping their rendered behavior and saved state
easy to inspect.

## Requirements

### Requirement: Upper-right visual debug settings

The system SHALL group the existing Camera, Tilemap, Screen, and Fullscreen
settings beneath the existing GitHub link in the upper-right header area. The
group SHALL show a non-interactive `Settings` subtitle between the GitHub link
and the controls, and SHALL preserve the controls' current visible labels,
order, checked states, and interactions.

#### Scenario: Settings are available from the game header

- **WHEN** the platformer UI loads
- **THEN** the GitHub link is followed by a right-aligned `Settings` subtitle
- **AND THEN** Camera, Tilemap, Screen, and Fullscreen appear beneath it in
  their existing vertical order.

### Requirement: Named Settings typography

The system SHALL render every interactive upper-right settings control with a
shared UI Label style and the non-interactive `Settings` heading with a shared
UI Subtitle style. The UI Subtitle SHALL be right aligned and use a slightly
larger responsive font than UI Label while retaining the established
light-blue, text-only header treatment.

#### Scenario: Settings typography is visible

- **WHEN** the platformer UI renders at a supported viewport size
- **THEN** `Settings` is visually larger than the Camera control label and
  aligns to the right edge of the settings stack
- **AND** the Camera, Tilemap, Screen, and Fullscreen labels share the UI
  Label appearance.

### Requirement: Accessible text-style controls

The system SHALL expose each interactive upper-right setting as a native
control with an `aria-pressed` state and shared UI Label styling without a
persistent button border or background chrome.

#### Scenario: A setting receives pointer or keyboard focus

- **WHEN** a player hovers or focuses an interactive upper-right setting
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
