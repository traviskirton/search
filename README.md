# base

Vite + React + TypeScript + Mantine

## Setup

```bash
npm install
npm run dev
```

### Optional: Pin Node version

Using [mise](https://mise.jdx.dev).

If using mise, run `mise install` after creating your config file.

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Type check and build for production
- `npm run build:proto` — Build for https://proto.postfl.com/search/ (no OpenAI key, no components gallery)
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## Tokens

Every design value lives in one file, [src/theme/tokens.css](src/theme/tokens.css). `theme.ts`, the CSS modules and the TSX only reference it through `var(--sc-*)`.

It has three tiers:

1. **Primitives:** palette ramps (`--sc-slate-0…9` and the rest) and the scales for type, space, radius, border, icon size, control height and motion.
2. **Semantic colour and depth**, light and dark: `--sc-surface`, `--sc-ink`, `--sc-key` and so on. Each one points at a ramp step where one matches.
3. **Components:** each component's own measures, such as `--sc-chip-height` and `--sc-card-title-font`. Odd values live here.

To restyle, change a token. Phosphor writes icon sizes as SVG attributes, which can't take `var()`, so the parent module sizes each `svg` in CSS.

Literal on purpose:

- Breakpoints in `theme.ts`, because CSS can't read `var()` inside `@media`.
- Mechanics: `0`, `100%`, `50%`, `auto` and the `#000` in the chip row's fade mask.
- The components gallery (dev only) and the results' load-ahead margin.

## Publish

The host is SFTP only. It needs the `postfl-cpanel` host in `~/.ssh/config`. Asset file names change with every build, so upload the files `dist/assets` actually contains.

```sh
npm run build:proto
cd dist
sftp postfl-cpanel <<'SFTP'
-mkdir proto.postfl.com/search
-mkdir proto.postfl.com/search/assets
put search-index.json proto.postfl.com/search/search-index.json
put assets/* proto.postfl.com/search/assets/
put index.html proto.postfl.com/search/index.html
SFTP
```

Upload `index.html` last, so it never points at assets that aren't there yet.
