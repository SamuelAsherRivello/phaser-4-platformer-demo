## MODIFIED Requirements

### Requirement: Safe-area controller zone

The system SHALL reserve a non-rendered virtual-controller exclusion zone along
the bottom of the Phaser canvas so the player cannot enter the space occupied
by the UI controls. The virtual controller SHALL render in the UI layer's body
region, within the same 5 percent safe-area inset used by that layer, and SHALL
remain anchored to the bottom of that region. Its controls SHALL retain their
current approximate dimensions and left/right placement.

#### Scenario: Layout after a canvas resize

- **WHEN** the game presentation area changes size
- **THEN** the Phaser exclusion zone SHALL be recalculated to match the UI
  controller area
- **AND** the Move control and both action controls SHALL share the controller
  area's vertical center
- **AND** Move SHALL remain aligned to the left safe edge
- **AND** the action-control group SHALL remain aligned to the right safe edge

### Requirement: Distinct virtual-controller artwork

The system SHALL present three labeled virtual controls in the UI layer's body
region: blue Move artwork, neutral gray Action 1 artwork, and red Action 2
artwork. These controls SHALL be browser UI elements rather than Phaser scene
objects.

#### Scenario: Controller controls are displayed

- **WHEN** the UI layer is ready
- **THEN** the Move control SHALL show the `Move (A/D)` label
- **AND** Action 1 SHALL show the `Action 1 (C)` label with the generic
  joystick artwork
- **AND** Action 2 SHALL show the `Action 2 (V)` label with the Aim joystick
  artwork

### Requirement: Shared touch and keyboard feedback

The system SHALL keep the UI-layer virtual-controller visuals synchronized
with both touch and keyboard input while forwarding the same control intent to
the Phaser game. Movement input SHALL remain horizontal-only: left/right arrow
keys and A/D SHALL move the player horizontally, while up/down input SHALL
have no gameplay action.

#### Scenario: Movement is supplied by touch or keyboard

- **WHEN** the player holds the Move control left or right, or holds A, D, Left,
  or Right
- **THEN** the Move handle SHALL show the active horizontal direction
- **AND** it SHALL return to its center when that input is released

#### Scenario: Vertical movement input is supplied

- **WHEN** the player presses Up, Down, W, or S or moves the Move control
  vertically without horizontal input
- **THEN** the player SHALL NOT receive vertical movement

#### Scenario: An action is supplied by touch or keyboard

- **WHEN** the player presses an Action 1 or Action 2 control, or the C or V
  key respectively
- **THEN** the matching action SHALL trigger
- **AND** the matching virtual button SHALL show its pressed state until the
  input is released
