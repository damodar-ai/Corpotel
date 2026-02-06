# Scaling Guide

## Current Architecture Limitations

| Component | Current Limit | Bottleneck |
|-----------|--------------|------------|
| Database | 10 connections | Connection pool |
| API | Single process | No clustering |
| Frontend | Static files | None |

---

## Horizontal Scaling

### 1. Node.js Clustering

Use PM2 for multi-process:
```bash
pm2 start server.ts -i max  # Uses all CPU cores
```

### 2. Load Balancer

Nginx as reverse proxy:
```nginx
upstream corphotel_backend {
    least_conn;
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

server {
    location /api {
        proxy_pass http://corphotel_backend;
    }
}
```

### 3. Database Scaling

**Read Replicas:**
```
                    ┌──────────────┐
                    │    Master    │ ◄── Writes
                    │   (MySQL)    │
                    └──────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      ┌──────────┐   ┌──────────┐   ┌──────────┐
      │ Replica 1│   │ Replica 2│   │ Replica 3│ ◄── Reads
      └──────────┘   └──────────┘   └──────────┘
```

**Increase Pool Size:**
```typescript
const pool = mysql.createPool({
  connectionLimit: 50,  // Increase from 10
  // ...
});
```

---

## Vertical Scaling

### Recommended Server Specs

| Stage | CPU | RAM | Storage |
|-------|-----|-----|---------|
| Dev | 1 core | 1 GB | 20 GB |
| Staging | 2 cores | 4 GB | 50 GB |
| Production | 4+ cores | 8+ GB | 100+ GB |

---

## CDN for Static Assets

Use Cloudflare or AWS CloudFront:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Session/State Management

For multi-server setups, use Redis:
```bash
npm install redis ioredis
```

Externalize JWT validation (already stateless ✓)

---

## Scaling Checklist

- [ ] Enable Node.js clustering
- [ ] Increase database pool size
- [ ] Add load balancer
- [ ] Set up database read replicas
- [ ] Add CDN for static assets
- [ ] Implement Redis for caching
- [ ] Configure auto-scaling
