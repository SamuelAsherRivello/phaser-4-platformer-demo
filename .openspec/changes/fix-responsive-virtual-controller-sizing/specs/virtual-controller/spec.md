## MODIFIED Requirements

### Requirement: Safe-area controller zone

The system SHALL keep a non-rendered virtual-controller layout envelope along
the bottom of the Phaser canvas aligned with the UI controller's bottom safe
area. The virtual controller SHALL render in the UI layer's body region, within
the same safe-area inset used by that layer, and SHALL remain anchored to the
bottom of that region. The Move art and each action art SHALL use a shared
responsive size: they SHALL remain 120 CSS px at desktop-sized viewport widths
and SHALL reduce together on compact portrait widths, never below 72 CSS px.
Their labels and spacing SHALL reduce or wrap as needed so the complete Move
control and action-control group remain inside the horizontal safe area without
clipping. The controller layout height and downward offset SHALL scale with the
control size, preserving the desktop 173 CSS px height and 43 CSS px downward
offset while reserving no more vertical space than needed on compact portrait
viewports. The Phaser layout envelope SHALL use the same responsive height as
the UI controller after every presentation resize. The rest of the game
presentation and UI outside the virtual controller SHALL remain responsive.

#### Scenario: Desktop controller layout

- **WHEN** the game renders at a desktop-sized viewport width
- **THEN** the Move art and each action art SHALL remain 120 CSS px
- **AND** the controller SHALL retain its 173 CSS px layout height and 43 CSS
  px downward offset
- **AND** the Move control, action controls, labels, and gaps SHALL remain
  inside the horizontal and lower safe-area guide

#### Scenario: Compact portrait controller layout

- **WHEN** the game renders in a compact portrait mobile viewport
- **THEN** the Move art and both action arts SHALL use the same reduced size
  between 72 and 120 CSS px
- **AND** all three controls, their labels, and their gaps SHALL be fully
  visible inside the horizontal and lower safe-area guide without horizontal
  clipping or overlap
- **AND** the responsive controller layout height, downward offset, and Phaser
  layout envelope SHALL leave more visible game area than the desktop-sized
  controller layout

#### Scenario: Layout after a canvas resize

- **WHEN** the game presentation changes size, including device rotation,
  fullscreen changes, or a desktop window resize
- **THEN** the controller artwork, labels, gaps, layout height, and downward
  offset SHALL resolve for the new viewport together
- **AND** the Phaser layout envelope SHALL remain aligned with the UI
  controller area at its resolved height
- **AND** the Move control and both action controls SHALL share the controller
  area's vertical center
- **AND** the Move control and label SHALL occupy the left safe-area envelope
- **AND** the action-control group and labels SHALL occupy the right safe-area
  envelope
