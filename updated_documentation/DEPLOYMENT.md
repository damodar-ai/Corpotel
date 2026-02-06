# Deployment Guide

## Prerequisites

- Node.js 18+ on server
- MySQL 8.0+ database
- Domain with SSL certificate
- Reverse proxy (nginx recommended)

---

## Deployment Options

### Option 1: Traditional VPS Deployment

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install mysql-server
sudo mysql_secure_installation

# Install nginx
sudo apt install nginx
```

#### 2. Database Setup
```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE corp_hotel_booking;
CREATE USER 'corphotel'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON corp_hotel_booking.* TO 'corphotel'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run schema
mysql -u corphotel -p corp_hotel_booking < backend/database/schema.sql
```

#### 3. Application Setup
```bash
# Clone repository
git clone https://github.com/your-org/corp-hotel.git /var/www/corphotel
cd /var/www/corphotel

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Build frontend
npm run build

# Setup environment
cp updated_documentation/env.example backend/.env
# Edit backend/.env with production values
```

#### 4. PM2 Process Manager
```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd /var/www/corphotel/backend
pm2 start server.ts --name corphotel-api --interpreter ts-node

# Save PM2 config
pm2 save
pm2 startup
```

#### 5. Nginx Configuration
```nginx
# /etc/nginx/sites-available/corphotel
server {
    listen 80;
    server_name corphotel.com www.corphotel.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name corphotel.com www.corphotel.com;

    ssl_certificate /etc/letsencrypt/live/corphotel.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/corphotel.com/privkey.pem;

    # Frontend (static files)
    location / {
        root /var/www/corphotel/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/corphotel /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d corphotel.com -d www.corphotel.com
```

---

### Option 2: Docker Deployment

See `docker-compose.yml` in this folder.

```bash
docker-compose up -d
```

---

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (32+ chars)
- [ ] Rotate Google OAuth credentials
- [ ] Enable HTTPS only
- [ ] Configure firewall (only 80, 443, 22)
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Set up log rotation
- [ ] Test all authentication flows
- [ ] Verify rate limiting works

---

## Rollback Procedure

```bash
# If deployment fails
cd /var/www/corphotel
git checkout <previous_commit>
npm install
cd frontend && npm run build
pm2 restart corphotel-api
```
