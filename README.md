# qqq-frontend-core

TypeScript client library for building frontends on QQQ applications.

**For:** Developers building custom UIs or integrating QQQ into existing applications  
**Status:** Stable

## Why This Exists

QQQ applications expose a backend API for metadata, records, and processes. If you're building a custom frontend instead of using the standard dashboard, you need a client that:

- Understands QQQ's metadata-driven architecture
- Handles authentication flows (OAuth2, tokens)
- Provides typed interfaces for records, queries, and processes
- Manages API communication reliably

This library is that client. It's framework-agnostic - use it with React, Vue, Angular, or plain JavaScript.

If you want a ready-to-use admin UI, use [qqq-frontend-material-dashboard](https://github.com/QRun-IO/qqq-frontend-material-dashboard) instead. It's built on this library.

## Features

- **Typed API client** - Full TypeScript support for QQQ operations
- **Metadata loading** - Fetch table, process, and app definitions from QQQ
- **Record CRUD** - Create, read, update, delete with query filters
- **Process execution** - Run backend processes with parameter passing
- **Auth handling** - OAuth2, bearer tokens, and custom auth flows
- **Error normalization** - Consistent exception handling across operations

## Quick Start

**Prerequisites:** Node.js 18+

```bash
npm install @qrunio/qqq-frontend-core
```

```typescript
import { QController } from '@qrunio/qqq-frontend-core';

const api = new QController('https://your-qqq-server.com');

// Load what tables and processes exist
const metadata = await api.loadMetaData();
console.log('Tables:', [...metadata.tables.keys()]);

// Query records
const users = await api.queryRecords('user', {
  filters: [{ field: 'isActive', operator: '=', value: true }],
  limit: 10
});
```

## Usage

### Authentication

```typescript
// Bearer token (simplest)
api.setAuthorizationHeaderValue('Bearer your-jwt-token');

// OAuth2
api.setAuthenticationMetaData({
  type: 'OAUTH2',
  clientId: 'your-client-id',
  tokenUrl: 'https://auth.example.com/token'
});
```

### Working with Records

```typescript
// Create
const order = await api.createRecord('order', { 
  customerId: 42, 
  status: 'pending' 
});

// Read
const record = await api.getRecord('order', order.id);

// Update
await api.updateRecord('order', order.id, { status: 'shipped' });

// Delete
await api.deleteRecord('order', order.id);

// Query with filters
const pending = await api.queryRecords('order', {
  filters: [{ field: 'status', operator: '=', value: 'pending' }],
  sort: [{ field: 'createdAt', direction: 'DESC' }],
  limit: 50
});
```

### Running Processes

```typescript
const result = await api.executeProcess('generateInvoice', {
  orderId: 123,
  format: 'pdf'
});
```

### Error Handling

```typescript
import { QException } from '@qrunio/qqq-frontend-core';

try {
  await api.executeProcess('riskyOperation', params);
} catch (e) {
  if (e instanceof QException) {
    console.error(`QQQ error: ${e.message} (${e.status})`);
  }
  throw e;
}
```

## Configuration

```typescript
// Custom timeout (default: 60s)
api.setStepTimeoutMillis(120000);

// Global error handler
const api = new QController('https://...', (error) => {
  logToMonitoring(error);
});
```

## Project Status

**Maturity:** Stable, used in production  
**Breaking changes:** Follow semver; major versions may break API  

**Roadmap:**
- WebSocket support for real-time updates
- Request batching for bulk operations
- Offline queue for intermittent connectivity

## Contributing

```bash
git clone https://github.com/QRun-IO/qqq-frontend-core
cd qqq-frontend-core
npm install
npm test
```

Submit issues and PRs to the [main QQQ repository](https://github.com/QRun-IO/qqq/issues).

## License

AGPL-3.0
