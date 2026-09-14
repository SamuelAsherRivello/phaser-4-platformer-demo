## Purpose

Provide the Foozle Player with readable animated platforming, combat, damage,
and terminal-death behavior while preserving the established game controls.

## ADDED Requirements

### Requirement: Complete Foozle Player animation catalog
The system SHALL load and make reachable every supplied 32 by 32 Foozle Player
animation: idle (8 frames), run (8), jump (11), double jump (7), wall grab (6),
light attack (18), heavy attack (30), hurt (3), and death (6). The player SHALL
initially display the right-facing idle animation and flip its artwork when its
most recent horizontal movement direction is left.

#### Scenario: Player state changes during normal platforming
- **WHEN** the living player is grounded and stationary, moves horizontally,
  starts a grounded jump, spends its air jump, or meets the wall-grab criterion
- **THEN** it SHALL display idle, run, jump, double jump, or wall grab,
  respectively
- **AND** idle, run, and wall grab SHALL loop while their state remains active
- **AND** jump and double jump SHALL play once without preventing physics
  movement or landing

### Requirement: One grounded jump and one air jump
The system SHALL permit a grounded jump and exactly one additional Action 1
jump while airborne after that grounded jump. Landing SHALL reset this
allowance, and a dead player SHALL not jump.

#### Scenario: Player attempts consecutive airborne jumps
- **WHEN** the player performs a grounded jump and presses Action 1 once in
  the air
- **THEN** the second jump SHALL apply the normal upward jump velocity and
  display the double-jump animation
- **AND WHEN** Action 1 is pressed again before landing
- **THEN** it SHALL not apply another jump velocity or restart double jump

### Requirement: Intentional wall-grab animation criterion
The system SHALL display wall grab only while the living player is airborne,
is touching the left or right side of a solid `Midground1` tile, and has
horizontal input toward that contacted wall. Wall grab SHALL be an animation
state only and SHALL not alter gravity, collision, or jump allowances.

#### Scenario: Player slides beside a wall
- **WHEN** the airborne player holds movement into a solid wall it contacts
- **THEN** the player SHALL display the wall-grab animation until contact,
  directional input, grounding, or life state changes
- **AND** its existing physics behavior SHALL continue unchanged

### Requirement: Timed alternating attack chain
The living player's Action 2 presses SHALL start a light attack unless the
previous accepted Action 2 press was less than 500 ms earlier, in which case
they SHALL alternate light and heavy attacks. An interval of 500 ms or more
SHALL reset the next attack to light. Each accepted press SHALL immediately
start its selected non-looping animation, even if another attack animation is
still playing.

#### Scenario: Player presses Action 2 at a slow cadence
- **WHEN** Action 2 is pressed repeatedly with at least 500 ms between presses
- **THEN** every press SHALL start the light-attack animation

#### Scenario: Player presses Action 2 rapidly
- **WHEN** the player presses Action 2 and then makes successive presses less
  than 500 ms apart
- **THEN** the visible sequence SHALL alternate light, heavy, light, heavy

### Requirement: Laser-spike damage and health
The player SHALL start each page load with 100 health. Contact with an active
laser-spike damage sensor SHALL be non-blocking, display hurt, subtract 25
health, and apply horizontal knockback away from that sensor. A player hit by
one sensor SHALL ignore further laser-spike damage for 500 ms, so a sustained
overlap cannot count as multiple hits.

#### Scenario: Player touches a laser spike
- **WHEN** a living player without hit protection contacts a laser-spike sensor
- **THEN** the player SHALL have 25 less health, play hurt, and move away from
  the sensor
- **AND** further laser-spike contacts during the following 500 ms SHALL not
  change its health

### Requirement: Terminal death state
When damage reduces health to zero, the system SHALL play the non-looping death
animation once, stop the player, and ignore horizontal, jump, and attack input
until the browser page is refreshed. A page refresh SHALL start a new player
with 100 health; no in-game revive or restart behavior SHALL be available.

#### Scenario: Player receives the fourth valid laser hit
- **WHEN** a player at 25 health takes another valid laser-spike hit
- **THEN** health SHALL become zero and the death animation SHALL play once
- **AND** movement, Action 1, and Action 2 SHALL have no gameplay effect until
  the page is refreshed
