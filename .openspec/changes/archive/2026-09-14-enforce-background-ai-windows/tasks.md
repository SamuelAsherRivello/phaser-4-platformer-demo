## 1. Repository Policy

- [x] 1.1 Expand the `AGENTS.md` **Window behavior** guidance to require hidden or background execution when no user interaction is needed, and verify the completed text explicitly preserves that default.
- [x] 1.2 Define the unavoidable-visible-window fallback in `AGENTS.md`: lowest practical non-topmost Windows 11 z-order behind existing user windows, no activation, and no keyboard-focus transfer; verify each constraint is present.
- [x] 1.3 Prohibit foreground, topmost, focus-stealing, and equivalent window-promotion launch behavior in `AGENTS.md`; verify the policy applies to every agent workflow that opens a native window.
- [x] 1.4 Require the creating agent to close every native workflow window promptly after its use ends, without closing user-owned windows; verify both the cleanup and ownership constraints are present.

## 2. Validation

- [x] 2.1 Review the completed `AGENTS.md` policy against all four `ai-native-window-behavior` specification scenarios and verify it does not alter Phaser runtime behavior, dependencies, or user settings.
- [x] 2.2 Run `openspec validate enforce-background-ai-windows --strict` and `git diff --check`, and verify both report no errors for the completed policy change.
