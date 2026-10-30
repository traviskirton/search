# Development Report: tokens.css as the Single Source of Design Values

**Commit:** 5e4d46f
**Phase:** Design system / Theming
**Breakthrough:** no

## Objective

Move every hard-coded design value in the search prototype into `src/theme/tokens.css`, so that `theme.ts`, the CSS modules and the TSX only reference it. Nothing should look different, and a pixel diff has to show that.

## Summary

`tokens.css` now has three tiers:

1. Primitives: palette ramps, plus scales for type, space, radius, border, icon size, control height and motion.
2. Semantic colour and depth, for light and dark.
3. Per-component measures.

Every value in `theme.ts` is now a `var(--sc-*)`: the colour ramps come from a `ramp()` helper and `autoContrast` is gone. The CSS modules read tokens for every size, space, radius, font, tracking, duration and colour. The TSX no longer passes icon sizes, ActionIcon sizes and radii, the tabs' scrollbar size or the grid's measures; CSS sets them from tokens.

Verification used a Python Playwright script that captures 20 frames per run: light and dark, 1440×1000 at 2× scale. The frames cover the empty page, results, filters with plain/+/! chips, Option held over the funnel, the sort menu, a card's ⋮ menu, link hover, the keyboard focus ring and `/components`. Two runs of the unchanged app matched exactly. After each step (theme, modules, TSX) the diff against the baseline was **0 changed pixels**. Production builds were also diffed, the old tag against the new tree (16 frames, no gallery): 0 changed pixels.

The portfolio's search-prototype `#m-theme` pop-up quotes these files verbatim. Its excerpts were re-copied and pass a new excerpt check (portfolio `3868c83`).

## Changes Made

| File | Change |
|---|---|
| `src/theme/tokens.css` | Rewritten in three tiers: primitives, semantic (light/dark plus scheme-free roles like `--sc-border-hair`, `--sc-on-danger`, `--sc-key-danger`, focus ring, disabled opacity), components (panel, input, ribbon, chip, sort, tabs, tags, card, badge, type tile, avatar, menu, chat) |
| `src/theme/theme.ts` | `v()` and `ramp()` helpers; every value is a `var()`; `autoContrast` dropped; breakpoints stay literal, with a comment |
| `src/theme/mantine.d.ts` | `fontWeights` typed as `string` |
| `src/theme/controls.module.css`, `SearchInterface.module.css`, `SearchResult.module.css`, `ChatPanel.module.css`, `Menu.css` | Raw values replaced with tokens; icon sizes set on `svg` in CSS; ActionIcon `--ai-size` / `--ai-radius` set by class |
| `src/App.module.css` (new) | Results grid from card tokens |
| `src/components/TypeIcon/TypeIcon.module.css` (new) | TypeIcon's default size from `--sc-type-icon` |
| `SearchInterface.tsx`, `SearchResult.tsx`, `DataLine.tsx`, `Menu.tsx`, `ChatPanel.tsx`, `TypeIcon.tsx`, `App.tsx` | Size, radius and `scrollbarSize` props removed; `StateIcon` sized by its chip or tag through `--state-icon` |
| `README.md` | New "Tokens" section |
| `.snapshots/versions` | Snapshot `v7-pre-tokens` |

Commits: `8338ab8` (snapshot), `0a7d2d4` (tokens + theme), `e0218dc` (modules), `4575667` (TSX), `ff37aa6` (README).

## Issues Resolved

1. **Results only appear after a search or filter.** The capture script types "star" and then blurs the input. Playwright hides the caret by default, so the frames stay deterministic.
2. **The ⋮ key is really 24×28.** The old `.dots` rule set width, height and min-width to 24px, but Mantine's `min-height: var(--ai-size)` (28px) still applied. Moving the size into `--ai-size` would have made it 24×24 and shifted the title row. The explicit width/height/min-width rule was kept, now on tokens, so the layout is identical. Whether 24×28 was intended is still open.
3. **Phosphor sizes icons with SVG attributes, which can't take `var()`.** The size props were removed and each parent module sizes its `svg`. CSS width and height override the attributes.
4. **Mantine sets ActionIcon and ScrollArea sizes as inline CSS vars when the prop is passed.** The props were removed and the vars are set by class. The class selector is doubled (`.funnel.funnel`) so it wins regardless of CSS order in the production bundle.
5. **TypeIcon's default would have overridden the gallery's explicit `size={20}`.** The default class now applies only when no size is passed. Inside a type tile, `.typeTile svg` (higher specificity) sets 13px.
6. **Dropping `autoContrast` flips `--mantine-primary-color-contrast` from black to white.** No Mantine CSS the app renders reads it; the diffs confirm this.
7. **Interactive states have no pixel coverage for the tabs' 4px scrollbar at 1440px.** It was checked by computed style at 600px instead: 528×4 before and after. The funnel (34×34), send button (40×40, radius 9px), link icon button (22×22), ⋮ key (24×28) and tile icon (13×13) also match before and after.

## Next Steps

- Decide whether the ⋮ key should be 24×24, which means setting `--ai-size` and accepting a small layout change.
- The theme pop-up still shows only the semantic tier. A row for primitives or component tokens could show the new structure.
- `postcss.config.cjs` still has Mantine's template breakpoints (36em…88em), and they differ from `theme.ts`'s. Neither is used today.
- Lint has one warning: `TypeIcon.tsx` exports `entityTypes` alongside a component (react-refresh). It predates this change.
- Not done without asking: pushing `search` (public) and publishing to proto.postfl.com.
