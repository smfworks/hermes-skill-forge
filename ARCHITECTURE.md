# Hermes Skill Forge — Architecture

## Overview

Hermes Skill Forge is a visual studio for observing, understanding, editing, and
steering the self-improvement of Hermes skills. It provides a precision
workshop environment where users can watch skills evolve, compare versions,
manually intervene, and export high-quality skills for the community.

## Architecture

### Tech Stack
- **Next.js 16** App Router + React
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Flow** for graph visualization
- **SQLite** (via `sql.js`) for local state persistence

### Project Structure
```
hermes-skill-forge/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── state/route.ts
│   │   │   ├── skills/route.ts
│   │   │   ├── lineages/route.ts
│   │   │   └── events/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── types.ts          # Data models
│   │   ├── mock-data.ts      # Mock data generator
│   │   ├── utils.ts          # Utility functions
│   │   └── components/
│   │       ├── SkillGraph.tsx
│   │       ├── EvolutionFeed.tsx
│   │       └── ...
│   └── styles/
├── public/
├── ARCHITECTURE.md
├── README.md
└── package.json
```

### Data Model

The core data model consists of:

- **Skill**: A specific version of a capability, with code, metadata, and performance metrics.
- **Lineage**: A group of related skill versions sharing an evolutionary history.
- **EvolutionEvent**: A significant change in the skill ecosystem (creation, improvement, branching, etc.).
- **SkillGraph**: Visualization structure of nodes (skills) and edges (evolution, branching).

### Local-First Design

The application is designed to work locally first, with all data stored in
the browser. Future versions will support connecting to a live Hermes instance
via WebSocket or REST API.

### Extensibility

The modular design allows for easy extension:
- New visualization components can be added to the `components/` directory.
- New API routes can be added to the `api/` directory.
- The data model can be extended with new fields and types.
