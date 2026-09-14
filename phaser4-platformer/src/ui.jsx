import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import versionText from "../../version.txt?raw";
import moveJoystickBackgroundUrl from "../assets/images/SimpleMobileJoystick/Move Joystick Background.png?url";
import moveJoystickHandleUrl from "../assets/images/SimpleMobileJoystick/Move Joystick Handle.png?url";
import aimJoystickBackgroundUrl from "../assets/images/SimpleMobileJoystick/Aim Joystick Background.png?url";
import aimJoystickHandleUrl from "../assets/images/SimpleMobileJoystick/Aim Joystick Handle.png?url";
import joystickBackgroundUrl from "../assets/images/SimpleMobileJoystick/Joystick Background.png?url";
import joystickHandleUrl from "../assets/images/SimpleMobileJoystick/Joystick Handle.png?url";
import {
  getUiState,
  setActionPressed,
  setCameraDebugEnabled,
  setHorizontalInput,
  setScreenDebugEnabled,
  setTilemapDebugEnabled,
  subscribeUiState,
  toggleFullscreen as togglePlatformerFullscreen,
} from "./platformer-ui-bridge.js";
import "./ui.css";

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const supportedKeys = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "w",
  "W",
  "a",
  "A",
  "s",
  "S",
  "d",
  "D",
  "c",
  "C",
  "v",
  "V",
  " ",
]);

function usePlatformerUiState() {
  const [uiState, setUiState] = useState(getUiState);
  useEffect(() => subscribeUiState(setUiState), []);
  return uiState;
}

function MoveControl({ horizontal, onMove }) {
  const controlRef = useRef(null);
  const updateFromPointer = (event) => {
    const bounds = controlRef.current.getBoundingClientRect();
    const maximumDistance = (bounds.width - bounds.width * (18 / 34)) / 2;
    onMove(clamp((event.clientX - (bounds.left + bounds.width / 2)) / maximumDistance, -1, 1));
  };
  const release = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onMove(0);
  };

  return (
    <div className="virtual-control move-control">
      <button
        ref={controlRef}
        className="control-art move-art"
        type="button"
        aria-label="Move left or right"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event);
        }}
        onPointerMove={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && updateFromPointer(event)}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={() => onMove(0)}
      >
        <img src={moveJoystickBackgroundUrl} alt="" draggable="false" />
        <img className="control-handle move-handle" src={moveJoystickHandleUrl} alt="" draggable="false" style={{ transform: `translateX(${horizontal * 47}%)` }} />
      </button>
      <span>Move (WASD / Arrows)</span>
    </div>
  );
}

function ActionControl({ label, backgroundUrl, handleUrl, pressed, onPressedChange }) {
  const release = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onPressedChange(false);
  };

  return (
    <div className="virtual-control action-control">
      <button
        className="control-art action-art"
        type="button"
        aria-label={label}
        aria-pressed={pressed}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          onPressedChange(true);
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={() => onPressedChange(false)}
        onKeyDown={(event) => (event.key === " " || event.key === "Enter") && onPressedChange(true)}
        onKeyUp={(event) => (event.key === " " || event.key === "Enter") && onPressedChange(false)}
      >
        <img src={backgroundUrl} alt="" draggable="false" />
        <img className={`control-handle ${pressed ? "is-pressed" : ""}`} src={handleUrl} alt="" draggable="false" />
      </button>
      <span>{label}</span>
    </div>
  );
}

function VirtualController() {
  const [touchHorizontal, setTouchHorizontal] = useState(0);
  const [touchActions, setTouchActions] = useState({ actionOne: false, actionTwo: false });
  const [keyVersion, setKeyVersion] = useState(0);
  const pressedKeys = useRef(new Set());
  const uiState = usePlatformerUiState();
  const keyboard = useMemo(() => {
    const keys = pressedKeys.current;
    return {
      horizontal: Number(keys.has("ArrowRight") || keys.has("d") || keys.has("D")) - Number(keys.has("ArrowLeft") || keys.has("a") || keys.has("A")),
      actionOne: keys.has("c") || keys.has("C") || keys.has(" "),
      actionTwo: keys.has("v") || keys.has("V"),
    };
  }, [keyVersion]);

  useEffect(() => {
    setHorizontalInput(clamp(keyboard.horizontal + touchHorizontal, -1, 1));
  }, [keyboard.horizontal, touchHorizontal]);
  useEffect(() => {
    setActionPressed("actionOne", keyboard.actionOne || touchActions.actionOne);
  }, [keyboard.actionOne, touchActions.actionOne]);
  useEffect(() => {
    setActionPressed("actionTwo", keyboard.actionTwo || touchActions.actionTwo);
  }, [keyboard.actionTwo, touchActions.actionTwo]);

  useEffect(() => {
    const updateKeys = (event, pressed) => {
      if (!supportedKeys.has(event.key)) {
        return;
      }
      if (event.key.startsWith("Arrow") || event.key === " ") {
        event.preventDefault();
      }
      const nextKeys = new Set(pressedKeys.current);
      if (pressed) nextKeys.add(event.key);
      else nextKeys.delete(event.key);
      pressedKeys.current = nextKeys;
      setKeyVersion((version) => version + 1);
    };
    const onKeyDown = (event) => updateKeys(event, true);
    const onKeyUp = (event) => updateKeys(event, false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      setHorizontalInput(0);
      setActionPressed("actionOne", false);
      setActionPressed("actionTwo", false);
    };
  }, []);

  return (
    <section className="virtual-controller" aria-label="Platformer controls">
      <MoveControl horizontal={uiState.horizontalInput} onMove={setTouchHorizontal} />
      <div className="action-controls">
        <ActionControl label="Action 1 (C)" backgroundUrl={joystickBackgroundUrl} handleUrl={joystickHandleUrl} pressed={uiState.actionOnePressed} onPressedChange={(pressed) => setTouchActions((actions) => ({ ...actions, actionOne: pressed }))} />
        <ActionControl label="Action 2 (V)" backgroundUrl={aimJoystickBackgroundUrl} handleUrl={aimJoystickHandleUrl} pressed={uiState.actionTwoPressed} onPressedChange={(pressed) => setTouchActions((actions) => ({ ...actions, actionTwo: pressed }))} />
      </div>
    </section>
  );
}

function ScreenDebugOutlines() {
  return (
    <>
      <div className="screen-debug-viewport" aria-hidden="true" />
      <div className="screen-debug-ui-outline" aria-hidden="true" />
    </>
  );
}

function PlatformerUi() {
  const uiState = usePlatformerUiState();
  const [fullscreenEnabled, setFullscreenEnabled] = useState(false);

  useEffect(() => {
    const syncFullscreenState = () => setFullscreenEnabled(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", syncFullscreenState);
    syncFullscreenState();
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  const toggleFullscreen = async () => {
    const handledByPhaser = togglePlatformerFullscreen();
    if (handledByPhaser) {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen is browser-controlled and may be unavailable in an embedded view.
      setFullscreenEnabled(document.fullscreenElement !== null);
    }
  };

  return (
    <div className="ui-shell">
      {uiState.screenDebugEnabled && <ScreenDebugOutlines />}
      <header id="header">
        <div id="project_title">
          <span>Phaser 4 Platformer</span>
          <span id="renderer_status" aria-live="polite">{uiState.rendererStatus}</span>
          <span id="tilemap_status" aria-live="polite">{uiState.tilemapStatus}</span>
          <span id="fps_status">{uiState.frameRate}</span>
        </div>
        <div className="header-actions">
          <a href="https://github.com/SamuelAsherRivello/phaser-4-platformer-demo" target="_blank" rel="noopener noreferrer" aria-label="View the repository on GitHub">
            <svg aria-hidden="true" viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.4 0-.2-.01-.86-.01-1.56-2.01.38-2.53-.5-2.69-.96-.09-.24-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.91-3.64-4.04 0-.89.31-1.62.82-2.19-.08-.2-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.82c.68 0 1.36.09 2 .28 1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.96.08 2.16.51.57.82 1.29.82 2.19 0 3.14-1.87 3.83-3.65 4.04.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .22.15.48.55.4A8.02 8.02 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z" /></svg>
          </a>
          <button
            className="camera-debug-toggle settings-text-style"
            type="button"
            aria-pressed={uiState.cameraDebugEnabled}
            onClick={() => setCameraDebugEnabled(!uiState.cameraDebugEnabled)}
          >
            Camera {uiState.cameraDebugEnabled ? "✅" : "⬜"}
          </button>
          <button
            className="tilemap-debug-toggle settings-text-style"
            type="button"
            aria-pressed={uiState.tilemapDebugEnabled}
            onClick={() => setTilemapDebugEnabled(!uiState.tilemapDebugEnabled)}
          >
            Tilemap {uiState.tilemapDebugEnabled ? "✅" : "⬜"}
          </button>
          <button
            className="screen-debug-toggle settings-text-style"
            type="button"
            aria-pressed={uiState.screenDebugEnabled}
            onClick={() => setScreenDebugEnabled(!uiState.screenDebugEnabled)}
          >
            Screen {uiState.screenDebugEnabled ? "✅" : "⬜"}
          </button>
          <button
            className="fullscreen-toggle settings-text-style"
            type="button"
            aria-pressed={fullscreenEnabled}
            onClick={toggleFullscreen}
          >
            Fullscreen {fullscreenEnabled ? "✅" : "⬜"}
          </button>
        </div>
      </header>
      <main id="body"><VirtualController /></main>
      <footer id="footer"><span>{versionText.trim().replace(/^version=/, "")}</span></footer>
    </div>
  );
}

export function mountPlatformerUi() {
  createRoot(document.getElementById("ui_root")).render(<PlatformerUi />);
}
