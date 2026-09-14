## MODIFIED Requirements

### Requirement: Shared touch and keyboard feedback

The system SHALL keep the UI-layer virtual-controller visuals synchronized
with both touch and the fixed keyboard input while forwarding the same control
intent to the Phaser game. The keyboard movement family SHALL consist of W, A,
S, D and the arrow keys, with no user-selectable remapping. Movement input
SHALL remain horizontal-only: A/D and Left/Right SHALL move the player
horizontally, while W/S and Up/Down SHALL have no gameplay action. The
player's maximum horizontal speed SHALL be 240 source pixels per second. A
fully held horizontal keyboard direction or a fully deflected Move control
SHALL reach that speed from rest in 125 ms. When horizontal input is released,
the player's horizontal velocity SHALL return to zero in 125 ms. Partial Move
control deflection SHALL produce a proportionally lower horizontal target
speed, using the same direction and velocity-ramp behavior.

#### Scenario: Movement is supplied by touch or keyboard

- **WHEN** the player holds the Move control left or right, or holds A, D,
  Left, or Right
- **THEN** the Move handle SHALL show the active horizontal direction
- **AND** the player SHALL move in that horizontal direction
- **AND** a fully held or fully deflected direction from rest SHALL reach 240
  source pixels per second after 125 ms
- **AND** the handle SHALL return to its center when that input is released

#### Scenario: Horizontal input is released

- **WHEN** the player releases a horizontal keyboard direction or the Move
  control after moving horizontally
- **THEN** the player SHALL decelerate from its current horizontal velocity to
  zero in 125 ms

#### Scenario: Partial touch movement is supplied

- **WHEN** the player holds the Move control at a horizontal deflection between
  its center and its maximum left or right position
- **THEN** the player SHALL move in the corresponding direction
- **AND** the target horizontal speed SHALL be proportional to that deflection
- **AND** the player SHALL NOT exceed 240 source pixels per second

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
