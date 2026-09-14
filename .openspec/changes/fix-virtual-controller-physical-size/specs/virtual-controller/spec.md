## MODIFIED Requirements

### Requirement: Safe-area controller zone

The system SHALL reserve a non-rendered virtual-controller exclusion zone along
the bottom of the Phaser canvas so the player cannot enter the space occupied
by the UI controls. The virtual controller SHALL render in the UI layer's body
region, within the same 5 percent safe-area inset used by that layer, and SHALL
remain anchored to the bottom of that region. The Move art SHALL retain a fixed
200 CSS px size and its label SHALL fit with it inside the left yellow guide
envelope. Each action art SHALL retain a fixed 160 CSS px size and its label
SHALL fit with it inside its respective right yellow guide envelope. The
controller labels, control spacing, controller layout height, and Phaser
exclusion zone SHALL retain the corresponding fixed controller envelope when
the game presentation is resized; they SHALL NOT shrink with the viewport. The
rest of the game presentation and UI outside the virtual controller SHALL
remain responsive.

#### Scenario: Layout after a canvas resize

- **WHEN** the game presentation area changes size, including when the player
  leaves fullscreen and shrinks the window
- **THEN** the Move art SHALL remain 200 CSS px and each action art SHALL
  remain 160 CSS px
- **AND** the controller labels, gaps, layout height, and Phaser exclusion
  zone SHALL retain the fixed controller envelope rather than scale down with
  the presentation area
- **AND** the Phaser exclusion zone SHALL remain aligned with the UI controller
  area
- **AND** the Move control and both action controls SHALL share the controller
  area's vertical center
- **AND** the Move control and label SHALL occupy the left guide envelope
- **AND** each Action control and label SHALL occupy its respective right
  guide envelope
- **AND** Move SHALL remain aligned to the left safe edge
- **AND** the action-control group SHALL remain aligned to the right safe edge
