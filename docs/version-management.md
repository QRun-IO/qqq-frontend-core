# Version Management

## Historical Versions (2026-01-12)

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
1. Merge a verified source change to `develop` through the shared required checks.
2. The orb calculates `MAJOR.MINOR.NEXT_PATCH-SNAPSHOT.CIRCLE_BUILD_NUM` from the source package version and the unique CircleCI job number. For example, source `0.40.27-SNAPSHOT` in job 1234 publishes `0.40.28-SNAPSHOT.1234`.
3. CI builds and publishes that immutable npm version under the `snapshot` dist-tag. It keeps the source branch unchanged; no snapshot version commit or manual per-build version bump is needed.
4. Verify the published version and install it in a clean consumer before claiming publication success. CI-only declaration updates may run verification without publishing.

Stable, RC and hotfix publication keep their existing shared orb policies. A
snapshot publication is not a stable release.

### qqq-frontend-material-dashboard (Maven)
1. Update `revision` property in `pom.xml`
2. Optionally update `qqq.version` if backend changes needed
3. Push to develop branch
4. CI runs Playwright tests + publishes to Maven Central

## CI/CD Orb Behavior

For Maven projects, the shared orb's `calculate_version.sh` script:
- For develop branch with existing SNAPSHOT: keeps current version
- Only bumps version on release merges or RC versions
- Each repo manages its own version independently
