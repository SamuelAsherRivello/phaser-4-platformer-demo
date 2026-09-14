## MODIFIED Requirements

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

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Accessible text-style controls

The system SHALL expose each interactive upper-right setting as a native
control with an `aria-pressed` state and shared UI Label styling without a
persistent button border or background chrome.

#### Scenario: A setting receives pointer or keyboard focus

- **WHEN** a player hovers or focuses an interactive upper-right setting
- **THEN** its interaction feedback is presented as text treatment rather than
  a persistent button container.
