## 1. Regression contract

- [x] 1.1 Replace the focused source assertions with checks for the yellow-box
  guide-aligned Move/action sizes, labels, spacing, controller-layout extent,
  and matching Phaser exclusion-zone values; run `npm test` and verify the
  assertion fails before the production resize is made.

## 2. Enlarged controller implementation

- [x] 2.1 Update the virtual-controller CSS so Move and Action controls plus
  labels fill their respective yellow guide envelopes while preserving the
  safe-edge flex layout; verify the focused controller test passes.
- [x] 2.2 Update the Phaser controller-zone ratio and minimum height to match
  the guide-aligned controller layout; verify the focused controller test
  passes and the zone continues to recalculate on layout.

## 3. Integration validation

- [x] 3.1 Run `npm test` and `npm run build` from the repository root and
  verify both succeed.
- [x] 3.2 Run the Vite app in a real browser at desktop and narrow touch-sized
  viewports; verify all three controls occupy their guide-aligned envelopes,
  remain bottom-aligned, and respond to pointer interaction.
