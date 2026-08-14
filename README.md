# Hermes Skill Forge

> Local **mock** studio for visualizing fake Hermes skill lineages.

This Next.js UI paints an in-memory generator of skill versions, graphs, and
events. **It does not connect to Hermes, does not persist to SQLite, and does
not steer a live agent.** Use it as an information-architecture demo.

## What works

- Dashboard, lineage, and skill pages over `/api/state`
- `/skills` and `/events` list pages
- `POST /api/branch`, `/api/skills/edit`, `/api/evolve` against the mock store
- JSON export of the current mock skill

## Quick start

```bash
npm ci
npm test
npm run dev
```

See [ARCHITECTURE.md](ARCHITECTURE.md) and [SECURITY.md](SECURITY.md).

MIT — [LICENSE](LICENSE).
