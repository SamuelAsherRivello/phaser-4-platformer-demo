import * as Phaser from "phaser";
import levelMapUrl from "../assets/maps/treasure-hunters-level.json?url";
import moveJoystickBackgroundUrl from "../assets/images/SimpleMobileJoystick/Move Joystick Background.png?url";
import moveJoystickHandleUrl from "../assets/images/SimpleMobileJoystick/Move Joystick Handle.png?url";
import aimJoystickBackgroundUrl from "../assets/images/SimpleMobileJoystick/Aim Joystick Background.png?url";
import aimJoystickHandleUrl from "../assets/images/SimpleMobileJoystick/Aim Joystick Handle.png?url";
import joystickBackgroundUrl from "../assets/images/SimpleMobileJoystick/Joystick Background.png?url";
import joystickHandleUrl from "../assets/images/SimpleMobileJoystick/Joystick Handle.png?url";
import palmTerrainUrl from "../assets/images/TreasureHunters/Palm Tree Island/Sprites/Terrain/Terrain (32x32).png?url";
import cloudUrl from "../assets/images/TreasureHunters/Palm Tree Island/Sprites/Background/Big Clouds.png?url";
import pirateTerrainUrl from "../assets/images/TreasureHunters/Pirate Ship/Sprites/Tilesets/Terrain and Back Wall (32x32).png?url";
import piratePlatformsUrl from "../assets/images/TreasureHunters/Pirate Ship/Sprites/Tilesets/Platforms (32x32).png?url";

const TILE_SIZE = 32;
const LOGICAL_WIDTH = 320;
const LOGICAL_HEIGHT = 180;
const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;
const TARGET_SCALE = 4;
const JOYSTICK_SIZE = 34;
const JOYSTICK_HANDLE_SIZE = 18;
const ACTION_BUTTON_SIZE = 24;
const ACTION_HANDLE_SIZE = 14;
const PLAYER_SIZE = 14;
const PLAYER_SPEED = 120;
const JUMP_SPEED = 270;
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
    this.load.image("move-joystick-background", moveJoystickBackgroundUrl);
    this.load.image("move-joystick-handle", moveJoystickHandleUrl);
    this.load.image("aim-joystick-background", aimJoystickBackgroundUrl);
    this.load.image("aim-joystick-handle", aimJoystickHandleUrl);
    this.load.image("joystick-background", joystickBackgroundUrl);
    this.load.image("joystick-handle", joystickHandleUrl);
  }

  create() {
    this.joystickMovement = 0;
    this.activeJoystick = null;
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      actionOne: Phaser.Input.Keyboard.KeyCodes.C,
      actionTwo: Phaser.Input.Keyboard.KeyCodes.V,
    });

    this.createLevel();

    this.player = this.add.rectangle(112, 16, PLAYER_SIZE, PLAYER_SIZE, 0x38bdf8);
    this.player.setName("player");
    this.player.setStrokeStyle(1, 0xf8fafc, 0.8);
    this.player.setDepth(3);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.foregroundLayer);

    this.createControls();
    this.layout();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.layout, this);

    this.input.keyboard.on("keydown-C", () => {
      this.actionOneButton.press();
      this.jumpPlayer();
    });
    this.input.keyboard.on("keyup-C", () => this.actionOneButton.release());
    this.input.keyboard.on("keydown-V", () => {
      this.actionTwoButton.press();
      this.attackPlayer();
    });
    this.input.keyboard.on("keyup-V", () => this.actionTwoButton.release());
  }

  createLevel() {
    this.decorLayer = this.add.spriteGPULayer("clouds", 3);
    this.decorLayer.addMember({ x: 68, y: 18, scaleX: 0.38, scaleY: 0.38, alpha: 0.4 });
    this.decorLayer.addMember({ x: 248, y: 28, scaleX: 0.28, scaleY: 0.28, alpha: 0.3 });
    this.decorLayer.setDepth(-1);

    const map = this.make.tilemap({ key: "treasure-hunters-level" });
    const pirateTerrain = map.addTilesetImage("Pirate Ship Terrain", "pirate-terrain", TILE_SIZE, TILE_SIZE);
    const piratePlatforms = map.addTilesetImage("Pirate Ship Platforms", "pirate-platforms", TILE_SIZE, TILE_SIZE);

    this.backgroundLayer = map.createLayer("Background", pirateTerrain, 0, 0, true);
    this.foregroundLayer = map.createLayer("Foreground", piratePlatforms, 0, 0, true);
    this.backgroundLayer.setDepth(0);
    this.foregroundLayer.setDepth(1);
    this.foregroundLayer.setCollisionByExclusion([-1], true);
  }

  createControls() {
    this.moveJoystick = this.createJoystick({
      backgroundKey: "move-joystick-background",
      handleKey: "move-joystick-handle",
      onMove: (horizontal) => {
        this.joystickMovement = horizontal;
      },
      onRelease: () => {
        this.joystickMovement = 0;
      },
      label: "Move (A/D)",
    });
    this.actionOneButton = this.createActionButton(1, "Action 1 (C)", "joystick-background", "joystick-handle");
    this.actionTwoButton = this.createActionButton(2, "Action 2 (V)", "aim-joystick-background", "aim-joystick-handle");

    this.input.on("pointermove", (pointer) => this.activeJoystick?.move(pointer));
    this.input.on("pointerup", () => this.releaseActiveJoystick());
  }

  createJoystick({ backgroundKey, handleKey, onMove, onRelease = () => {}, label }) {
    const background = this.add
      .image(0, 0, backgroundKey)
      .setDisplaySize(JOYSTICK_SIZE, JOYSTICK_SIZE)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);
    const handle = this.add
      .image(0, 0, handleKey)
      .setDisplaySize(JOYSTICK_HANDLE_SIZE, JOYSTICK_HANDLE_SIZE)
      .setDepth(11);
    const labelText = this.createControlLabel(label);
    const maxDistance = (JOYSTICK_SIZE - JOYSTICK_HANDLE_SIZE) / 2;
    const setVisualInput = (inputX) => {
      const x = Phaser.Math.Clamp(inputX, -1, 1);

      handle.setPosition(background.x + x * maxDistance, background.y);
    };
    const joystick = {
      background,
      handle,
      setVisualInput,
      move: (pointer) => {
        const horizontal = Phaser.Math.Clamp((pointer.x - background.x) / maxDistance, -1, 1);

        setVisualInput(horizontal);
        onMove(horizontal);
      },
      release: () => {
        setVisualInput(0);
        onRelease();
      },
      setPosition: (x, y) => {
        background.setPosition(x, y);
        handle.setPosition(x, y);
        labelText.setPosition(x, y + JOYSTICK_SIZE / 2 + 3);
      },
    };

    background.on("pointerdown", (pointer) => {
      this.releaseActiveJoystick();
      this.activeJoystick = joystick;
      joystick.move(pointer);
    });
    return joystick;
  }

  createActionButton(number, label, backgroundKey, handleKey) {
    const background = this.add
      .image(0, 0, backgroundKey)
      .setDisplaySize(ACTION_BUTTON_SIZE, ACTION_BUTTON_SIZE)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);
    const handle = this.add
      .image(0, 0, handleKey)
      .setDisplaySize(ACTION_HANDLE_SIZE, ACTION_HANDLE_SIZE)
      .setDepth(11);
    const labelText = this.createControlLabel(label);
    const press = () => handle.setDisplaySize(ACTION_HANDLE_SIZE * 0.85, ACTION_HANDLE_SIZE * 0.85);
    const release = () => handle.setDisplaySize(ACTION_HANDLE_SIZE, ACTION_HANDLE_SIZE);
    const button = {
      press,
      release,
      setPosition: (x, y) => {
        background.setPosition(x, y);
        handle.setPosition(x, y);
        labelText.setPosition(x, y + ACTION_BUTTON_SIZE / 2 + 3);
      },
    };

    background.on("pointerdown", () => {
      button.press();
      if (number === 1) {
        this.jumpPlayer();
      } else {
        this.attackPlayer();
      }
    });
    background.on("pointerup", () => button.release());
    background.on("pointerout", () => button.release());

    return button;
  }

  createControlLabel(text) {
    return this.add
      .text(0, 0, text, {
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
        fontSize: "5px",
        fontStyle: "bold",
      })
      .setDepth(12)
      .setOrigin(0.5);
  }

  releaseActiveJoystick() {
    this.activeJoystick?.release();
    this.activeJoystick = null;
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
    this.physics.world.setBounds(0, 0, width, this.virtualControllerArea.top);

    const controllerCenterY = this.virtualControllerArea.centerY;
    const moveX = this.virtualControllerArea.left + JOYSTICK_SIZE / 2;
    const actionTwoX = this.virtualControllerArea.right - ACTION_BUTTON_SIZE / 2;
    const actionOneX = actionTwoX - ACTION_BUTTON_SIZE - 6;

    this.moveJoystick.setPosition(moveX, controllerCenterY);
    this.actionOneButton.setPosition(actionOneX, controllerCenterY);
    this.actionTwoButton.setPosition(actionTwoX, controllerCenterY);
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
    const keyboardHorizontal = Number(this.keys.right.isDown || this.keys.d.isDown) - Number(this.keys.left.isDown || this.keys.a.isDown);
    if (this.activeJoystick !== this.moveJoystick) {
      this.moveJoystick.setVisualInput(keyboardHorizontal, 0);
    }

    const horizontal = Phaser.Math.Clamp(keyboardHorizontal + this.joystickMovement, -1, 1);
    this.player.body.setVelocityX(horizontal * PLAYER_SPEED);
  }
}

const rendererStatus = document.getElementById("renderer_status");
const fpsStatus = document.getElementById("fps_status");

function updateRendererStatus() {
  const canvas = document.querySelector("#content_layer canvas");
  const presentationWidth = Math.round(canvas?.clientWidth ?? TARGET_WIDTH);
  const presentationHeight = Math.round(canvas?.clientHeight ?? TARGET_HEIGHT);

  rendererStatus.textContent = `WebGL (${LOGICAL_WIDTH}x${LOGICAL_HEIGHT} -> ${presentationWidth}x${presentationHeight})`;
}

function updateFrameRate() {
  const fps = Math.round(game.loop.actualFps);

  fpsStatus.textContent = `FPS (${fps})`;
}

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
    mode: Phaser.Scale.FIT,
    width: LOGICAL_WIDTH,
    height: LOGICAL_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});

window.addEventListener("resize", updateRendererStatus);
requestAnimationFrame(updateRendererStatus);
window.setInterval(updateFrameRate, 1000);
