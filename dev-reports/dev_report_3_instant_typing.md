# Development Report: Instant Typing in Search

**Commit:** [hash]
**Phase:** Performance
**Breakthrough:** yes

## Objective

Remove the lag between a keystroke in the search field and the character appearing.

## Summary

Since "Remove result caps" (652ed53), a single letter matched all 915 entries, and each keystroke rendered all those cards at once, each with its own Mantine `Menu`, before the input could paint. The search itself was fast (16ms for `a`, under 4ms afterwards). The fix makes the results render after the input, renders the grid in batches, and cuts the cost of each card. The changes are in 745af29, after a checkpoint commit c9f2f4c for the pending theme-facet change.

On production builds, typing "adventure" and deleting it again, twice:

| Metric | Before | After |
|---|---|---|
| Keystroke to paint, median | 1152ms | 5ms |
| Keystroke to paint, worst | 3052ms | 37ms |
| Longest background task | 3051ms | 135ms |
| Cards mounted for `a` | 915 | 60 (more load on scroll) |

## Breakthrough

The lag came from the result grid, not the search. Rendering up to 915 Mantine cards in one go on every keystroke blocked the input. Rendering after the input, in batches, with lazily created menus brings typing to a single frame.

## Changes Made

| File | Change |
|---|---|
| `src/hooks/useSearch.ts` | `useDeferredValue(search)`. Results are a `useMemo` instead of effect + state. One shared `searchHits` query per keystroke instead of two. Entity values and the entity map are built once at load. `getEntityValues` moved to module scope. |
| `src/App.tsx` | Renders 60 cards at a time. A sentinel `IntersectionObserver`, recreated for each batch, loads the next 60 when the end of the grid is near. Resets when results change. Memoized `ResultCard` wrapper. |
| `src/components/SearchResult/SearchResult.tsx` | Builds the Mantine `Menu` on the card's first hover or focus. Until then the dots button renders alone. |

## Issues Resolved

1. **Every keystroke rendered the whole grid.** Fixed by deferring the results and rendering them in 60-card batches.
2. **The search ran twice per keystroke** (once for available tags, once for results). Now it runs once and both use the result.
3. **Tag value sets were rebuilt for every entity on every keystroke.** They are now computed once at load.
4. **Scrolling loaded all 915 cards at once.** The first sentinel used Mantine `useIntersection`, whose `isIntersecting` stayed true across batches, so each batch triggered the next and one scroll caused a 1.5s stall. Fixed by creating a new observer for each batch, which reports once after layout.
5. **Mounting 60 cards still took 50–320ms in the background**, mostly Popover/floating-ui setup from each card's menu. Fixed by building the menu on first hover or focus, which brought the longest background task down to 135ms.

## Next Steps

- Optionally dim the grid while results lag behind the input (`search !== deferredSearch`).
- If the index grows a lot, move the MiniSearch query to a Web Worker.
