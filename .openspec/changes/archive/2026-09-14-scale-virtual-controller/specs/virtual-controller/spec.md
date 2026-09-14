## MODIFIED Requirements

### Requirement: Safe-area controller zone

The system SHALL reserve a non-rendered virtual-controller exclusion zone along
the bottom of the Phaser canvas so the player cannot enter the space occupied
by the UI controls. The virtual controller SHALL render in the UI layer's body
region, within the same 5 percent safe-area inset used by that layer, and SHALL
remain anchored to the bottom of that region. At the supplied desktop guide
viewport, the Move art SHALL target 200 px and its label SHALL fit with it
inside the left yellow guide box. Each action art SHALL target 160 px and its
label SHALL fit with it inside its respective right yellow guide box. The
controller layout height and Phaser exclusion zone SHALL match those guide
regions rather than the current undersized layout.

#### Scenario: Layout after a canvas resize

- **WHEN** the game presentation area changes size
- **THEN** the Phaser exclusion zone SHALL be recalculated to match the
  guide-aligned UI controller area
- **AND** the Move control and both action controls SHALL share the controller
  area's vertical center
- **AND** the Move control and label SHALL occupy the left guide envelope
- **AND** each Action control and label SHALL occupy its respective right
  guide envelope
- **AND** Move SHALL remain aligned to the left safe edge
- **AND** the action-control group SHALL remain aligned to the right safe edge
