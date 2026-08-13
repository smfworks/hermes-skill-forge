# Security Policy

Local mock UI. Do not expose `next start` to the public internet.

- Mutations (`/api/branch`, `/api/skills/edit`, `/api/evolve`) are unauthenticated.
- SSE no longer sends `Access-Control-Allow-Origin: *`.
- 500 responses are generic.

Report issues privately to `dev@smfworks.com`.
