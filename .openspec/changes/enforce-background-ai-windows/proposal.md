## Why

An agent-spawned native window that appears over the user's work is an immediate
interruption. The existing repository guidance says to place windows behind the
user's active windows, but it does not define the default or the required
fallback when a visible window is unavoidable.

## What Changes

- Establish a repository-wide agent window-behavior contract for native Windows
  11 application windows opened during an AI workflow.
- Require hidden or background execution whenever user interaction is not
  needed.
- Require any unavoidable visible window to start at the lowest practical
  non-topmost z-order behind the user's existing windows, without activation or
  keyboard-focus theft.
- Define a verification checklist that prevents foreground, topmost, or
  focus-stealing launch paths from being used by future workflow instructions.

## Capabilities

### New Capabilities

- `ai-native-window-behavior`: Controls how agent workflow windows are launched
  on Windows 11 so they do not cover or interrupt the user's active work.

### Modified Capabilities

- None.

## Impact

- Affected guidance: `AGENTS.md`.
- Affected systems: any future agent workflow that opens a native application
  window from this repository.
- No browser-game behavior, runtime API, dependency, or deployment changes.
