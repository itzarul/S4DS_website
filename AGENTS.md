# Base44 Dev Environment

## Stack
React 19 + Vite 6 + Tailwind CSS v4 frontend. No backend, no database, no external services.

## Running
```
docker compose -f docker-compose.base44.yml up -d --build
```
- Web entry point: host port 3000 → container Vite dev server on 5173.
- Source is bind-mounted at `/app`; `npm install` runs at container start, then `npm run dev -- --host 0.0.0.0`.
- Live reload is active — edits to `src/` appear in the preview without a rebuild.

## Vite config
`vite.config.js` sets `server.host: true` and `server.allowedHosts: true` so the preview's external hostname is accepted.

## Secrets
None required. `.env.example` only contains non-secret `VITE_APP_TITLE` / `VITE_APP_ENV`, provided inline via compose `environment:`.

## Verify
`curl -sf -H "Host: external.preview.example" http://localhost:3000/` returns the app HTML.
