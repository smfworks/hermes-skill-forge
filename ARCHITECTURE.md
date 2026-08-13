# Hermes Skill Forge — Architecture

In-memory mock studio. There is **no sql.js**, no browser persistence, and no
Hermes client in this release.

```
Browser  --GET /api/state-->  mock-data singleton
         --POST /api/branch
         --POST /api/skills/edit
         --POST /api/evolve
         --GET  /api/events/stream (SSE of the same store)
```

Client pages must not import `getSystemState` / `editSkill` / `requestEvolution`.
Mutations go through API routes so the UI and the server share one process store.
