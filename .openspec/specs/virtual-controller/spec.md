# virtual-controller Specification

## Purpose

Provide consistent touch and keyboard controls for the Phaser platformer while
keeping all virtual controls within the same safe area as the HTML interface.

## Requirements

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

### Requirement: Distinct virtual-controller artwork

The system SHALL present three labeled virtual controls in the UI layer's body
region: blue Move artwork, neutral gray Action 1 artwork, and red Action 2
artwork. These controls SHALL be browser UI elements rather than Phaser scene
objects. Their visible labels SHALL communicate the fixed bindings without
offering a remapping interface.

#### Scenario: Controller controls are displayed

- **WHEN** the UI layer is ready
- **THEN** the Move control SHALL show the `Move (WASD / Arrows)` label
- **AND** Action 1 SHALL show the `Action 1 (C)` label with the generic
  joystick artwork
- **AND** Action 2 SHALL show the `Action 2 (B)` label with the Aim joystick
  artwork
- **AND** no visible controller text SHALL mention the Space key

### Requirement: Shared touch and keyboard feedback

The system SHALL keep the UI-layer virtual-controller visuals synchronized
with both touch and the fixed keyboard input while forwarding the same control
intent to the Phaser game. The keyboard movement family SHALL consist of W, A,
S, D and the arrow keys, with no user-selectable remapping. Movement input
SHALL remain horizontal-only: A/D and Left/Right SHALL move the player
horizontally, while W/S and Up/Down SHALL have no gameplay action.

#### Scenario: Movement is supplied by touch or keyboard

- **WHEN** the player holds the Move control left or right, or holds A, D,
  Left, or Right
- **THEN** the Move handle SHALL show the active horizontal direction
- **AND** the player SHALL move in that horizontal direction
- **AND** the handle SHALL return to its center when that input is released

#### Scenario: Vertical movement input is supplied

- **WHEN** the player presses W, S, Up, or Down
- **THEN** the input SHALL be accepted as part of the fixed movement keyboard
  family
- **AND** the player SHALL NOT receive vertical movement or an action request

#### Scenario: An action is supplied by touch or keyboard

- **WHEN** the player presses an Action 1 or Action 2 control, C, Space, or B
- **THEN** the matching action SHALL trigger
- **AND** the matching virtual button SHALL show its pressed state until the
  input is released

### Requirement: Platformer action bindings

Action 1, C, and Space SHALL request a jump only while the player is grounded.
Action 2 and B SHALL trigger a brief flicker on the existing player square and
SHALL NOT introduce player artwork or an attack projectile. The Space binding
SHALL remain functional without appearing in visible controller text.

#### Scenario: A grounded player triggers Action 1

- **WHEN** the player is standing on a foreground platform and Action 1, C, or
  Space is pressed
- **THEN** the player SHALL begin an upward jump

#### Scenario: Action 2 is triggered

- **WHEN** Action 2 or B is pressed
- **THEN** the existing player square SHALL visibly flicker briefly
- **AND** no projectile or new player artwork SHALL be created

#### Scenario: Hidden jump binding is not advertised

- **WHEN** the virtual controller is displayed
- **THEN** pressing Space SHALL still request the grounded jump action
- **AND** the controller labels SHALL NOT disclose the Space binding
