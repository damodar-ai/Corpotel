# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ running locally
- npm 9+ installed

### Step 1: Set Up Database (2 minutes)

Open a terminal and create the database:

```bash
mysql -u root -p < backend/database/schema.sql
```

Enter your MySQL password when prompted.

### Step 2: Configure Environment Variables

**Backend Configuration:**
Edit `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=corp_hotel_booking
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend Configuration:**
Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Install Dependencies (1 minute)

Dependencies are already installed, but if you need to reinstall:

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Step 4: Start the Application

From the root directory:

```bash
npm run dev
```

This starts:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

Wait for both servers to start (watch for console messages).

### Step 5: Login & Explore

The browser should open automatically to http://localhost:3000.

**Demo Credentials:**
- Email: `admin@corp-hotel.com`
- Password: `admin@123`

## 📁 Project Structure

```
CorpHotelBooking/
├── backend/              # Node.js/Express API
│   └── ...
├── frontend/             # React 18 UI
│   └── ...
├── package.json          # Root config
└── README.md
```

## 🛠️ Available Commands

### Development
```bash
npm run dev              # Start both frontend & backend
npm run dev:backend     # Backend only
npm run dev:frontend    # Frontend only
```

### Build & Production
```bash
npm run build           # Build both
npm start              # Run production build
```

### Testing
```bash
npm test               # Run all tests
```

## 🎨 Key Features Ready to Use

✅ User Authentication (Login/Register)
✅ Hotel Search & Filtering
✅ Room Availability Checking
✅ Booking Management
✅ Admin Dashboard
✅ Corporate Pricing
✅ Professional UI with Tailwind CSS
✅ Responsive Design

## 🔑 Key Endpoints

### Hotels
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/:id/rooms` - Get room availability

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - View your bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/bookings/list` - All bookings
- `GET /api/admin/hotels/stats` - Hotel statistics

See [backend/API.md](backend/API.md) for complete API documentation.

## 🎯 Next Steps

1. **Add Hotels**: Insert more hotels into the database
2. **Customize Branding**: Update colors in `frontend/src/index.css`
3. **Payment Integration**: Connect Stripe or Razorpay
4. **Email Notifications**: Add nodemailer for confirmations
5. **Deployment**: Deploy to Heroku, AWS, or DigitalOcean

## 📊 Database Schema

Key tables:
- `users` - User accounts
- `hotels` - Hotel information
- `rooms` - Individual rooms
- `room_types` - Room categories with pricing
- `bookings` - Customer bookings
- `corporate_clients` - Corporate organization accounts

## ❓ Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql -u root -p`
- Verify `backend/.env` with correct credentials
- Check port 5000 is available

### Frontend won't load
- Check `frontend/.env` has correct API URL
- Verify backend is running at the URL specified
- Clear browser cache and refresh

### Database errors
- Ensure database is created: `SHOW DATABASES;`
- Run schema: `mysql -u root -p < backend/database/schema.sql`
- Check MySQL credentials in `backend/.env`

## 💬 Support

For detailed setup instructions, see [SETUP.md](SETUP.md)
For API documentation, see [backend/API.md](backend/API.md)
For feature roadmap, see [FEATURES.md](FEATURES.md)

---

**Ready to develop!** Your corporate hotel booking platform is now running. 🎉
