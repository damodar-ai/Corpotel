# Security Documentation

## Security Measures Implemented

### 1. Authentication & Authorization

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcrypt with cost factor 12 |
| JWT Tokens | 1-day expiry, HS256 signing |
| Google OAuth | Secure OAuth 2.0 flow |
| Role-Based Access | Hotel/Corporate identity types |

### 2. Input Validation

- **express-validator** for all auth endpoints
- Email format validation and normalization
- Password policy: minimum 8 chars, letter + number
- SQL injection prevention via parameterized queries

### 3. HTTP Security Headers

Using **Helmet.js** middleware:
- Content-Security-Policy
- X-Frame-Options (clickjacking prevention)
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)

### 4. Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Auth endpoints | 5 requests / 15 min |
| General API | 100 requests / 15 min |

### 5. CORS Protection

- Origin whitelist validation
- Credentials mode enabled
- Specific allowed methods/headers

### 6. Data Protection

- Sensitive data never logged
- Passwords never stored in plain text
- JWT secret required (no fallback)
- Environment variables for secrets

---

## Security Best Practices

### Environment Variables
```bash
# Generate secure JWT secret
openssl rand -base64 32

# Never commit .env files
# Use .gitignore to exclude
```

### Production Settings
```bash
NODE_ENV=production  # Enables security features
```

### Database Security
- Use dedicated database user with limited privileges
- Enable SSL for database connections in production
- Regular backups with encryption

---

## Credential Rotation

### JWT Secret Rotation
1. Generate new secret
2. Update `JWT_SECRET` in environment
3. Restart application (users must re-login)

### Google OAuth Rotation
1. Generate new credentials in Google Cloud Console
2. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Restart application

---

## Incident Response

1. **Credential Exposure**: Immediately rotate all secrets
2. **Unauthorized Access**: Revoke all JWT tokens by changing secret
3. **SQL Injection Attempt**: Review logs, patch vulnerability
4. **DDoS Attack**: Enable additional rate limiting, use CDN

---

## Security Checklist

- [ ] All secrets in environment variables
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] Regular dependency updates
- [ ] Security headers enabled
- [ ] Logging without PII
