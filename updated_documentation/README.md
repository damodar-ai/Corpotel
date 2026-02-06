# CorpHotel - Corporate Hotel Booking Platform

A full-stack web application for corporate hotel booking management, connecting businesses with hotels for streamlined reservation processes.

## 🎯 Overview

CorpHotel enables:
- **Corporate Users**: Browse hotels, view corporate rates, request bookings
- **Hotel Users**: Manage room types, posts, and approve/reject bookings
- **Chat System**: Direct communication between corporates and hotels

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MySQL 8.0 |
| Authentication | JWT, Google OAuth 2.0 |
| Security | Helmet, Rate Limiting, bcrypt |

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn
- Google Cloud Console account (for OAuth)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-org/corp-hotel.git
cd corp-hotel
```

### 2. Install Dependencies
```bash
# Root dependencies
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Environment Setup
```bash
# Copy example env files
cp .env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit with your values
```

### 4. Database Setup
```bash
# Create database and run schema
mysql -u root -p < backend/database/schema.sql
```

### 5. Run Development
```bash
# From root directory
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
corp-hotel/
├── backend/
│   ├── database/         # DB connection & schema
│   ├── middleware/       # Auth middleware
│   ├── routes/           # API endpoints
│   ├── utils/            # Helper functions
│   └── server.ts         # Express app entry
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   └── services/     # API service layer
│   └── vite.config.ts    # Vite configuration
└── updated_documentation/ # This documentation
```

## 🔐 Environment Variables

See [.env.example](../.env.example) for all required variables.

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Secret for JWT signing |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |

## 🧪 Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📚 Documentation

- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Security](./SECURITY.md)
- [Architecture](./ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

## 📞 Support

- Issues: [GitHub Issues](https://github.com/your-org/corp-hotel/issues)
- Email: support@corphotel.com
