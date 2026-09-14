import * as Phaser from "phaser";
import levelMapUrl from "../assets/maps/foozle-lab-level.json?url";
import foozleLabStructureUrl from "../assets/images/FoozleLab/Tileset/level_tileset.png?url";
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
import { mountPlatformerUi } from "./ui.jsx";

const TILE_SIZE = 32;
const LOGICAL_WIDTH = 81 * TILE_SIZE;
const LOGICAL_HEIGHT = 51 * TILE_SIZE;
const TARGET_SCALE = 1;
const PLAYER_WIDTH = TILE_SIZE;
const PLAYER_HEIGHT = 2 * TILE_SIZE;
const PLAYER_SPEED = 120;
const BASE_JUMP_SPEED = 270;
const JUMP_HEIGHT_MULTIPLIER = 2;
const JUMP_SPEED = BASE_JUMP_SPEED * Math.sqrt(JUMP_HEIGHT_MULTIPLIER);
const PLAYER_SURFACE_DUST_TEXTURE = "player-surface-dust";
const MOVEMENT_DUST_INTERVAL = 70;
const MOVEMENT_DUST_TRAIL_OFFSET = 4;
const ACTION_ONE_SOUND_KEY = "action-one-sound";
const ACTION_TWO_SOUND_KEY = "action-two-sound";
const UI_SAFE_AREA_RATIO = 0.05;
const VIRTUAL_CONTROLLER_ZONE_HEIGHT_RATIO = 0.3;
const VIRTUAL_CONTROLLER_ZONE_MIN_HEIGHT = 90;

class PlatformerScene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON("foozle-lab-level", levelMapUrl);
    this.load.image("foozle-lab-structure", foozleLabStructureUrl);
    this.load.audio(ACTION_ONE_SOUND_KEY, attackSoundUrl);
    this.load.audio(ACTION_TWO_SOUND_KEY, arrowSoundUrl);
  }

  create() {
    this.createLevel();
    const playerSpawn = this.getPlayerSpawn();

    this.player = this.add.rectangle(playerSpawn.x, playerSpawn.y, PLAYER_WIDTH, PLAYER_HEIGHT, 0x38bdf8);
    this.player.setName("player");
    this.player.setStrokeStyle(1, 0xf8fafc, 0.8);
    this.player.setDepth(3);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.midground1Layer);
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

  createLevel() {
    this.map = this.make.tilemap({ key: "foozle-lab-level" });
    const foozleLabStructure = this.map.addTilesetImage("FoozleLab Structure", "foozle-lab-structure", TILE_SIZE, TILE_SIZE);

    this.backgroundLayer = this.map.createLayer("Background", foozleLabStructure, 0, 0, true);
    this.midground1Layer = this.map.createLayer("Midground1", foozleLabStructure, 0, 0, true);
    this.midground2Layer = this.map.createLayer("Midground2", foozleLabStructure, 0, 0, true);
    this.foregroundLayer = this.map.createLayer("Foreground", foozleLabStructure, 0, 0, true);
    this.backgroundLayer.setDepth(0);
    this.midground1Layer.setDepth(1);
    this.midground2Layer.setDepth(2);
    this.foregroundLayer.setDepth(4);
    this.midground1Layer.setCollisionByExclusion([-1], true);
    this.tilemapDebugGraphics = this.add.graphics();
    this.tilemapDebugGraphics.setDepth(2);
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
      scale: { start: 1, end: 0.35 },
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
      scale: { start: 2.25, end: 0.55 },
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

  applyUiState({ tilemapDebugEnabled, cameraDebugEnabled }) {
    this.renderTilemapDebug(tilemapDebugEnabled);
    this.renderCameraDeadzoneDebug(cameraDebugEnabled);
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
    const controllerZoneHeight = Math.max(VIRTUAL_CONTROLLER_ZONE_MIN_HEIGHT, height * VIRTUAL_CONTROLLER_ZONE_HEIGHT_RATIO);

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
    this.sound.play(ACTION_ONE_SOUND_KEY);
    if (this.player.body.blocked.down || this.player.body.touching.down) {
      this.player.body.setVelocityY(-JUMP_SPEED);
    }
  }

  attackPlayer() {
    this.sound.play(ACTION_TWO_SOUND_KEY);
    this.tweens.killTweensOf(this.player);
    this.player.setAlpha(1);
    this.tweens.add({
      targets: this.player,
      alpha: { from: 0.2, to: 1 },
      duration: 70,
      yoyo: true,
      repeat: 3,
      onComplete: () => this.player.setAlpha(1),
    });
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

  update(time) {
    this.player.body.setVelocityX(getHorizontalInput() * PLAYER_SPEED);
    const surfaceContact = this.getPlayerSurfaceContact();

    if (!surfaceContact) {
      this.hasPlayerBeenAirborne = true;
      this.wasPlayerOnForegroundSurface = false;
      return;
    }

    if (this.hasPlayerBeenAirborne && !this.wasPlayerOnForegroundSurface) {
      this.landingDustEmitter.emitParticleAt(surfaceContact.x, surfaceContact.y);
    }

    this.emitMovementDust(surfaceContact, time);
    this.wasPlayerOnForegroundSurface = true;
  }
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
    width: LOGICAL_WIDTH,
    height: LOGICAL_HEIGHT,
    zoom: TARGET_SCALE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    fullscreenTarget: document.body,
  },
});

window.addEventListener("resize", updateRendererStatus);
requestAnimationFrame(updateRendererStatus);
window.setInterval(updateFrameRate, 1000);
