# Backup & Disaster Recovery

## Database Backups

### Manual Backup
```bash
# Full database backup
mysqldump -u root -p corp_hotel_booking > backup_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip backup_*.sql
```

### Restore from Backup
```bash
# Decompress
gunzip backup_20240101_120000.sql.gz

# Restore
mysql -u root -p corp_hotel_booking < backup_20240101_120000.sql
```

### Automated Backups (Cron)
```bash
# Add to crontab: crontab -e
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-db.sh
```

**backup-db.sh:**
```bash
#!/bin/bash
BACKUP_DIR=/var/backups/corphotel
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME=corp_hotel_booking

# Create backup
mysqldump -u backup_user -p"$DB_PASSWORD" $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

# Copy to remote storage (optional)
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://corphotel-backups/
```

---

## Backup Schedule

| Type | Frequency | Retention |
|------|-----------|-----------|
| Full | Daily | 7 days |
| Weekly | Sunday | 4 weeks |
| Monthly | 1st of month | 12 months |

---

## Disaster Recovery Plan

### Scenario 1: Database Corruption
1. Stop application: `pm2 stop corphotel-api`
2. Restore latest backup
3. Verify data integrity
4. Restart application

### Scenario 2: Server Failure
1. Provision new server
2. Restore from backup
3. Update DNS if needed
4. Verify all services

### Scenario 3: Security Breach
1. Take server offline
2. Rotate all credentials
3. Analyze breach
4. Restore from clean backup
5. Apply security patches
6. Document incident

---

## Recovery Time Objectives

| Metric | Target |
|--------|--------|
| RTO (Recovery Time) | < 4 hours |
| RPO (Data Loss) | < 24 hours |

---

## Backup Verification

Monthly backup verification:
1. Restore to test environment
2. Verify data integrity
3. Test application functionality
4. Document results
