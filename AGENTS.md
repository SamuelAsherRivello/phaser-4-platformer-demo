# AI Repository Guidance

## Template use workflow

If user directs you to use this template, then follow these steps:

1. Determine the reuse mode from the request. For a new GitHub repository,
   use GitHub's **Use this template** flow when authorized. For a local project,
   create an authorized copy in its explicitly named destination. When the user
   says to use this repository only as inspiration, inspect it as a reference
   and copy no files unless they request that.
2. Read this file, then read
   `AGENTS_TEMPLATE_USAGE_CHECKLIST.md` before adding a stack or changing
   project files.
3. Confirm the project's purpose, target platforms, selected stack, deployment
   target, dependency policy, and whether an OpenSpec workflow is required. Ask
   only for an input that is material and not provided or discoverable.
4. Keep `phaser4-platformer/` as the Vite application root and keep the GitHub
   repository URL synchronized with the project repository. The repository root
   remains the npm project root.
5. Inspect the resulting project's actual configuration before documenting or
   running setup, test, build, deployment, or release commands. Complete the
   checklist's delivery gate before presenting the project as ready.

## Working directories

- **Repository root** is the npm project root. It contains `.git`, repository
  metadata, package configuration, and project documentation. Run Git,
  dependency, build, test, and run commands there.
- **Application root** is `phaser4-platformer/`. It contains the Vite entry page,
  source, tests, assets, and build output. Keep application implementation
  there unless the selected stack deliberately changes the layout.

Correct: run `git status`, dependency, build, test, and run commands from the
repository root; keep the application's source and tests under
`phaser4-platformer/`.

## Branch workflow

- Always work from the `main` branch unless the user explicitly requests a
  different branch.

## Window behavior

- An agent must use hidden or background execution for every native tool that
  does not require the user to interact with a window. It must not create a
  visible window over the user's workspace for background-capable work.
- If a native application window is unavoidable, the agent must create it at
  the lowest practical non-topmost Windows 11 z-order, as far behind the
  user's existing windows as the platform allows. It must not cover the user's
  work, activate over the user's current window, take keyboard focus, or use
  foreground, topmost, focus-stealing, or equivalent window-promotion behavior.
- The agent owns every native application window it creates for its workflow.
  As soon as it has finished using that window, it must close it promptly and
  must not leave it open in the background. It must never close a user-owned
  window that it did not create.

## UI setting workflow

- Treat the existing upper-right **Camera** and **Tilemap** controls as the
  canonical format for every new UI setting.
- Add the native control to `phaser4-platformer/src/ui.jsx` in
  `.header-actions`, beneath the GitHub link. It must use the
  `<setting>-toggle settings-text-style` class format, `type="button"`,
  `aria-pressed`, and a `Label ✅` / `Label ⬜` state label. Keep the vertical
  upper-right stack and text-only presentation.
- Add matching borderless, pointer-enabled CSS in `src/ui.css`: no appearance,
  border, padding, or background chrome, plus an intentional hover and keyboard
  focus treatment consistent with Camera or Tilemap.
- Put game or persistent preference state in `platformer-ui-bridge.js`, default
  it to off, persist it with the existing HUD-settings storage only when it is a
  saved preference, and apply it in `main.js`. Browser-owned state such as
  Fullscreen stays off by default and must synchronize with its browser change
  event instead. Use Phaser's supported `ScaleManager` fullscreen API through
  the scene first; call the DOM Fullscreen API only when Phaser reports it
  unavailable.
- Extend `phaser4-platformer/test/page.test.mjs` for the setting's initial,
  enabled, and disabled behavior; run the focused test and a real-browser check
  before calling the setting complete.

## OpenSpec compatibility

- Keep `.openspec/` as the canonical, tracked OpenSpec home. Never rename,
  move, duplicate, or manually synchronize it to `openspec/`.
- The installed OpenSpec CLI discovers only a non-hidden `openspec/` directory.
  For each fresh checkout, before the first `openspec` CLI command, run
  `& .\.openspec\setup.ps1` from the repository root. It creates an ignored
  `openspec` junction (or symbolic link outside Windows) that targets the same
  `.openspec` directory.
- If `openspec/` already exists, use it only when it is a link resolving to
  this checkout's `.openspec/`. If it is a real directory or points elsewhere,
  stop and report the conflict; do not overwrite, delete, or merge it.
- Run OpenSpec commands from the repository root only after that compatibility
  link is available. The CLI may refer to paths under `openspec/`; they are the
  same files as `.openspec/`, not a second planning store.
