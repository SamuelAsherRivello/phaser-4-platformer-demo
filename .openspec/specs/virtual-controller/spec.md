# virtual-controller Specification

## Purpose

Provide consistent touch and keyboard controls for the Phaser platformer while
keeping all virtual controls within the same safe area as the HTML interface.

## Requirements

### Requirement: Safe-area controller zone

The system SHALL reserve a non-rendered virtual-controller zone along the
bottom of the logical game scene. Its horizontal bounds SHALL use the same 5
percent inset as the HTML UI layer, and its height SHALL be the greater of 45
logical pixels or 24 percent of the logical scene height. The player SHALL NOT
move into this zone.

#### Scenario: Layout after a canvas resize

- **WHEN** the game presentation area changes size
- **THEN** the controller zone SHALL be recalculated within the UI safe area
- **AND** the Move control and both action controls SHALL share the zone's
  vertical center
- **AND** Move SHALL be aligned to the left safe edge
- **AND** the action-control group SHALL be aligned to the right safe edge

### Requirement: Distinct virtual-controller artwork

The system SHALL present three labeled virtual controls: blue Move artwork,
neutral gray Action 1 artwork, and red Action 2 artwork.

#### Scenario: Controller controls are displayed

- **WHEN** the game scene is ready
- **THEN** the Move control SHALL show the `Move (A/D)` label
- **AND** Action 1 SHALL show the `Action 1 (C)` label with the generic
  joystick artwork
- **AND** Action 2 SHALL show the `Action 2 (V)` label with the Aim joystick
  artwork

### Requirement: Shared touch and keyboard feedback

The system SHALL keep the virtual-controller visuals synchronized with both
touch and keyboard input. Movement input SHALL be horizontal-only: left/right
arrow keys and A/D SHALL move the player horizontally, while up/down input
SHALL have no gameplay action.

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

### Requirement: Platformer action bindings

Action 1 and C SHALL request a jump only while the player is grounded. Action
2 and V SHALL trigger a brief flicker on the existing player square and SHALL
NOT introduce player artwork or an attack projectile.

#### Scenario: A grounded player triggers Action 1

- **WHEN** the player is standing on a foreground platform and Action 1 or C is
  pressed
- **THEN** the player SHALL begin an upward jump

#### Scenario: Action 2 is triggered

- **WHEN** Action 2 or V is pressed
- **THEN** the existing player square SHALL visibly flicker briefly
- **AND** no projectile or new player artwork SHALL be created
