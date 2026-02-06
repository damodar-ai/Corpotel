# Corporate Hotel Booking Application

A comprehensive full-stack hotel booking system designed for corporate clients with a clean, professional interface.

## Project Structure

```
├── backend/          # Node.js/Express API server
├── frontend/         # React UI application
├── .github/          # GitHub configurations
└── package.json      # Monolithic workspace configuration
```

## Features

- 🏨 Hotel search and filtering
- 📅 Date-based room availability
- 💼 Corporate pricing and bulk bookings
- 👥 User authentication and profiles
- 💳 Booking management
- 📊 Admin dashboard
- 🎨 Corporate design theme
- 🔐 Secure API endpoints

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MySQL 8.0
- **Authentication**: JWT
- **API**: RESTful with CORS support

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- MySQL 8.0+

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### Environment Setup

Create `.env` files in both backend and frontend directories with required variables.

**Backend `.env`:**
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=corp_hotel_booking
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

**Frontend `.env`:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Database Setup

```bash
mysql -u root -p
CREATE DATABASE corp_hotel_booking;
USE corp_hotel_booking;
source backend/database/schema.sql;
```

### Development

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or separately:

```bash
npm run dev:backend  # http://localhost:5000
npm run dev:frontend # http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

## API Documentation

See [backend/API.md](backend/API.md) for detailed API endpoints.

## Color Theme

The application uses a professional corporate color palette:
- Primary: Deep Blue (#1e3a8a)
- Secondary: Teal (#0891b2)
- Accent: Gold (#f59e0b)
- Neutral: Gray Scale

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see LICENSE.md file for details.
