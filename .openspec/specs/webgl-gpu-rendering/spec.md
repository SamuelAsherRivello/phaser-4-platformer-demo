# webgl-gpu-rendering Specification

## Purpose

Make the browser demo report and use its actual WebGL rendering mode while
using Phaser's GPU-batched scene facilities for static sprites and tile maps.

## Requirements

### Requirement: WebGL-only render contract
The system SHALL initialize the game with WebGL as its required renderer and
SHALL NOT offer a Canvas fallback. The HTML status UI SHALL identify the active
render mode as `WebGL` and SHALL state that the game uses a 320 by 180 logical
resolution.

#### Scenario: Game is initialized in a supported browser
- **WHEN** the game canvas is created
- **THEN** the game SHALL use the WebGL renderer
- **AND** the renderer status SHALL NOT describe the renderer as WebGPU

### Requirement: GPU-batched scene layers
The system SHALL render static decorative sprites from supplied artwork through
a GPU sprite batch and SHALL render each tile-map layer through a GPU tile-map
batch. The system SHALL use one source tilesheet per rendered tile-map layer.

#### Scenario: The platformer level is displayed
- **WHEN** the game scene is ready
- **THEN** existing-art decoration SHALL be visible behind the level through a
  GPU sprite batch
- **AND** the background and foreground map layers SHALL each be rendered
  through a GPU tile-map batch
