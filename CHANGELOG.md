# Changelog

## [0.2.0] — 2026-08-13

### Fixed
- CI used Node 18; Next 16 requires >=20.9.0
- `/skills` and `/events` 404s
- Branch button discarded the prompt reason (stale React state)
- Edit UI never rendered
- Client and server used separate mock stores
- SSE advertised `Access-Control-Allow-Origin: *`

### Added
- Vitest for branch payload validation
- `/api/skills/edit` and `/api/evolve`
- SECURITY.md and honest README
