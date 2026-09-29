# QQQ Frontend Core - Project Context

## Overview
TypeScript client library for QQQ frontends. Framework-agnostic (React, Vue, Angular, plain JS).

- **Package:** `@qrunio/qqq-frontend-core`
- **Registry:** npm
- **Current Version:** 0.40.1-SNAPSHOT

## Build System

### Key Scripts
```bash
npm run prepublishOnly  # Clean rebuild: rm -rf lib/ && tsc -p ./ --outDir lib/
npm run yalc-push       # Local dev: rebuild + yalc push
```

### Build Guarantee
The `prepublishOnly` npm lifecycle hook ensures `lib/` is always rebuilt before publishing. This prevents stale build issues.

## Related Repositories

| Repo | Type | Relationship |
|------|------|--------------|
| `qqq-frontend-material-dashboard` | Maven JAR | React frontend, depends on this library |
| `qqq` | Maven multi-module | Backend framework |

## Version Strategy
Frontend repos can version independently from backend:
- `qqq-frontend-core` and `qqq-frontend-material-dashboard` share version (currently 0.40.1-SNAPSHOT)
- `qqq-frontend-material-dashboard` can use different `qqq.version` for backend deps (currently 0.40.0-SNAPSHOT)

## Key Classes

### QInstance (`src/model/metaData/QInstance.ts`)
Main metaData container. Contains:
- `tables: Map<string, QTableMetaData>`
- `processes: Map<string, QProcessMetaData>`
- `reports`, `widgets`, `apps`, `branding`, `theme`, etc.

### QThemeMetaData (`src/model/metaData/QThemeMetaData.ts`)
90+ theme properties for UI customization. Includes colors, typography, component-specific styling.

## CI/CD

- **Platform:** CircleCI
- **Orb:** `kingsrook/qqq-orb`
- **Workflows:**
  - `test_only` - feature branches
  - `publish_snapshot` - develop branch
  - `publish_release` - main branch + tags

## Common Issues

### Stale lib/ Build
**Symptom:** Published package missing recent changes
**Cause:** `lib/` not rebuilt before publish
**Fix:** `prepublishOnly` hook handles this automatically

### Views Dropdown Missing (Frontend)
**Symptom:** "Views" dropdown not showing on table pages
**Cause:** Permission-based visibility - requires process permissions
**Fix:** Grant permissions for:
- `querySavedView` (required to show dropdown)
- `storeSavedView` (save functionality)
- `deleteSavedView` (delete functionality)

## Session Continuity
Session state is stored in `.session-state.md` (local to this repo).
To continue: say "continue from last session"

## Knowledge base

Durable knowledge about this repo lives in the second-brain vault
(`$SECOND_BRAIN_VAULT`, i.e. `R:/Git.Local/KofTwentyTwo/second-brain`):

- QQQ domain hub: `knowledge/qqq/qqq-hub.md`
- This repo's dossier: `knowledge/qqq/repos/qqq-frontend-core.md`
  (endpoint map legacy vs `/qqq/v1`, npm version history, division of labor
  vs material-dashboard, known bugs/risks)

Dossier reviewed at commit `e234e3028c8d` (branch `develop`,
0.40.13-SNAPSHOT, 2026-07-04). Consult the dossier before re-deriving
architecture from source; update it when controllers, endpoints, or
publishing change.
