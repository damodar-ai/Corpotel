# Setup and Installation Guide

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MySQL**: v8.0 or higher

## Project Structure

```
CorpHotelBooking/
├── backend/              # Node.js/Express API server
│   ├── database/        # Database connection and schema
│   ├── routes/          # API route handlers
│   ├── middleware/      # Express middleware (auth)
│   ├── controllers/     # Business logic
│   ├── utils/           # Helper functions
│   ├── server.ts        # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env             # Environment variables
│
├── frontend/            # React UI application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React Context
│   │   ├── hooks/       # Custom hooks
│   │   ├── App.tsx      # Main app component
│   │   ├── main.tsx     # React entry point
│   │   └── index.css    # Tailwind CSS
│   ├── public/          # Static files
│   ├── index.html       # HTML entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env             # Environment variables
│
├── package.json         # Root workspace config
├── README.md
└── .gitignore
```

## Step 1: Database Setup

### 1.1 Create MySQL Database

```bash
mysql -u root -p
```

In MySQL console:
```sql
CREATE DATABASE corp_hotel_booking;
USE corp_hotel_booking;
source backend/database/schema.sql;
```

Or run in one command:
```bash
mysql -u root -p < backend/database/schema.sql
```

### 1.2 Update Backend Environment Variables

Create/update `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=corp_hotel_booking
JWT_SECRET=your_secret_key_change_in_production
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
cd ..
```

### 2.2 Build TypeScript (Optional for development)

```bash
cd backend
npm run build
cd ..
```

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd frontend
npm install
cd ..
```

### 3.2 Update Frontend Environment Variables

Create/update `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Running the Application

### Option A: Run Both Concurrently (from root)

```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:5000 (with nodemon for hot reload)
- **Frontend**: http://localhost:3000 (with Vite for hot reload)

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

### Option C: Production Build & Run

```bash
# Build both
npm run build

# Run production server
npm start
```

## Step 5: Verify Installation

1. **Check Backend**: Visit http://localhost:5000/api/health
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Check Frontend**: Visit http://localhost:3000
   - Should load the CorpHotel homepage

3. **Test Database**: Check MySQL connection in backend logs
   - Should show: "✓ Connected to MySQL database"

## Test Credentials

After running the database schema, use these credentials to login:

**Admin Account:**
- Email: `admin@corp-hotel.com`
- Password: `admin@123`

You can register additional users through the registration page.

## Configuration Files

### Backend Configuration

**backend/tsconfig.json** - TypeScript compiler options
**backend/package.json** - Dependencies and scripts

### Frontend Configuration

**frontend/vite.config.ts** - Vite bundler config
**frontend/tsconfig.json** - TypeScript compiler options
**frontend/tailwind.config.js** - Tailwind CSS customization
**frontend/package.json** - Dependencies and scripts

## Troubleshooting

### Port Already in Use

If port 5000 or 3000 is already in use:

**Backend (change port):**
- Edit `backend/.env`: Change `PORT=5001`
- Edit `frontend/.env`: Change `VITE_API_URL=http://localhost:5001/api`

**Frontend (change port):**
- Edit `frontend/vite.config.ts`: Change `port: 3001`

### MySQL Connection Failed

1. Check MySQL is running: `mysql -u root -p`
2. Verify credentials in `backend/.env`
3. Check database exists: `SHOW DATABASES;`
4. Create database if missing: See Step 1

### npm Install Issues

Clear npm cache and retry:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found Errors

TypeScript import issues - ensure:
1. File extensions are `.ts` or `.tsx`
2. Imports use correct paths
3. Files exist in specified locations

## Development Commands

### Backend

- `npm run dev:backend` - Start with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled code
- `npm test` - Run tests

### Frontend

- `npm run dev:frontend` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## Project Features

✅ User authentication with JWT
✅ Hotel search and filtering
✅ Room availability checking
✅ Booking management
✅ Corporate client support with discounts
✅ Admin dashboard with statistics
✅ Responsive UI with Tailwind CSS
✅ Professional corporate design
✅ Real-time booking status updates

## Next Steps

1. Customize corporate colors in `frontend/src/index.css`
2. Add more hotels/rooms via database
3. Implement payment integration
4. Add email notifications
5. Set up monitoring and logging
6. Deploy to production

## Support

For issues or questions:
1. Check the error logs
2. Verify all environment variables
3. Ensure database is properly initialized
4. Check that all ports are available
