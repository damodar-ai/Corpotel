# Quick Start Guide

Get CorpHotel running in 5 minutes.

## Prerequisites
- Node.js 18+
- MySQL 8.0+
- Git

## Steps

### 1. Clone & Install (2 min)
```bash
git clone https://github.com/your-org/corp-hotel.git
cd corp-hotel
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Database Setup (1 min)
```bash
mysql -u root -p -e "CREATE DATABASE corp_hotel_booking;"
mysql -u root -p corp_hotel_booking < backend/database/schema.sql
```

### 3. Configure Environment (1 min)
```bash
# Copy and edit
cp updated_documentation/env.example backend/.env
```

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=corp_hotel_booking
JWT_SECRET=your_secret_32_chars_minimum
```

### 4. Run (1 min)
```bash
# From root directory
npm run dev
```

### 5. Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## First Steps
1. Register a new account
2. Choose identity (Hotel or Corporate)
3. Complete profile
4. Start using the platform!

## Need Help?
- [Full Documentation](./README.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [API Reference](./API.md)
