# tiled-platformer-level Specification

## Purpose

Provide a small, editable Tiled level that uses the supplied TreasureHunters
tilesheets and behaves as a crisp, physics-backed side-scrolling platformer.

## Requirements

### Requirement: Tiled-authored level palette
The system SHALL provide a Tiled project containing one playable level and
three 32 by 32 source-pixel tilesets sourced from the supplied Palm Tree
Island terrain, Pirate Ship terrain-and-back-wall, and Pirate Ship platforms
artwork. The level SHALL be editable in Tiled without requiring new artwork.

#### Scenario: The level is opened in Tiled
- **WHEN** a developer opens the provided level project
- **THEN** the level SHALL expose all three supplied tilesets in its palette
- **AND** every palette tile SHALL use a 32 by 32 source-pixel grid

### Requirement: Two-layer platform layout
The playable level SHALL contain exactly two tile layers named `Background`
and `Foreground`. `Background` SHALL be filled with one repeated terrain tile.
`Foreground` SHALL contain multiple solid platforms, with each platform made
from exactly five contiguous platform tiles.

#### Scenario: The level is displayed
- **WHEN** the map is loaded
- **THEN** the background SHALL visibly cover the map with its repeated tile
- **AND** the foreground SHALL visibly contain more than one five-tile platform

### Requirement: Logical-resolution pixel-art presentation
The game world, Tiled grid, and physics SHALL use 32 by 32 source-pixel tiles
within a 320 by 180 logical scene. The scene SHALL use pixel-art presentation
and fit-scale to the available display; at 1280 by 720 presentation pixels,
each source pixel SHALL occupy a 4 by 4 presentation-pixel area and each tile
SHALL occupy 128 by 128 presentation pixels.

#### Scenario: The game is presented at 1280 by 720
- **WHEN** the available game presentation area is 1280 by 720 pixels
- **THEN** the 320 by 180 logical scene SHALL be displayed at an exact 4x scale
- **AND** the 32 by 32 source-pixel tiles SHALL remain crisp without authored
  tile or physics measurements being enlarged

### Requirement: Platformer collision and spawn
The player SHALL retain the existing non-art square representation, start
above a foreground platform, and be affected by downward physics. Foreground
platform tiles SHALL be solid to the player, while background tiles SHALL NOT
block movement.

#### Scenario: The level starts
- **WHEN** the scene begins
- **THEN** the player SHALL fall from its spawn position
- **AND** the player SHALL land on a foreground platform rather than pass
  through it
