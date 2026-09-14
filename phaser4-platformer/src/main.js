import * as Phaser from "phaser";
import levelMapUrl from "../assets/maps/treasure-hunters-level.json?url";
import palmTerrainUrl from "../assets/images/TreasureHunters/Palm Tree Island/Sprites/Terrain/Terrain (32x32).png?url";
import cloudUrl from "../assets/images/TreasureHunters/Palm Tree Island/Sprites/Background/Big Clouds.png?url";
import pirateTerrainUrl from "../assets/images/TreasureHunters/Pirate Ship/Sprites/Tilesets/Terrain and Back Wall (32x32).png?url";
import piratePlatformsUrl from "../assets/images/TreasureHunters/Pirate Ship/Sprites/Tilesets/Platforms (32x32).png?url";
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
const LOGICAL_WIDTH = 320;
const LOGICAL_HEIGHT = 180;
const TARGET_SCALE = 1;
const TARGET_WIDTH = LOGICAL_WIDTH * TARGET_SCALE;
const TARGET_HEIGHT = LOGICAL_HEIGHT * TARGET_SCALE;
const PLAYER_WIDTH = 14;
const PLAYER_HEIGHT = 28;
const PLAYER_SPEED = 120;
const BASE_JUMP_SPEED = 270;
const JUMP_HEIGHT_MULTIPLIER = 2;
const JUMP_SPEED = BASE_JUMP_SPEED * Math.sqrt(JUMP_HEIGHT_MULTIPLIER);
const UI_SAFE_AREA_RATIO = 0.05;
const VIRTUAL_CONTROLLER_ZONE_HEIGHT_RATIO = 0.24;
const VIRTUAL_CONTROLLER_ZONE_MIN_HEIGHT = 45;

class PlatformerScene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON("treasure-hunters-level", levelMapUrl);
    this.load.image("palm-terrain", palmTerrainUrl);
    this.load.image("pirate-terrain", pirateTerrainUrl);
    this.load.image("pirate-platforms", piratePlatformsUrl);
    this.load.image("clouds", cloudUrl);
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
    this.physics.add.collider(this.player, this.foregroundLayer);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player, true);
    this.cameraDeadzoneDebugGraphics = this.add.graphics().setScrollFactor(0).setDepth(4);

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
    this.decorLayer = this.add.spriteGPULayer("clouds", 3);
    this.decorLayer.addMember({ x: 68, y: 18, scaleX: 0.38, scaleY: 0.38, alpha: 0.4 });
    this.decorLayer.addMember({ x: 248, y: 28, scaleX: 0.28, scaleY: 0.28, alpha: 0.3 });
    this.decorLayer.setDepth(-1);

    this.map = this.make.tilemap({ key: "treasure-hunters-level" });
    const pirateTerrain = this.map.addTilesetImage("Pirate Ship Terrain", "pirate-terrain", TILE_SIZE, TILE_SIZE);
    const piratePlatforms = this.map.addTilesetImage("Pirate Ship Platforms", "pirate-platforms", TILE_SIZE, TILE_SIZE);

    this.backgroundLayer = this.map.createLayer("Background", pirateTerrain, 0, 0, true);
    this.foregroundLayer = this.map.createLayer("Foreground", piratePlatforms, 0, 0, true);
    this.backgroundLayer.setDepth(0);
    this.foregroundLayer.setDepth(1);
    this.foregroundLayer.setCollisionByExclusion([-1], true);
    this.tilemapDebugGraphics = this.add.graphics();
    this.tilemapDebugGraphics.setDepth(2);
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

    this.tilemapDebugGraphics.lineStyle(1, 0xfacc15, 0.85);
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
    this.cameraDeadzoneDebugGraphics.clear();
    if (!enabled) {
      return;
    }

    this.cameraDeadzoneDebugGraphics.lineStyle(1, 0x22d3ee, 0.95);
    this.cameraDeadzoneDebugGraphics.strokeRect(
      this.cameras.main.width * 0.25,
      this.cameras.main.height * 0.25,
      this.cameras.main.width * 0.5,
      this.cameras.main.height * 0.5,
    );
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
    if (this.player.body.blocked.down || this.player.body.touching.down) {
      this.player.body.setVelocityY(-JUMP_SPEED);
    }
  }

  attackPlayer() {
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

  update() {
    this.player.body.setVelocityX(getHorizontalInput() * PLAYER_SPEED);
  }
}

function updateRendererStatus() {
  const canvas = document.querySelector("#content_layer canvas");
  const logicalWidth = Math.round(game.scale.width);
  const logicalHeight = Math.round(game.scale.height);
  const presentationWidth = Math.round(canvas?.clientWidth ?? TARGET_WIDTH);
  const presentationHeight = Math.round(canvas?.clientHeight ?? TARGET_HEIGHT);
  const visibleRows = Math.ceil(logicalHeight / TILE_SIZE);
  const visibleColumns = Math.ceil(logicalWidth / TILE_SIZE);

  setTilemapStatus(`Tilemap (${TILE_SIZE}x${TILE_SIZE} -> ${visibleColumns}x${visibleRows})`);
  setRendererStatus(`WebGL (${logicalWidth}x${logicalHeight} -> ${presentationWidth}x${presentationHeight})`);
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
