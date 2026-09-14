import * as Phaser from "phaser";
import levelMapUrl from "../assets/maps/foozle-lab-runtime.json?url";
import levelMapData from "../assets/maps/foozle-lab-level.json";
import foozleLabStructureUrl from "../assets/images/FoozleLab/Tileset/level_tileset-288.png?url";
import foozleLabDecorUrl from "../assets/images/FoozleLab/Decor/full decor tiles.png?url";
import controlPanelUrl from "../assets/images/FoozleLab/Barrier_Control_Panel/control_panel_idle.png?url";
import laserSpikesUrl from "../assets/images/FoozleLab/Traps/laser_spikes_idle.png?url";
import sawUrl from "../assets/images/FoozleLab/Traps/saw_idle.png?url";
import wallBladesUrl from "../assets/images/FoozleLab/Traps/wall_blades.png?url";
import playerIdleUrl from "../assets/images/FoozlePlayer/cyber prisoner idle-Sheet.png?url";
import playerRunUrl from "../assets/images/FoozlePlayer/cyber prisoner run cycle-Sheet.png?url";
import playerJumpUrl from "../assets/images/FoozlePlayer/cyber prisoner jump cycle -Sheet.png?url";
import playerDoubleJumpUrl from "../assets/images/FoozlePlayer/cyber prisoner double jump-Sheet.png?url";
import playerWallGrabUrl from "../assets/images/FoozlePlayer/cyber prisoner Wall grab-Sheet.png?url";
import playerLightAttackUrl from "../assets/images/FoozlePlayer/cyber prisoner Light attack slash-Sheet.png?url";
import playerHeavyAttackUrl from "../assets/images/FoozlePlayer/cyber prisoner Heavy attack laser -Sheet.png?url";
import playerHurtUrl from "../assets/images/FoozlePlayer/cyber prisoner hurt-Sheet.png?url";
import playerDeathUrl from "../assets/images/FoozlePlayer/cyber prisoner death-Sheet.png?url";
import attackSoundUrl from "../assets/audio/sfx/Attack01.mp3?url";
import arrowSoundUrl from "../assets/audio/sfx/Arrow01.mp3?url";
import {
  bindPlatformerActions,
  getHorizontalInput,
  getUiState,
  setFrameRate,
  setRendererStatus,
  setTilemapStatus,
  subscribeUiState,
} from "./platformer-ui-bridge.js";
import { moveHorizontalVelocityTowardsInput } from "./player-motion.js";
import { PLAYER_ANIMATION_CATALOG, getPlayerAnimationDefinition } from "./player-animation-catalog.js";
import { createPlayerState, getSelectedPlayerAnimation, handlePlayerDamage, markPlayerLanded, requestPlayerAttack, requestPlayerJump } from "./player-state.js";
import { mountPlatformerUi } from "./ui.jsx";

const TILE_SIZE = 32;
const TARGET_SCALE = 1;
const PLAYER_WIDTH = TILE_SIZE;
const PLAYER_HEIGHT = TILE_SIZE;
const PLAYER_SPEED = 240;
const PLAYER_MOVEMENT_RAMP_DURATION = 125;
const PLAYER_HORIZONTAL_ACCELERATION = PLAYER_SPEED / (PLAYER_MOVEMENT_RAMP_DURATION / 1000);
const BASE_JUMP_SPEED = 270;
const JUMP_HEIGHT_MULTIPLIER = 2;
const JUMP_SPEED = BASE_JUMP_SPEED * Math.sqrt(JUMP_HEIGHT_MULTIPLIER);
const PLAYER_SURFACE_DUST_TEXTURE = "player-surface-dust";
const MOVEMENT_DUST_INTERVAL = 70;
const MOVEMENT_DUST_TRAIL_OFFSET = 4;
const ACTION_ONE_SOUND_KEY = "action-one-sound";
const ACTION_TWO_SOUND_KEY = "action-two-sound";
const UI_SAFE_AREA_RATIO = 0.05;
const VIRTUAL_CONTROLLER_ZONE_HEIGHT = 173;
const PLAYER_KNOCKBACK_SPEED = 260;
const PLAYER_KNOCKBACK_DURATION = 180;
const LASER_SPIKES_GID = 111;
const PLAYER_ASSET_URLS = {
  idle: playerIdleUrl,
  run: playerRunUrl,
  jump: playerJumpUrl,
  "double-jump": playerDoubleJumpUrl,
  "wall-grab": playerWallGrabUrl,
  "light-attack": playerLightAttackUrl,
  "heavy-attack": playerHeavyAttackUrl,
  hurt: playerHurtUrl,
  death: playerDeathUrl,
};
const FOOZLELAB_INSTANCE_TILESETS = [
  { firstgid: 82, lastgid: 90, name: "FoozleLab Decor", key: "foozle-lab-decor" },
  { firstgid: 91, lastgid: 110, name: "FoozleLab Control Panel", key: "foozle-lab-control-panel" },
  { firstgid: 111, lastgid: 120, name: "FoozleLab Laser Spikes", key: "foozle-lab-laser-spikes" },
  { firstgid: 121, lastgid: 126, name: "FoozleLab Saw", key: "foozle-lab-saw" },
  { firstgid: 127, lastgid: 155, name: "FoozleLab Wall Blades", key: "foozle-lab-wall-blades" },
];

class PlatformerScene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON("foozle-lab-level", levelMapUrl);
    this.load.image("foozle-lab-structure", foozleLabStructureUrl);
    this.load.spritesheet("foozle-lab-decor", foozleLabDecorUrl, { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE });
    this.load.spritesheet("foozle-lab-control-panel", controlPanelUrl, { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE });
    this.load.spritesheet("foozle-lab-laser-spikes", laserSpikesUrl, { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE });
    this.load.spritesheet("foozle-lab-saw", sawUrl, { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE });
    this.load.spritesheet("foozle-lab-wall-blades", wallBladesUrl, { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE });
    for (const definition of PLAYER_ANIMATION_CATALOG) {
      this.load.spritesheet(definition.textureKey, PLAYER_ASSET_URLS[definition.id], {
        frameWidth: definition.frameWidth,
        frameHeight: definition.frameHeight,
      });
    }
    this.load.audio(ACTION_ONE_SOUND_KEY, attackSoundUrl);
    this.load.audio(ACTION_TWO_SOUND_KEY, arrowSoundUrl);
  }

  create() {
    this.createLevel();
    this.createPlayerAnimations();
    const playerSpawn = this.getPlayerSpawn();

    this.player = this.add.rectangle(playerSpawn.x, playerSpawn.y, PLAYER_WIDTH, PLAYER_HEIGHT, 0x38bdf8);
    this.player.setName("player");
    this.player.setStrokeStyle(1, 0xf8fafc, 0.8);
    this.player.setDepth(3);
    this.player.setVisible(false);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.midground1Layer);
    this.playerSprite = this.add.sprite(playerSpawn.x, playerSpawn.y, getPlayerAnimationDefinition("idle").textureKey);
    this.playerSprite.setOrigin(0.5, 1);
    this.playerSprite.setDepth(3);
    this.playerState = createPlayerState();
    this.playerFacing = 1;
    this.playerKnockbackUntil = 0;
    this.wasPlayerGrounded = false;
    for (const sensor of this.laserSpikeSensors) {
      this.physics.add.overlap(this.player, sensor, () => this.handleLaserSpikeOverlap(sensor));
    }
    this.createPlayerSurfaceParticles();
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
    this.cameraDeadzoneDebugOutline = this.add.rectangle(0, 0, 0, 0);
    this.cameraDeadzoneDebugOutline.setOrigin(0);
    this.cameraDeadzoneDebugOutline.setScrollFactor(0);
    this.cameraDeadzoneDebugOutline.setDepth(5);
    this.cameraDeadzoneDebugOutline.setFillStyle(0x22d3ee, 0.08);
    this.cameraDeadzoneDebugOutline.setStrokeStyle(2, 0x22d3ee, 0.95);
    this.cameraDeadzoneDebugOutline.setVisible(false);
    this.playerColliderDebugGraphics = this.add.graphics();
    this.playerColliderDebugGraphics.setDepth(6);

    this.unbindPlatformerActions = bindPlatformerActions({
      jump: () => this.jumpPlayer(),
      attack: () => this.attackPlayer(),
      toggleFullscreen: () => this.toggleFullscreen(),
    });
    this.applyUiState(getUiState());
    this.unsubscribeUiState = subscribeUiState((uiState) => this.applyUiState(uiState));
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.unbindPlatformerActions();
      this.unsubscribeUiState();
    });
    this.layout();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.layout, this);
  }

  createPlayerAnimations() {
    for (const definition of PLAYER_ANIMATION_CATALOG) {
      this.anims.create({
        key: definition.animationKey,
        frames: this.anims.generateFrameNumbers(definition.textureKey, { start: 0, end: definition.frames - 1 }),
        frameRate: definition.frameRate,
        repeat: definition.loop ? -1 : 0,
      });
    }
  }

  createLevel() {
    this.map = this.make.tilemap({ key: "foozle-lab-level" });
    const foozleLabStructure = this.map.addTilesetImage("FoozleLab Structure", "foozle-lab-structure", TILE_SIZE, TILE_SIZE);

    this.backgroundLayer = this.createStaticLayer("Background", foozleLabStructure, 0);
    this.midground1Layer = this.createStaticLayer("Midground1", foozleLabStructure, 1);
    this.midground2Layer = this.createStaticLayer("Midground2", foozleLabStructure, 2);
    this.foregroundLayer = this.createStaticLayer("Foreground", foozleLabStructure, 4);
    this.createFoozleLabSetPieces();
    this.midground1Layer.setCollisionByExclusion([-1], true);
    this.tilemapDebugGraphics = this.add.graphics();
    this.tilemapDebugGraphics.setDepth(2);
    this.platformColliderDebugGraphics = this.add.graphics();
    this.platformColliderDebugGraphics.setDepth(6);
  }

  createStaticLayer(name, tileset, depth) {
    const layer = this.map.createLayer(name, tileset, 0, 0, true);
    layer.setDepth(depth);
    layer.setVisible(true);
    return layer;
  }

  createFoozleLabSetPieces() {
    const definitions = [
      { gid: 91, key: "foozle-lab-control-panel", animation: "foozle-lab-control-panel-idle", frames: 20, frameRate: 10, depth: 2 },
      { gid: 111, key: "foozle-lab-laser-spikes", animation: "foozle-lab-laser-spikes-idle", frames: 10, frameRate: 12, depth: 2 },
      { gid: 121, key: "foozle-lab-saw", animation: "foozle-lab-saw-idle", frames: 6, frameRate: 11, depth: 2 },
      { gid: 127, key: "foozle-lab-wall-blades", animation: "foozle-lab-wall-blades-idle", frames: 29, frameRate: 18, depth: 2 },
    ];
    const layers = [
      { name: "Background", depth: 0 },
      { name: "Midground1", depth: 1 },
      { name: "Midground2", depth: 2 },
      { name: "Foreground", depth: 4 },
    ];
    this.laserSpikeSensors = [];

    for (const definition of definitions) {
      this.anims.create({ key: definition.animation, frames: this.anims.generateFrameNumbers(definition.key, { start: 0, end: definition.frames - 1 }), frameRate: definition.frameRate, repeat: -1 });
    }

    for (const layerInfo of layers) {
      const layer = levelMapData.layers.find((candidate) => candidate.name === layerInfo.name);
      if (!layer) {
        throw new Error(`The FoozleLab map is missing its ${layerInfo.name} layer.`);
      }
      for (const [index, gid] of layer.data.entries()) {
        const definition = definitions.find((candidate) => candidate.gid === gid);
        const x = (index % layer.width) * TILE_SIZE + TILE_SIZE * 0.5;
        const y = Math.floor(index / layer.width) * TILE_SIZE + TILE_SIZE * 0.5;
        if (definition) {
          this.add.sprite(x, y, definition.key).play(definition.animation).setDepth(layerInfo.depth);
          if (definition.gid === LASER_SPIKES_GID) {
            this.createLaserSpikeSensor(x, y);
          }
        } else if (gid >= 82 && gid <= 90) {
          this.add.sprite(x, y, "foozle-lab-decor", gid - 82).setDepth(layerInfo.depth);
        }
      }
    }
  }

  createLaserSpikeSensor(x, y) {
    const sensor = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0xff0000, 0.18)
      .setStrokeStyle(1, 0xff0000, 0.95)
      .setDepth(2.25);
    this.physics.add.existing(sensor, true);
    this.laserSpikeSensors.push(sensor);
  }

  handleLaserSpikeOverlap(sensor) {
    const result = handlePlayerDamage(this.playerState, this.time.now);
    if (!result.accepted) {
      return;
    }

    if (result.died) {
      this.player.body.setVelocity(0, 0);
      this.playerKnockbackUntil = Number.POSITIVE_INFINITY;
      this.playPlayerAnimation("death", true);
      return;
    }

    const direction = Math.sign(this.player.x - sensor.x) || -1;
    this.player.body.setVelocityX(direction * PLAYER_KNOCKBACK_SPEED);
    this.playerKnockbackUntil = this.time.now + PLAYER_KNOCKBACK_DURATION;
    this.playPlayerAnimation("hurt", true);
  }

  createPerInstanceLayers(layerName, depth) {
    const sourceLayer = levelMapData.layers.find((layer) => layer.name === layerName);
    if (!sourceLayer) {
      throw new Error(`The FoozleLab map is missing its ${layerName} layer.`);
    }

    return sourceLayer.data.flatMap((gid, index) => {
      const tilesetInfo = FOOZLELAB_INSTANCE_TILESETS.find(({ firstgid, lastgid }) => gid >= firstgid && gid <= lastgid);
      if (!tilesetInfo) {
        return [];
      }

      const column = index % sourceLayer.width;
      const row = Math.floor(index / sourceLayer.width);
      const instanceMap = this.make.tilemap({ key: "foozle-lab-level" });
      const tileset = instanceMap.addTilesetImage(tilesetInfo.name, tilesetInfo.key, TILE_SIZE, TILE_SIZE);
      const instanceLayerData = instanceMap.getLayer(layerName).data;
      const sourceTile = instanceLayerData.data[row][column];

      for (const tileRow of instanceLayerData.data) {
        for (const tile of tileRow) {
          tile.index = -1;
        }
      }
      sourceTile.index = gid;

      const layer = instanceMap.createLayer(layerName, tileset, 0, 0, true);
      layer.setDepth(depth);
      return [layer];
    });
  }

  createPlayerSurfaceParticles() {
    const dustTexture = this.add.graphics();
    dustTexture.fillStyle(0xa3a3a3, 1);
    dustTexture.fillRect(0, 0, 4, 4);
    dustTexture.generateTexture(PLAYER_SURFACE_DUST_TEXTURE, 4, 4);
    dustTexture.destroy();

    this.movementDustEmitter = this.add.particles(0, 0, PLAYER_SURFACE_DUST_TEXTURE, {
      emitting: false,
      lifespan: { min: 260, max: 320 },
      alpha: { start: 0.8, end: 0 },
      scale: { start: 2, end: 0.7 },
      speedX: { min: -16, max: 16 },
      speedY: { min: -20, max: -8 },
      gravityY: 50,
      maxParticles: 24,
      quantity: 2,
    }).setDepth(3.5);
    this.landingDustEmitter = this.add.particles(0, 0, PLAYER_SURFACE_DUST_TEXTURE, {
      emitting: false,
      lifespan: { min: 350, max: 430 },
      alpha: { start: 0.85, end: 0 },
      scale: { start: 4.5, end: 1.1 },
      speedX: { min: -42, max: 42 },
      speedY: { min: -46, max: -18 },
      gravityY: 90,
      maxParticles: 32,
      quantity: 6,
    }).setDepth(3.5);
    this.nextMovementDustAt = 0;
    this.wasPlayerOnForegroundSurface = false;
    this.hasPlayerBeenAirborne = false;
  }

  toggleFullscreen() {
    if (!this.scale.fullscreen.available) {
      return false;
    }

    if (this.scale.isFullscreen) {
      this.scale.stopFullscreen();
    } else {
      this.scale.startFullscreen();
    }
    return true;
  }

  getPlayerSpawn() {
    const objectLayer = this.map.getObjectLayer("Objects");
    const spawnPoints = objectLayer?.objects.filter((object) => object.name === "PlayerSpawn" && object.point) ?? [];

    if (spawnPoints.length !== 1) {
      throw new Error("The Tiled map must define exactly one point object named PlayerSpawn in the Objects layer.");
    }

    return spawnPoints[0];
  }

  renderTilemapDebug(enabled) {
    this.tilemapDebugGraphics.clear();
    if (!enabled) {
      return;
    }

    this.tilemapDebugGraphics.lineStyle(1, 0xfacc15, 0.2);
    for (let row = 0; row < this.map.height; row += 1) {
      for (let column = 0; column < this.map.width; column += 1) {
        this.tilemapDebugGraphics.strokeRect(column * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  applyUiState({ tilemapDebugEnabled, cameraDebugEnabled, collidersDebugEnabled }) {
    this.renderTilemapDebug(tilemapDebugEnabled);
    this.renderCameraDeadzoneDebug(cameraDebugEnabled);
    this.renderColliderDebug(collidersDebugEnabled);
  }

  renderColliderDebug(enabled) {
    this.colliderDebugEnabled = enabled;
    this.platformColliderDebugGraphics.clear();
    this.playerColliderDebugGraphics.clear();
    if (!enabled) {
      return;
    }

    this.platformColliderDebugGraphics.lineStyle(2, 0xfacc15, 0.95);
    this.midground1Layer.forEachTile((tile) => {
      if (tile.collides) {
        this.platformColliderDebugGraphics.strokeRect(tile.pixelX, tile.pixelY, tile.width, tile.height);
      }
    });
    this.renderPlayerColliderDebug();
  }

  renderPlayerColliderDebug() {
    this.playerColliderDebugGraphics.clear();
    if (!this.colliderDebugEnabled) {
      return;
    }

    const { x, y, width, height } = this.player.body;
    this.playerColliderDebugGraphics.lineStyle(2, 0xfacc15, 0.95);
    this.playerColliderDebugGraphics.strokeRect(x, y, width, height);
  }

  renderCameraDeadzoneDebug(enabled) {
    this.cameraDebugEnabled = enabled;
    const camera = this.cameras.main;
    const { deadzone } = camera;
    if (!enabled || !deadzone) {
      this.cameraDeadzoneDebugOutline.setVisible(false);
      return;
    }

    this.cameraDeadzoneDebugOutline
      .setSize(deadzone.width, deadzone.height)
      .setPosition(
        camera.x + (camera.width - deadzone.width) * 0.5,
        camera.y + (camera.height - deadzone.height) * 0.5,
      )
      .setVisible(true);
  }

  layout() {
    const { width, height } = this.scale;
    const safeInsetX = width * UI_SAFE_AREA_RATIO;
    const safeInsetY = height * UI_SAFE_AREA_RATIO;
    const controllerZoneHeight = VIRTUAL_CONTROLLER_ZONE_HEIGHT;

    this.virtualControllerArea = new Phaser.Geom.Rectangle(
      safeInsetX,
      height - safeInsetY - controllerZoneHeight,
      width - safeInsetX * 2,
      controllerZoneHeight,
    );
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.setDeadzone(this.cameras.main.width * 0.5, this.cameras.main.height * 0.5);
    this.renderCameraDeadzoneDebug(this.cameraDebugEnabled);

  }

  jumpPlayer() {
    if (this.playerState.isDead) {
      return;
    }
    this.sound.play(ACTION_ONE_SOUND_KEY);
    const jump = requestPlayerJump(this.playerState, {
      grounded: this.player.body.blocked.down || this.player.body.touching.down,
      time: this.time.now,
    });
    if (!jump) {
      return;
    }

    this.player.body.setVelocityY(-JUMP_SPEED);
    this.playPlayerAnimation(jump, true);
  }

  attackPlayer() {
    if (this.playerState.isDead) {
      return;
    }
    this.sound.play(ACTION_TWO_SOUND_KEY);
    const attack = requestPlayerAttack(this.playerState, this.time.now);
    if (!attack) {
      return;
    }

    this.playPlayerAnimation(attack, true);
  }

  playPlayerAnimation(id, force = false) {
    const definition = getPlayerAnimationDefinition(id);
    if (force || this.playerSprite.anims.currentAnim?.key !== definition.animationKey) {
      this.playerSprite.play(definition.animationKey, true);
    }
  }

  syncPlayerSprite(time) {
    const body = this.player.body;
    const horizontalInput = getHorizontalInput();
    if (horizontalInput !== 0) {
      this.playerFacing = Math.sign(horizontalInput);
    }

    this.playerSprite.setPosition(body.center.x, body.bottom);
    this.playerSprite.setFlipX(this.playerFacing < 0);
    const animation = getSelectedPlayerAnimation(this.playerState, {
      grounded: body.blocked.down || body.touching.down,
      horizontalInput,
      blockedLeft: body.blocked.left || body.touching.left,
      blockedRight: body.blocked.right || body.touching.right,
    }, time);
    this.playPlayerAnimation(animation);
  }

  getPlayerSurfaceContact() {
    const body = this.player.body;
    if (!body.blocked.down && !body.touching.down) {
      return null;
    }

    const surfaceTile = this.midground1Layer.getTileAtWorldXY(body.center.x, body.bottom + 1);
    if (!surfaceTile?.collides) {
      return null;
    }

    return { x: body.center.x, y: body.bottom };
  }

  emitMovementDust(surfaceContact, time) {
    const horizontalVelocity = this.player.body.velocity.x;
    if (horizontalVelocity === 0 || time < this.nextMovementDustAt) {
      return;
    }

    const trailDirection = Math.sign(horizontalVelocity);
    this.movementDustEmitter.emitParticleAt(
      surfaceContact.x - trailDirection * MOVEMENT_DUST_TRAIL_OFFSET,
      surfaceContact.y,
    );
    this.nextMovementDustAt = time + MOVEMENT_DUST_INTERVAL;
  }

  updatePlayerHorizontalVelocity(delta) {
    if (this.playerState.isDead) {
      this.player.body.setVelocityX(0);
      return;
    }
    if (this.time.now < this.playerKnockbackUntil) {
      return;
    }

    const maximumVelocityChange = PLAYER_HORIZONTAL_ACCELERATION * (delta / 1000);
    const currentVelocity = this.player.body.velocity.x;
    const nextVelocity = moveHorizontalVelocityTowardsInput(
      currentVelocity,
      getHorizontalInput(),
      PLAYER_SPEED,
      maximumVelocityChange,
    );

    this.player.body.setVelocityX(nextVelocity);
  }

  update(time, delta) {
    this.updatePlayerHorizontalVelocity(delta);
    this.renderPlayerColliderDebug();
    const surfaceContact = this.getPlayerSurfaceContact();
    const grounded = Boolean(surfaceContact);

    if (grounded && !this.wasPlayerGrounded) {
      markPlayerLanded(this.playerState);
    }
    this.wasPlayerGrounded = grounded;

    if (!surfaceContact) {
      this.hasPlayerBeenAirborne = true;
      this.wasPlayerOnForegroundSurface = false;
      this.syncPlayerSprite(time);
      return;
    }

    if (this.hasPlayerBeenAirborne && !this.wasPlayerOnForegroundSurface) {
      this.landingDustEmitter.emitParticleAt(surfaceContact.x, surfaceContact.y);
    }

    this.emitMovementDust(surfaceContact, time);
    this.wasPlayerOnForegroundSurface = true;
    this.syncPlayerSprite(time);
  }
}

function getGameViewportSize() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}

function updateRendererStatus() {
  const devicePixelRatio = window.devicePixelRatio;
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  const screenWidth = Math.round(viewportWidth * devicePixelRatio);
  const screenHeight = Math.round(viewportHeight * devicePixelRatio);
  const logicalWidth = Math.round(screenWidth / TARGET_SCALE);
  const logicalHeight = Math.round(screenHeight / TARGET_SCALE);
  const gridColumns = Math.ceil(game.scale.width / TILE_SIZE);
  const gridRows = Math.ceil(game.scale.height / TILE_SIZE);

  setTilemapStatus(`Tilemap (${TILE_SIZE}x${TILE_SIZE} -> ${gridColumns}x${gridRows})`);
  setRendererStatus(`WebGL (${logicalWidth}x${logicalHeight} -> ${screenWidth}x${screenHeight}px)`);
}

function updateFrameRate() {
  const fps = Math.round(game.loop.actualFps);

  setFrameRate(`FPS (${fps})`);
}

mountPlatformerUi();

const initialGameViewport = getGameViewportSize();

const game = new Phaser.Game({
  type: Phaser.WEBGL,
  parent: "content_layer",
  backgroundColor: "#0f172a",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
  scene: PlatformerScene,
  scale: {
    mode: Phaser.Scale.NONE,
    width: initialGameViewport.width,
    height: initialGameViewport.height,
    zoom: TARGET_SCALE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    fullscreenTarget: document.body,
  },
});

function resizeGameToViewport() {
  const { width, height } = getGameViewportSize();
  game.scale.resize(width, height);
  updateRendererStatus();
}

window.addEventListener("resize", resizeGameToViewport);
requestAnimationFrame(updateRendererStatus);
window.setInterval(updateFrameRate, 1000);
