# Troubleshooting Guide

## Common Issues

### Database Connection Failed

**Error:** `Database connection failed: ECONNREFUSED`

**Solution:**
1. Ensure MySQL is running: `sudo systemctl status mysql`
2. Verify credentials in `.env` file
3. Check if database exists: `mysql -u root -p -e "SHOW DATABASES;"`

---

### JWT Token Invalid

**Error:** `401 Unauthorized - Invalid token`

**Solutions:**
1. Token expired - re-login to get new token
2. JWT_SECRET changed - all users must re-login
3. Token format incorrect - ensure `Bearer ` prefix

---

### Google OAuth Not Working

**Error:** `Failed to generate Google auth URL`

**Solutions:**
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
2. Check redirect URI matches Google Console configuration
3. Ensure OAuth consent screen is configured

---

### CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solutions:**
1. Verify `FRONTEND_URL` matches actual frontend URL
2. Include trailing slash consistently
3. Clear browser cache

---

### Rate Limit Exceeded

**Error:** `429 Too Many Requests`

**Solutions:**
1. Wait 15 minutes and retry
2. If testing, temporarily increase limits in `server.ts`

---

### Build Fails - Missing Dependencies

**Error:** `Module not found`

**Solutions:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Frontend Not Loading

**Solutions:**
1. Check Vite dev server is running
2. Verify port 3000 is not in use
3. Clear browser cache and localStorage

---

### Bookings Not Appearing

**Solutions:**
1. Verify user has correct identity type (Corporate/Hotel)
2. Check booking status filter
3. Verify hotel/corporate profile is completed

---

## Debug Mode

Enable verbose logging:
```bash
# Set in .env
NODE_ENV=development
```

## Getting Help

1. Check existing GitHub Issues
2. Open new issue with:
   - Error message
   - Steps to reproduce
   - Environment details
