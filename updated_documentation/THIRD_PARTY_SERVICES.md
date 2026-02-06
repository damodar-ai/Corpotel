# Third-Party Services

## Current Integrations

| Service | Purpose | Required |
|---------|---------|----------|
| Google OAuth | User authentication | Optional |
| MySQL | Database | Required |

---

## Google OAuth 2.0

### Purpose
Allow users to sign in with their Google account.

### Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Configure consent screen
6. Add authorized redirect URIs

### Environment Variables
```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

### Costs
- Free tier: Unlimited for most use cases

---

## MySQL

### Purpose
Primary data storage for all application data.

### Options
- Self-hosted MySQL server
- AWS RDS MySQL
- Azure Database for MySQL
- Google Cloud SQL
- PlanetScale (MySQL-compatible)

### Environment Variables
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=username
DB_PASSWORD=password
DB_NAME=corp_hotel_booking
```

### Costs
- Self-hosted: Server costs only
- Managed: $10-100+/month depending on tier

---

## Recommended Future Integrations

### Redis (Caching)
- Session storage
- Query caching
- Rate limiting storage

### Sentry (Error Tracking)
- Real-time error monitoring
- Performance tracking
- Cost: Free tier available

### SendGrid/Mailgun (Email)
- Booking confirmations
- Password reset
- Marketing emails
- Cost: Free tier available

### Cloudflare (CDN)
- Static asset caching
- DDoS protection
- SSL certificates
- Cost: Free tier available

### AWS S3/Cloudinary (File Storage)
- Hotel images
- User uploads
- Cost: Pay per usage
