# Database Documentation

## Overview

CorpHotel uses MySQL 8.0 with the following key tables:

## Schema Diagram

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────────┐
│   users     │────▶│   HotelDetails   │────▶│    room_types     │
│             │     │                  │     │                   │
│ id          │     │ Id               │     │ Id                │
│ email       │     │ userId (FK)      │     │ HotelDetails_Id   │
│ password    │     │ HotelName        │     │ Name              │
│ identityType│     │ City             │     │ BasePrice         │
│ role        │     │ StarCategory     │     │ CorporatePrice    │
└─────────────┘     └──────────────────┘     └───────────────────┘
      │
      │
      ▼
┌──────────────────┐     ┌───────────────┐
│ CorporateDetails │     │   bookings    │
│                  │     │               │
│ Id               │     │ Id            │
│ userId (FK)      │     │ UserId        │
│ CompanyName      │     │ HotelDetails_Id│
│ IndustryType     │     │ RoomTypes_Id  │
└──────────────────┘     │ BookingStatus │
                         └───────────────┘
```

## Tables

### users
Main user table for authentication.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| email | VARCHAR(255) | Unique email |
| password | VARCHAR(255) | bcrypt hash |
| identityType | ENUM | Hotel/Corporate |
| role | VARCHAR(20) | admin/user |

### HotelDetails
Hotel profile information.

| Column | Type | Description |
|--------|------|-------------|
| Id | BIGINT | Primary key |
| userId | BIGINT | FK to users |
| HotelName | VARCHAR(255) | Hotel name |
| City | VARCHAR(100) | Location |
| StarCategory | INT | 1-5 stars |

### room_types
Room categories for each hotel.

| Column | Type | Description |
|--------|------|-------------|
| Id | BIGINT | Primary key |
| HotelDetails_Id | BIGINT | FK to hotel |
| Name | VARCHAR(100) | Room type name |
| BasePrice | DECIMAL | Standard price |
| CorporatePrice | DECIMAL | Discounted price |

### bookings
Booking requests and reservations.

| Column | Type | Description |
|--------|------|-------------|
| Id | BIGINT | Primary key |
| BookingNumber | VARCHAR(50) | Unique reference |
| BookingStatus | ENUM | pending/confirmed/rejected/cancelled |
| CheckInDate | DATE | Arrival date |
| CheckOutDate | DATE | Departure date |

## Indexes

Existing indexes for performance:
- `idx_users_email` on users(email)
- `idx_hotel_city` on HotelDetails(City)
- `idx_bk_dates` on bookings(CheckInDate, CheckOutDate)
- `idx_bk_status` on bookings(BookingStatus)

## Setup Commands

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE corp_hotel_booking;"

# Run schema
mysql -u root -p corp_hotel_booking < backend/database/schema.sql

# Backup database
mysqldump -u root -p corp_hotel_booking > backup.sql

# Restore from backup
mysql -u root -p corp_hotel_booking < backup.sql
```

## Connection Pool

Configuration in `backend/database/connection.ts`:
- Pool size: 10 connections
- Wait for connections: true
- Queue limit: unlimited
