## Context

`AGENTS.md` already prohibits native workflow windows from stealing focus and
asks that they be placed behind the user's active windows. This change turns
that brief direction into an explicit launch policy for Windows 11 workflows.
The policy is repository guidance, not Phaser application behavior.

## Goals / Non-Goals

**Goals:**

- Make hidden or background execution the default for agent-run native tools.
- Define an unambiguous visible-window fallback: lowest practical non-topmost
  z-order, no activation, and no keyboard-focus transfer.
- Give future workflow authors observable conditions they can check before
  opening a native window.

**Non-Goals:**

- Changing the Phaser game, browser UI, Node scripts, or dependencies.
- Guaranteeing control over windows that Windows 11, another application, or
  the user independently raises after launch.
- Bringing an agent-created window forward, even when it needs the user to
  interact with it; the user retains that choice.

## Decisions

### Keep the policy in the repository's agent guidance

The implementation will expand the existing `AGENTS.md` **Window behavior**
section instead of adding an application runtime setting or platform-specific
helper. It is the shared instruction source read before agent workflow actions.

Alternative considered: add a launcher utility now. Rejected because the
repository has no common native-window launcher and the requirement governs
all future agent workflows, including ones that do not use a project script.

### Define a launch priority rather than prescribe one API

The guidance will require this ordering: hidden execution first; background
execution second; and only when a visible native window is unavoidable, launch
without activation and place it at the lowest practical non-topmost z-order.
Future scripts or tools must select their platform-supported mechanism that
honors those outcomes and must not use foreground, topmost, activation, or
focus-request options.

Alternative considered: mandate a particular Windows API or shell command.
Rejected because future tools may be native applications, browsers, terminals,
or tool-managed processes with different supported launch interfaces.

### Verify the policy as guidance, not gameplay behavior

The implementation check will inspect the final `AGENTS.md` language for the
required priority, z-order, and focus constraints. OpenSpec validation and a
whitespace diff check will validate the planning and documentation changes;
browser gameplay checks are not relevant to this policy-only change.

## Risks / Trade-offs

- [Windows and third-party applications can alter z-order after launch] → The
  policy constrains agent-controlled launch behavior and prohibits promotion;
  it does not claim control over later user or operating-system actions.
- [A tool may have no background-capable mode] → The visible-window fallback
  preserves the user's active window and starts the tool at the far back rather
  than silently promoting it.
- [Future authors may mistake minimized for background] → The guidance will
  require no activation and lowest practical z-order in addition to any
  minimized or hidden state.

## Migration Plan

1. Replace the existing single-paragraph window guidance with the detailed
   policy while preserving its current no-focus intent.
2. Inspect the changed guidance against all three specification requirements.
3. Validate the OpenSpec change and the documentation diff.

Rollback: revert only the `AGENTS.md` policy edit if the guidance must be
reworded; no runtime data, dependencies, or user settings migrate.
