const HUD_SETTINGS_STORAGE_KEY = "phaser4-platformer.hud-settings.v1";

function readHudSettings() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem(HUD_SETTINGS_STORAGE_KEY) ?? "{}");
    return {
      tilemapDebugEnabled: Boolean(savedSettings.tilemapDebugEnabled),
      cameraDebugEnabled: Boolean(savedSettings.cameraDebugEnabled),
      screenDebugEnabled: Boolean(savedSettings.screenDebugEnabled),
    };
  } catch {
    return { tilemapDebugEnabled: false, cameraDebugEnabled: false, screenDebugEnabled: false };
  }
}

const hudSettings = readHudSettings();

const uiState = {
  horizontalInput: 0,
  actionOnePressed: false,
  actionTwoPressed: false,
  tilemapStatus: "Tilemap",
  rendererStatus: "WebGL",
  frameRate: "FPS (0)",
  tilemapDebugEnabled: hudSettings.tilemapDebugEnabled,
  cameraDebugEnabled: hudSettings.cameraDebugEnabled,
  screenDebugEnabled: hudSettings.screenDebugEnabled,
};

const subscribers = new Set();
let platformerActions = { jump: () => {}, attack: () => {}, toggleFullscreen: () => false };

function publish() {
  const snapshot = { ...uiState };
  subscribers.forEach((subscriber) => subscriber(snapshot));
}

function persistHudSettings() {
  try {
    localStorage.setItem(HUD_SETTINGS_STORAGE_KEY, JSON.stringify({
      tilemapDebugEnabled: uiState.tilemapDebugEnabled,
      cameraDebugEnabled: uiState.cameraDebugEnabled,
      screenDebugEnabled: uiState.screenDebugEnabled,
    }));
  } catch {
    // Browser storage can be unavailable in private or restricted contexts.
  }
}

export function getUiState() {
  return { ...uiState };
}

export function subscribeUiState(subscriber) {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
}

export function setHorizontalInput(value) {
  const horizontalInput = Math.max(-1, Math.min(1, value));
  if (uiState.horizontalInput !== horizontalInput) {
    uiState.horizontalInput = horizontalInput;
    publish();
  }
}

export function getHorizontalInput() {
  return uiState.horizontalInput;
}

export function setActionPressed(action, pressed) {
  const key = action === "actionOne" ? "actionOnePressed" : "actionTwoPressed";
  if (uiState[key] === pressed) {
    return;
  }
  uiState[key] = pressed;
  publish();
  if (pressed) {
    platformerActions[action === "actionOne" ? "jump" : "attack"]();
  }
}

export function bindPlatformerActions(actions) {
  platformerActions = actions;
  return () => {
    platformerActions = { jump: () => {}, attack: () => {}, toggleFullscreen: () => false };
  };
}

export function toggleFullscreen() {
  return platformerActions.toggleFullscreen();
}

export function setRendererStatus(rendererStatus) {
  if (uiState.rendererStatus !== rendererStatus) {
    uiState.rendererStatus = rendererStatus;
    publish();
  }
}

export function setTilemapStatus(tilemapStatus) {
  if (uiState.tilemapStatus !== tilemapStatus) {
    uiState.tilemapStatus = tilemapStatus;
    publish();
  }
}

export function setFrameRate(frameRate) {
  if (uiState.frameRate !== frameRate) {
    uiState.frameRate = frameRate;
    publish();
  }
}

export function setTilemapDebugEnabled(enabled) {
  const tilemapDebugEnabled = Boolean(enabled);
  if (uiState.tilemapDebugEnabled !== tilemapDebugEnabled) {
    uiState.tilemapDebugEnabled = tilemapDebugEnabled;
    persistHudSettings();
    publish();
  }
}

export function setCameraDebugEnabled(enabled) {
  const cameraDebugEnabled = Boolean(enabled);
  if (uiState.cameraDebugEnabled !== cameraDebugEnabled) {
    uiState.cameraDebugEnabled = cameraDebugEnabled;
    persistHudSettings();
    publish();
  }
}

export function setScreenDebugEnabled(enabled) {
  const screenDebugEnabled = Boolean(enabled);
  if (uiState.screenDebugEnabled !== screenDebugEnabled) {
    uiState.screenDebugEnabled = screenDebugEnabled;
    persistHudSettings();
    publish();
  }
}
