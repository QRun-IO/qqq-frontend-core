# Troubleshooting

## Views Dropdown Missing on Table Pages

### Symptom
The "Views" dropdown (for saving/loading filter presets) is not visible on table pages.

### Root Cause
The SavedViews component visibility is **permission-based**. It checks:

```typescript
const hasQueryPermission = metaData?.processes.has("querySavedView");
// Only renders if hasQueryPermission && tableMetaData
```

### Solution
Grant users permission to these processes:

| Process | Purpose |
|---------|---------|
| `querySavedView` | **Required** - show dropdown, load views |
| `storeSavedView` | Save/update views |
| `deleteSavedView` | Delete views |

In your QQQ app's permission configuration:
```java
.withProcessPermission("querySavedView", true)
.withProcessPermission("storeSavedView", true)
.withProcessPermission("deleteSavedView", true)
```

### Related Files
- Frontend: `SavedViews.tsx` in qqq-frontend-material-dashboard
- Backend: `SavedViewsMetaDataProvider.java` in qqq-backend-core

---

## Stale lib/ Build

### Symptom
Published npm package is missing recent TypeScript changes.

### Root Cause
The `lib/` directory wasn't rebuilt before publishing.

### Solution
The `prepublishOnly` hook in `package.json` now handles this:
```json
"prepublishOnly": "rm -rf lib/ && tsc -p ./ --outDir lib/"
```

For local development with yalc:
```bash
npm run yalc-push  # Runs prepublishOnly first
```
