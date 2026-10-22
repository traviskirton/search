# Handoff: Search rebrand — Control Surface (Slate)

## Overview
A new visual identity for **Search** (github.com/traviskirton/search), a dense, faceted search tool over fiction and film entities. The chosen direction is **1d Control Surface** with the **Slate** palette. It feels like studio hardware: depth replaces borders, controls are keys that sit raised or latch down, and the three filter states read from tint plus icon.

**This is a restyle only.** Layout, information density, copy and behavior stay as they are in the current app. Change only colors, type, radius, shadows and component treatments.

## About the design files
The files in `reference/` are **design references built in HTML**, not production code. Recreate them in the existing app's stack (React + Mantine + Phosphor) using its existing components and patterns. Open `reference/Board-1d-Control-Slate.dc.html` in a browser to see every specimen in light and dark mode.

## Fidelity
**High fidelity** for tokens and component treatments: colors, type, radius and shadows are final. Layout follows the current app exactly: 24px page padding, cards in a 320–375px auto-fill grid with 200px rows, and a 380px chat panel.

---

## The depth model (the core rule)
There are three surface levels, and **depth means only one thing: on or off.**

| Level | Looks like | Used for |
|---|---|---|
| **Raised** (`--sc-surface` + `--sc-key` / `--sc-key-sm`) | Sits about 1px above the panel: a 1px bottom edge, a faint short shadow and a top highlight | Anything clickable that is idle: unselected tags, inactive category tabs, the sort button, type icon tiles in the legend |
| **Latched** (pushed in: inset shadow, `translateY(1px)`) | Pressed into the panel, one level deep | Anything that is **on**: a selected filter (in every state), the active category tab, a menu trigger while its menu is open |
| **Well** (`--sc-well` + `--sc-well-shadow`) | Recessed area | Inputs (search, chat), the data-line tag badge, the type icon tile on cards, the highlighted menu item, the assistant chat bubble |

Rules that came out of review:
- **Never nest a key inside a well.** A latched key inside a well reads as two levels deep. Category tabs sit directly on the panel, not in a tray.
- Raised keys stay subtle, only slightly above the surface. Don't add stacked 2px edges or long drop shadows.
- Latched depth is shallow too: an inset of 1px y and 2–3px blur, with 1px of travel.
- No LED or status dots on chips. Tint plus icon is enough. The only dot left is the category "has filters" marker, which is an open question (see below).

## Filter states (must stay distinguishable without color)
All three states are **latched** (they're on). The tint and the icon say which state.

| State | Face | Inset shadow | Icon (Phosphor Bold, 11px in chips, 10px in panel tags) | Label |
|---|---|---|---|---|
| **OR (default)** | `--sc-or-face` (plain grey) | `--sc-or-shadow` | none | `--sc-ink`, 600 |
| **Include** | `--sc-inc-face` | `--sc-inc-shadow` (green 1px inner ring) | `ph-plus` in `--sc-inc-ink` | `--sc-ink`, 600 |
| **Exclude** | `--sc-exc-face` | `--sc-exc-shadow` (red 1px inner ring) | `ph-exclamation-mark` in `--sc-exc-ink` | `--sc-ink`, 600 |

Unselected panel tags are **raised** (`--sc-surface`, `--sc-key-sm`), with `--sc-ink-2` text at weight 500.

> Repo note: today `FilterPanel` tags show state by tint only. Add the + / ! icon there too, to match the chips.

---

## Components

All measurements are in CSS px. Fonts: **Chivo** (UI) and **Chivo Mono** (labels), loaded from Google Fonts, weights 400–800 and 400–600. Icons: Phosphor **Bold** weight throughout.

### Search panel (`SearchInterface`)
- Panel: `--sc-surface`, radius 12, padding 12, `--sc-card` shadow, no border, 12px gap between the input and the ribbon.
- **Input:** height 54, radius 10, padding 0 16, **well** (`--sc-well` with `--sc-well-shadow`), Chivo 500 24px in `--sc-ink`, placeholder "Search..." in `--sc-muted`. No border.
- **Ribbon row:** flex, align center, gap 10.
  - **Funnel `ActionIcon`:** 34×34, radius 8, Phosphor `funnel` Bold 16px.
    - No filters: raised neutral key (`--sc-surface`, `--sc-key`, icon in `--sc-muted`)
    - Has filters: accent key (`--sc-accent`, `--sc-key-accent`, icon in `--sc-on-accent`)
    - Option held, pointer over the button, and filters exist: exclude red key (`--sc-exc` face with white icon, same accent-key shape). Not mocked; derived from current behavior.
  - **Chip row:** flex 1, horizontal scroll, gap 8, padding 4 2 6 (room for the inset shadows).
  - **Sort control** (pinned right): height 32, radius 8, raised (`--sc-key`). It's split: the label "RELEVANCE" plus a `caret-down` (10px, muted) at padding 0 11, then a 1px `--sc-line` divider, then the `arrow-up` / `arrow-down` toggle at padding 0 10, 13px. Chivo Mono 500 12px, uppercase, letter-spacing .06em. While its menu is open, the button is **latched** (`--sc-latched` + `--sc-latched-shadow`) and the caret flips to `caret-up`.

### Filter chip (ribbon)
- Split button, height 30, radius 8, latched (`translateY(1px)`), with the face and shadow for its state (table above). Chivo 600 13px.
- Label side: padding 0 9 0 10, gap 7, icon then text. Clicking it cycles OR → Include → Exclude.
- × side: padding 0 8, `ph-x` 11px in `--sc-muted`, separated by a 1px `--sc-line` left border.

### Filter panel (expands inside the search panel)
- Same panel treatment as the search panel (radius 12, padding 12, gap 12).
- **Category tabs:** a row directly on the panel (no well), gap 4. Each tab: padding 9 12, radius 7, Chivo Mono 500 12px, uppercase, letter-spacing .06em.
  - Inactive: raised (`--sc-surface` + `--sc-key-sm`), text in `--sc-muted`.
  - Active: latched (`--sc-latched` + `--sc-latched-shadow`, `translateY(1px)`), text in `--sc-ink`.
  - Has active filters: text in `--sc-ink` plus a 6px `--sc-accent` dot with `0 0 6px` glow before the label. **Open question**, see below.
- **Divider:** 1px `--sc-line`, with `0 1px 0 var(--sc-hi)` under it for an engraved look.
- **Tags:** wrap, gap 8 (rows) by 7 (columns), Chivo 500 13px, padding 8 10, radius 7. Unselected tags are raised; selected tags take their state's latched treatment and icon.

### Result card (`SearchResult`)
- 200px tall, radius 12, padding 12 14, column flex with gap 6, `--sc-surface`, `--sc-card` shadow, **no border**.
- **Hover:** `--sc-card-hover` and `translateY(-3px)`. Transition box-shadow and transform at about 120ms ease-out. The whole card is clickable.
- **Title:** Chivo 700 18px / 1.25, letter-spacing −.01em, one line with ellipsis.
- **⋮ button:** 24×24, radius 6, margin-right −4, `dots-three-vertical` 15px, `--sc-muted` (`--sc-ink` on card hover). While its menu is open it's latched (`--sc-latched` + `--sc-latched-shadow`).
- **Description:** Chivo 400 13.5px / 18px, `--sc-ink-2`, clamped to 5 lines.
- **Data line** (margin-top auto, space-between):
  - Tag badge in Chivo Mono 500 10px, uppercase, letter-spacing .1em, padding 4 6, radius 4, **well-sm** (`--sc-well` + `--sc-well-shadow-sm`), `--sc-ink-2`.
  - Link icon on the right: `ph-link` 14px, `--sc-muted` (`--sc-ink` on hover). With more than one link it opens the links menu.
- **Footer:**
  - Type icon tile: 22×22, radius 6, well-sm, Bold icon 13px.
  - Type label: Chivo Mono 500 11px, uppercase, letter-spacing .08em, `--sc-ink`.
  - Optional "Updated by": Chivo 400 11px in `--sc-muted`, with a 15px circular avatar (`--sc-accent` background, initials 7px 700 in `--sc-on-accent`), then the name and date in `--sc-ink-2`.

### Menu / dropdown (`Menu`)
- Dropdown: `--sc-surface`, radius 10, padding 5, `--sc-menu` shadow, no border.
- Item: padding 10 11, Chivo 500 14px, `--sc-ink`.
  - Hovered or highlighted item: **well-sm** with radius 7.
  - Selected item: `ph-check` 13px on the right.
  - Danger item: text and icon in `--sc-exc-ink`; on hover, well-sm with the text unchanged.
  - Submenu item: `ph-caret-right` on the right.
- Dividers: 1px `--sc-line` plus a `--sc-hi` highlight below.
- Card menu: **Open**, **Ask**. Sort menu: **Relevance / Alphabetical / Type**, with a check on the current one.

### Type icons (`TypeIcon`)
- Phosphor **Bold**, `--sc-ink`. In cards they sit in a 22px well-sm tile at 13px; elsewhere they're bare.
- Board legend: person-simple-circle, finn-the-human, map-pin, package, buildings, book, film-slate, car, planet, building. Keep the repo's existing name mapping if it differs; only the weight and the tile change.
- **The taxonomy includes `artifact`, which has no icon.** Add one (e.g. `diamond` or `scroll`).

### Chat panel (planned, 380px, full height, right side)
- Panel: `--sc-surface`, radius 12, `--sc-card`.
- Header: padding 12 14, 1px `--sc-line` bottom border. "Chat" in Chivo 700 16px. Status ("READY") on the right in Chivo Mono 500 10px, uppercase, `--sc-muted`, with **no dot**.
- Messages: padding 14, gap 14.
  - **User message:** aligned right, max-width 78%, background `--sc-ink`, text in `--sc-bg`, radius 12 12 4 12, padding 9 12, Chivo 500 14px / 1.4.
  - **Assistant message:** aligned left, max-width 90%, well-sm, radius 4 12 12 12, padding 11 13, Chivo 400 14px / 1.45 in `--sc-ink-2`. It can end with a row of mini filter chips (padding 5 8, radius 6, 600 12px, state face and shadow, + / ! icons) showing the filters it applied.
- **Empty state:** "Ask questions or search with natural language", centered, Chivo 400 14px in `--sc-muted`.
- **Loading:** 3 dots, or Mantine `Loader` type "dots" in `--sc-muted`.
- **Composer:** padding 10, gap 8.
  - Input: height 40, radius 9, well, placeholder "Ask or search in plain language…" in `--sc-muted`.
  - Send button: 40×40, radius 9, accent key, `paper-plane-right` 16px.
- Messages must use `flex: none` so they don't shrink and clip inside the column.

### States
- **Loading:** Mantine `Loader` in `--sc-muted`, centered in the grid.
- **No results:** "No results found", Chivo 500 14px in `--sc-muted`, centered.

---

## Design tokens
Every value is in `tokens.css`, defined for both light and dark mode. Key values:

| Token | Light | Dark |
|---|---|---|
| Page background `--sc-bg` | #d7dbe1 | #14171c |
| Raised surface `--sc-surface` | #f0f2f5 | #222730 |
| Latched `--sc-latched` | #e3e6eb | #1b1f26 |
| Well `--sc-well` | #ccd1d8 | #0f1115 |
| Line `--sc-line` | #c9ced6 | #313744 |
| Ink / ink-2 / muted | #161a20 / #363d47 / #5f6773 | #e6eaf0 / #c3c9d3 / #8f98a6 |
| Accent / on-accent | #f7d84a / #161a20 | #f5d84c / #14171c |
| OR face | #d2d6dd | #2d323b |
| Include / ink / face | #0f9e7a / #0a7a5e / #cdebe3 | #3cd3a7 / #6fe2c0 / #163a33 |
| Exclude / ink / face | #e2364c / #b8233a / #f7d2d9 | #ff5a6f / #ff8695 / #44202a |

- **Radius:** 4 (badges), 6 (small buttons), 7 (tags, tabs, menu items), 8 (keys, chips), 9–10 (inputs, menus), 12 (panels, cards).
- **Spacing:** unchanged from the current theme.
- **Type scale:**

| Use | Font | Size / line-height | Weight | Notes |
|---|---|---|---|---|
| Search input | Chivo | 24 | 500 | |
| Card title | Chivo | 18 / 1.25 | 700 | |
| Chat header | Chivo | 16 | 700 | |
| Chat, menus | Chivo | 14 | 400–500 | |
| Card description | Chivo | 13.5 / 18 | 400 | |
| Chips, tags | Chivo | 13 | 600 / 500 | |
| Tabs, sort | Chivo Mono | 12 | 500 | uppercase, letter-spacing .06em |
| Type labels | Chivo Mono | 11 | 500 | uppercase, letter-spacing .08em |
| Badges | Chivo Mono | 10 | 500 | uppercase, letter-spacing .1em |

## Mantine mapping
1. Import `tokens.css` globally after Mantine's styles, and use `theme.ts` as the new theme source. It replaces `theme/dist/mantine.js`, which is **gitignored and not in the repo**. Commit the theme source this time.
2. Set the page background to `--sc-bg` in global.css (`body { background: var(--sc-bg) }`), and set Mantine's `--mantine-color-body` to the same value.
3. Add custom Button and ActionIcon variants with a CSS module and `data-variant`:
   - `key`: raised, using `--sc-surface` with `--sc-key`
   - `latched`: `--sc-latched` with `--sc-latched-shadow` and `translateY(1px)`
   - `accent`: `--sc-accent` with `--sc-key-accent` and `--sc-on-accent` text

   Use `:active` on `key` to preview the latched look while the mouse is pressed.
4. **FilterChip** and the panel tags get a `data-state="or|include|exclude"` attribute. The CSS module maps each state to its face, shadow and icon color. Keep the existing three-state logic.
5. Remove borders from Card, Paper, Menu.dropdown and Input; depth carries the separation. Inputs use the well treatment.
6. Switch Phosphor icons to `weight="bold"` (set it globally with `IconContext`).
7. Swap Satoshi for Chivo and Chivo Mono in `index.html` (Google Fonts) and drop the Satoshi `@font-face`.

## Open questions
- **Category "has filters" marker:** currently a 6px accent dot. The suggested alternative is a count (e.g. "GENRE 3") in `--sc-muted` Chivo Mono. Confirm before building.
- **Logo and favicon:** the repo ships the base template's "K" mark, so Search needs its own.

## Files
- `tokens.css`: all semantic tokens, light and dark
- `theme.ts`: Mantine theme starting point
- `PROMPT.md`: a prompt to paste into Claude Code in the Search repo
- `reference/Board-1d-Control-Slate.dc.html`: the visual reference with all seven specimens in light and dark mode. Open it in a browser, keeping `support.js` beside it.
