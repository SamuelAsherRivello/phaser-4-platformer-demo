## Purpose

Protect the user's uninterrupted Windows 11 workspace whenever an agent's
repository workflow causes a native application window to be created.

## Requirements

### Requirement: Non-interactive workflow windows remain out of view
When an agent workflow does not require the user to interact with a native
application window, the workflow SHALL use hidden or background execution and
SHALL NOT create a visible window over the user's workspace.

#### Scenario: Background-capable tool is run
- **WHEN** an agent runs a native tool whose task can complete without user
  interaction
- **THEN** the tool runs hidden or in the background and no new visible window
  covers the user's active work

### Requirement: Unavoidable visible windows start behind user work
When an agent workflow must create a visible native application window, it
SHALL create it at the lowest practical non-topmost Windows 11 z-order behind
the user's existing windows, SHALL leave the user's currently active window
active, and SHALL NOT request keyboard focus or foreground activation.

#### Scenario: Visible native window is unavoidable
- **WHEN** an agent creates a visible native application window for its
  workflow
- **THEN** the new window starts behind the user's open windows without
  covering, activating over, or receiving keyboard focus ahead of the user's
  current window

### Requirement: Workflow launch paths do not promote agent windows
Agent workflow guidance and launch paths SHALL NOT use topmost, foreground,
activation, focus-stealing, or equivalent window-promotion behavior for native
application windows.

#### Scenario: Agent prepares a native-window launch
- **WHEN** an agent selects or documents a launch method for a native
  application window
- **THEN** the method preserves background placement and does not include a
  window-promotion action

### Requirement: Agent-created windows close after workflow use
An agent SHALL close every native application window that it created as soon as
the workflow has finished using that window. The agent SHALL NOT leave a
completed workflow window open in the background and SHALL NOT close a window
that it did not create.

#### Scenario: Workflow finishes using an agent-created window
- **WHEN** an agent has collected the result or completed the interaction for
  an application window it created
- **THEN** the agent closes that window promptly and leaves user-owned windows
  unchanged
