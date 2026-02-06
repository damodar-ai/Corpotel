# Monitoring Setup

## Logging

### Current Implementation

Backend uses console logging with timestamps:
```javascript
console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
```

### Production Logging Recommendations

#### Use Morgan for HTTP Logging
```bash
npm install morgan
```

```typescript
import morgan from 'morgan';
app.use(morgan('combined')); // Apache combined format
```

#### Structured Logging with Winston
```bash
npm install winston
```

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## Health Checks

### Current Endpoint
```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Enhanced Health Check
```typescript
app.get('/api/health', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.json({
    status: dbStatus ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

---

## Metrics to Track

| Metric | Description |
|--------|-------------|
| Response Time | Average API response time |
| Request Rate | Requests per second |
| Error Rate | 4xx/5xx responses |
| Memory Usage | Node.js heap usage |
| DB Connections | Active pool connections |

---

## External Monitoring Services

### Recommended
- **UptimeRobot** - Uptime monitoring
- **Sentry** - Error tracking
- **DataDog** - APM and logs
- **New Relic** - Performance monitoring

### Sentry Integration
```bash
npm install @sentry/node
```

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## Alerting

Set up alerts for:
- Server downtime (> 1 minute)
- Error rate > 5%
- Response time > 2 seconds
- Memory usage > 80%
- Database connection failures
