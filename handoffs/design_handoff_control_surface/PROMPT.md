Restyle the Search app to the "Control Surface (Slate)" direction. The full spec is in `design_handoff_control_surface/README.md`; tokens are in `tokens.css` and a theme starting point is in `theme.ts`. Open `reference/Board-1d-Control-Slate.dc.html` in a browser for the visual target in light and dark mode.

Scope: visual only. Don't change layout, density, copy or behavior.

Do this:
1. Commit a real theme source. `theme/dist/mantine.js` is gitignored and missing from the repo, so add `theme.ts` (adapt it to however `main.tsx` imports the theme) and import `tokens.css` globally after Mantine's styles. Set the body background to `var(--sc-bg)`.
2. Fonts: replace Satoshi with Chivo (400–800) and Chivo Mono (400–600) from Google Fonts.
3. Icons: Phosphor Bold everywhere (set `IconContext` weight to bold). Add an icon for the `artifact` type, which currently falls back to a question mark.
4. Follow the depth model: raised = clickable and idle; latched (inset shadow, translateY(1px)) = on; well = inputs, badges and icon tiles. Never put a key inside a well.
5. Add Button/ActionIcon variants `key`, `latched` and `accent` through a CSS module.
6. Filter chips and filter-panel tags get `data-state="or|include|exclude"`. All three states are latched. OR is a plain grey face with no icon; include has a green face and a + icon; exclude has a red face and a ! icon. Panel tags must show the icon too (they show tint only today).
7. Funnel button: raised neutral with no filters, accent with filters, exclude red while Option is held over it with filters set.
8. Remove borders from Card, Paper, Menu and Input. Use the shadows from tokens.css: card, card-hover with translateY(-3px) on hover, and menu.
9. Category tabs sit directly on the panel with no tray. The active tab is latched; inactive tabs are raised.
10. Check both color schemes on `/` and on `/components`.

Leave the category "has filters" marker as a 6px accent dot for now (still undecided).
