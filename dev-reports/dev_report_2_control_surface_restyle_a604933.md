# Development Report: Control Surface (Slate) Restyle

**Commit:** a604933
**Phase:** Rebrand
**Breakthrough:** no

## Objective

Implement the Claude Design handoff in `handoffs/design_handoff_control_surface/`: a visual-only restyle of Search to the Control Surface (Slate) direction, in light and dark mode.

## Summary

Replaced the stock-Mantine/Satoshi look with the handoff's depth model (raised = idle, latched = on, well = recessed). The theme source is now committed in `src/theme/` instead of importing the gitignored `theme/dist/mantine.js`. Every component was restyled through CSS modules backed by the `--sc-*` tokens. Layout, copy (except the planned chat panel) and behavior are unchanged. Checked on `/` and `/components` in both color schemes; `npm run build` passes. Snapshot `v6-pre-rebrand` marks the state before the restyle.

## Changes Made

| File | Change |
|---|---|
| `src/theme/theme.ts` | New Mantine theme: signal/slate/dark/include/exclude scales, Chivo fonts, radius, token shadows, kept custom scales (spacing, fontWeights, iconSizes…) |
| `src/theme/tokens.css` | Semantic tokens for light and dark (copied from the handoff) |
| `src/theme/controls.module.css` | `key` / `latched` / `accent` / `danger` variants for Button and ActionIcon; well treatment for inputs |
| `src/theme/mantine.d.ts` | Module augmentation for the custom theme properties |
| `src/main.tsx`, `src/global.css`, `index.html` | New theme and tokens, `IconContext` bold, `defaultColorScheme="auto"`, body on `--sc-bg`, Chivo / Chivo Mono from Google Fonts, Satoshi `@font-face` removed |
| `SearchInterface` (+ module CSS) | Panel, well input, funnel key states, split `FilterChip` with `data-state`, raised/latched sort split key, category tabs on the panel, engraved divider, panel tags with + / ! icons |
| `SearchResult`, `DataLine` (+ module CSS) | Borderless card, hover lift, latched ⋮ while its menu is open, well badges and type tile, initials avatar for "Updated by" |
| `Menu` (+ CSS) | Token dropdown and items, well-sm hover, caret on submenus, new `onChange` prop for open state |
| `TypeIcon` | Ink color, `artifact` → `DiamondIcon` |
| `ChatPanel` (+ module CSS) | Restyled per spec: status, user/assistant bubbles, well composer, accent send key |
| `App.tsx`, `Components.tsx` | Loader and empty state, gallery restyled, chat panel specimen added |

## Issues Resolved

1. **Theme source missing from the repo.** `theme/dist/mantine.js` was gitignored, so a clean clone couldn't build. The theme now lives in `src/theme/`.
2. **Filter state shown by color alone.** Panel tags now show the + / ! icons, matching the chips.
3. **`artifact` type fell back to a question mark.** It now has its own icon.
4. **Build failed on unused imports** (`Title` in App, `Text` in DataLine). Both removed.

## Next Steps

- Open question: decide on the category "has filters" marker (6px dot or a count).
- Replace the "K" logo and favicon left over from the base template.
- Fix the nested `<button>` (the card is an `UnstyledButton` that contains the ⋮ and link buttons). This bug predates the restyle.
- Wire `ChatPanel` into `App`; the assistant mini filter chips need structured filter data from `useChat`.
- Clean up the unused `theme/` gitlink and `public/fonts/` (Satoshi, JetBrains Mono).
