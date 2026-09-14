## MODIFIED Requirements

### Requirement: Safe-area controller zone

The system SHALL keep a non-rendered virtual-controller layout envelope along
the bottom of the Phaser canvas aligned with the UI controller's bottom safe
area. The virtual controller SHALL render in the UI layer's body region, within
the same 5 percent safe-area inset used by that layer, and SHALL remain anchored
to the bottom of that region. The Move art and each action art SHALL retain a
fixed 120 CSS px size. Their labels and spacing SHALL fit with them inside the
supplied lower guide. The controller SHALL use a fixed 173 CSS px layout height
and a 43 CSS px downward offset into that guide. The Phaser layout envelope
SHALL retain the corresponding 173 CSS px height when the game presentation is
resized; it SHALL NOT shrink with the viewport. The rest of the game
presentation and UI outside the virtual controller SHALL remain responsive.

#### Scenario: Layout after a canvas resize

- **WHEN** the game presentation area changes size, including when the player
  leaves fullscreen and shrinks the window
- **THEN** the Move art and each action art SHALL remain 120 CSS px
- **AND** their labels and gaps SHALL remain inside the 173 CSS px lower guide
- **AND** the controller SHALL retain its 43 CSS px downward offset and the
  Phaser layout zone SHALL retain its 173 CSS px height rather than scale down
  with the presentation area
- **AND** the Phaser layout envelope SHALL remain aligned with the UI controller
  area
- **AND** the Move control and both action controls SHALL share the controller
  area's vertical center
- **AND** the Move control and label SHALL occupy the left guide envelope
- **AND** each Action control and label SHALL occupy its respective right
  guide envelope
- **AND** Move SHALL remain aligned to the left safe edge
- **AND** the action-control group SHALL remain aligned to the right safe edge

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
speed, using the same direction and velocity-ramp behavior. The virtual
controller's touch buttons SHALL NOT be reachable through sequential Tab
navigation; fixed keyboard input SHALL remain available without focusing those
buttons.

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

#### Scenario: Sequential keyboard focus skips touch controls

- **WHEN** the player advances focus with the Tab key
- **THEN** the Move, Action 1, and Action 2 touch buttons SHALL be skipped
- **AND** the surrounding page controls SHALL remain reachable by sequential
  keyboard focus
