## 1. Repository Policy

- [ ] 1.1 Expand the `AGENTS.md` **Window behavior** guidance to require hidden or background execution when no user interaction is needed, and verify the completed text explicitly preserves that default.
- [ ] 1.2 Define the unavoidable-visible-window fallback in `AGENTS.md`: lowest practical non-topmost Windows 11 z-order behind existing user windows, no activation, and no keyboard-focus transfer; verify each constraint is present.
- [ ] 1.3 Prohibit foreground, topmost, focus-stealing, and equivalent window-promotion launch behavior in `AGENTS.md`; verify the policy applies to every agent workflow that opens a native window.

## 2. Validation

- [ ] 2.1 Review the completed `AGENTS.md` policy against the three `ai-native-window-behavior` specification scenarios and verify it does not alter Phaser runtime behavior, dependencies, or user settings.
- [ ] 2.2 Run `openspec validate enforce-background-ai-windows --strict` and `git diff --check`, and verify both report no errors for the completed policy change.
