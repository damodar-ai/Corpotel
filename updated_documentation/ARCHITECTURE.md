# System Architecture

## Overview

CorpHotel is a full-stack web application using a 3-tier architecture.

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │              React SPA (Vite)                     │  │
│  │  • TailwindCSS for styling                        │  │
│  │  • React Router for navigation                    │  │
│  │  • Axios for API calls                            │  │
│  │  • Context API for state management               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS / REST API
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     API LAYER                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Express.js Server                    │  │
│  │  • JWT Authentication                             │  │
│  │  • Rate Limiting                                  │  │
│  │  • Gzip Compression                               │  │
│  │  • Helmet Security Headers                        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ MySQL Protocol
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │              MySQL Database                       │  │
│  │  • Connection Pooling (10 connections)            │  │
│  │  • Indexed queries                                │  │
│  │  • Foreign key relationships                      │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Component Diagram

```
Frontend (React)
├── Pages (lazy-loaded)
│   ├── HomePage
│   ├── LoginPage
│   ├── CorporateDashboard
│   ├── HotelDashboard
│   ├── BrowseHotelsPage
│   └── ... (14 total)
├── Components (shared)
│   ├── Header
│   ├── Footer
│   ├── ProtectedRoute
│   └── RoleBasedRoute
├── Context
│   └── AuthContext
├── Services
│   └── API layer (Axios)
└── Hooks
    └── useAuth

Backend (Express)
├── Routes
│   ├── /api/auth
│   ├── /api/bookings
│   ├── /api/browse-hotels
│   ├── /api/profiles
│   ├── /api/posts
│   ├── /api/room-types
│   ├── /api/chat
│   └── /api/users
├── Middleware
│   ├── authMiddleware (JWT)
│   ├── rateLimiter
│   └── helmet
├── Database
│   ├── Connection pool
│   └── Query executor
└── Utils
    └── Helpers (token generation, etc.)
```

---

## Database Schema

```
users (1)─────────┐
    │             │
    │(1:1)        │(1:N)
    ▼             ▼
HotelDetails   CorporateDetails
    │             │
    │(1:N)        │(1:N)
    ▼             ▼
room_types     bookings◄───────┐
    │             │            │
    │(1:N)        │            │
    └─────────────┴────────────┘

HotelPosts (1:N from HotelDetails)
Chat (N:N between Corporate and Hotel)
```

---

## Data Flow

### Booking Request Flow
```
1. Corporate User → BrowseHotelsPage → GET /api/browse-hotels
2. Corporate User → Select hotel → GET /api/browse-hotels/:id
3. Corporate User → BookingRequestPage → POST /api/bookings
4. Hotel User → HotelBookingsPage → GET /api/bookings
5. Hotel User → Approve/Reject → PUT /api/bookings/:id/approve
```

### Authentication Flow
```
1. User → LoginPage → POST /api/auth/login
2. Server → Validate credentials → Generate JWT
3. JWT stored in localStorage
4. All API requests include Authorization header
5. Server middleware validates JWT on protected routes
```

---

## Performance Optimizations

| Layer | Optimization |
|-------|--------------|
| Frontend | Route-based code splitting (React.lazy) |
| Frontend | Vendor chunk splitting (Vite) |
| Backend | Gzip compression |
| Backend | Connection pooling |
| Database | Indexed columns |
