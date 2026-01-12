# Version Management

## Current Versions (as of 2026-01-12)

| Package | Version | Registry |
|---------|---------|----------|
| `@qrunio/qqq-frontend-core` | 0.40.1-SNAPSHOT | npm |
| `qqq-frontend-material-dashboard` | 0.40.1-SNAPSHOT | Maven Central |
| `qqq` (backend) | 0.40.0-SNAPSHOT | Maven Central |

## Frontend vs Backend Versioning

Frontend repos can version independently from the backend. In `qqq-frontend-material-dashboard`:

```xml
<properties>
  <revision>0.40.1-SNAPSHOT</revision>      <!-- This artifact's version -->
  <qqq.version>0.40.0-SNAPSHOT</qqq.version> <!-- Backend dependency version -->
</properties>
```

This allows frontend-only releases without requiring a full backend release.

## Version Bump Process

### qqq-frontend-core (npm)
1. Update `version` in `package.json`
2. Push to develop branch
3. CI automatically publishes to npm

### qqq-frontend-material-dashboard (Maven)
1. Update `revision` property in `pom.xml`
2. Optionally update `qqq.version` if backend changes needed
3. Push to develop branch
4. CI runs Playwright tests + publishes to Maven Central

## CI/CD Orb Behavior

The `kingsrook/qqq-orb` `calculate_version.sh` script:
- For develop branch with existing SNAPSHOT: keeps current version
- Only bumps version on release merges or RC versions
- Each repo manages its own version independently
