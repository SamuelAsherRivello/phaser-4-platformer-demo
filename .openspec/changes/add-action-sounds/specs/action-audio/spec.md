## Purpose

Give each existing player action immediate, distinct sound-effect feedback in
the Phaser browser game regardless of the input device used.

## ADDED Requirements

### Requirement: Distinct action sound feedback
The system SHALL play the bundled `Attack01.mp3` sound effect when Action 1 is
triggered and the bundled `Arrow01.mp3` sound effect when Action 2 is
triggered. The two action sounds SHALL remain distinct.

#### Scenario: Action 1 is activated from either control method
- **WHEN** the player triggers Action 1 with C or its labeled touch control
- **THEN** the system plays the Action 1 sound effect once for that activation

#### Scenario: Action 2 is activated from either control method
- **WHEN** the player triggers Action 2 with V or its labeled touch control
- **THEN** the system plays the Action 2 sound effect once for that activation
