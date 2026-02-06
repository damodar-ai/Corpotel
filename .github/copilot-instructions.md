# Corporate Hotel Booking Application - Development Guide

## Project Overview

Full-stack monolithic hotel booking system with React frontend and Node.js/Express backend.

## Setup Instructions

### Backend Setup
- Framework: Express.js with TypeScript
- Database: MySQL 8.0
- Authentication: JWT tokens
- Key dependencies: express, mysql2, jsonwebtoken, cors, dotenv

### Frontend Setup
- Framework: React 18 with TypeScript
- Styling: Tailwind CSS + corporate theme
- State Management: React Context/Hooks
- HTTP Client: Axios
- Key dependencies: react, axios, react-router-dom, tailwindcss

### Database
- Use MySQL connection pool
- Run migrations from backend/database/schema.sql
- Support for users, hotels, rooms, bookings, and corporate clients

## Development Workflow

1. Backend development: `npm run dev:backend`
2. Frontend development: `npm run dev:frontend`
3. Or both together: `npm run dev`

## Key API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/hotels` - List hotels
- `GET /api/hotels/:id/rooms` - Get room availability
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/admin/dashboard` - Admin statistics

## Corporate Color Theme

- Primary Blue: #1e3a8a
- Secondary Teal: #0891b2
- Accent Gold: #f59e0b
- Neutral Gray: #6b7280
- Success Green: #10b981
- Warning Orange: #f97316
- Error Red: #ef4444
