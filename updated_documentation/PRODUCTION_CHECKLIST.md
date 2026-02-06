# Production Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Code reviewed and approved
- [ ] No console.log statements (production removes them)

### Security
- [ ] JWT_SECRET is 32+ characters
- [ ] All secrets in environment variables
- [ ] .env files NOT in version control
- [ ] Google OAuth credentials rotated
- [ ] ADMIN_EMAILS configured

### Database
- [ ] Database backups configured
- [ ] Schema up to date
- [ ] Indexes created
- [ ] Connection pool sized appropriately

### Configuration
- [ ] NODE_ENV=production
- [ ] FRONTEND_URL set correctly
- [ ] CORS origins configured
- [ ] Rate limiting enabled

---

## Deployment

### Infrastructure
- [ ] Server provisioned
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Firewall rules set (80, 443, 22)

### Application
- [ ] Dependencies installed
- [ ] Frontend built
- [ ] Backend started with PM2
- [ ] Health check passing

### Reverse Proxy
- [ ] Nginx configured
- [ ] SSL termination working
- [ ] API proxy working
- [ ] Static files served

---

## Post-Deployment

### Verification
- [ ] Home page loads
- [ ] Login works
- [ ] Registration works
- [ ] Google OAuth works
- [ ] API endpoints responding
- [ ] Database connections stable

### Monitoring
- [ ] Health checks configured
- [ ] Error tracking enabled
- [ ] Log rotation set up
- [ ] Alerts configured

### Documentation
- [ ] Deployment documented
- [ ] Rollback procedure tested
- [ ] Team notified

---

## Rollback Plan

If issues occur:
1. Stop current deployment
2. Restore previous version: `git checkout <previous_tag>`
3. Rebuild and restart
4. Restore database backup if needed
5. Notify team and users

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA | | | |
| DevOps | | | |
| Manager | | | |
