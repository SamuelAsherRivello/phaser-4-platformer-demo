export const PLAYER_ANIMATION_CATALOG = [
  {
    id: "idle",
    fileName: "cyber prisoner idle-Sheet.png",
    textureKey: "foozle-player-idle",
    animationKey: "foozle-player-idle",
    frames: 8,
    frameWidth: 32,
    frameHeight: 32,
    frameRate: 10,
    loop: true,
  },
  {
    id: "run",
    fileName: "cyber prisoner run cycle-Sheet.png",
    textureKey: "foozle-player-run",
    animationKey: "foozle-player-run",
    frames: 8,
    frameWidth: 32,
    frameHeight: 32,
    frameRate: 14,
    loop: true,
  },
  {
    id: "jump",
    fileName: "cyber prisoner jump cycle -Sheet.png",
    textureKey: "foozle-player-jump",
    animationKey: "foozle-player-jump",
    frames: 11,
    frameWidth: 32,
    frameHeight: 32,
    frameRate: 14,
    loop: false,
  },
  {
    id: "double-jump",
    fileName: "cyber prisoner double jump-Sheet.png",
    textureKey: "foozle-player-double-jump",
    animationKey: "foozle-player-double-jump",
    frames: 7,
    frameWidth: 32,
    frameHeight: 32,
    frameRate: 14,
    loop: false,
  },
  {
    id: "wall-grab",
    fileName: "cyber prisoner Wall grab-Sheet.png",
    textureKey: "foozle-player-wall-grab",
    animationKey: "foozle-player-wall-grab",
    frames: 6,
    frameWidth: 32,
    frameHeight: 32,
    frameRate: 10,
    loop: true,
  },
  {
    id: "light-attack",
    fileName: "cyber prisoner Light attack slash-Sheet.png",
    textureKey: "foozle-player-light-attack",
    animationKey: "foozle-player-light-attack",
    frames: 18,
    frameWidth: 32,
    frameHeight: 32,
    frameRate: 18,
    loop: false,
  },
  {
    id: "heavy-attack",
    fileName: "cyber prisoner Heavy attack laser -Sheet.png",
    textureKey: "foozle-player-heavy-attack",
    animationKey: "foozle-player-heavy-attack",
    frames: 30,
    frameWidth: 32,
    frameHeight: 32,
    frameRate: 18,
    loop: false,
  },
  {
    id: "hurt",
    fileName: "cyber prisoner hurt-Sheet.png",
    textureKey: "foozle-player-hurt",
    animationKey: "foozle-player-hurt",
    frames: 3,
    frameWidth: 32,
    frameHeight: 32,
    frameRate: 12,
    loop: false,
  },
  {
    id: "death",
    fileName: "cyber prisoner death-Sheet.png",
    textureKey: "foozle-player-death",
    animationKey: "foozle-player-death",
    frames: 6,
    frameWidth: 32,
    frameHeight: 32,
    frameRate: 10,
    loop: false,
  },
];

const animationsById = new Map(PLAYER_ANIMATION_CATALOG.map((definition) => [definition.id, definition]));

export function getPlayerAnimationDefinition(id) {
  const definition = animationsById.get(id);
  if (!definition) {
    throw new Error(`Unknown Foozle Player animation: ${id}`);
  }
  return definition;
}

export function getPlayerAnimationDuration(id) {
  const definition = getPlayerAnimationDefinition(id);
  return (definition.frames / definition.frameRate) * 1000;
}
