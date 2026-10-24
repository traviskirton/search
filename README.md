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
