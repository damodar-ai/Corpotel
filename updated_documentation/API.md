# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://api.corphotel.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Rate Limiting

| Endpoint Pattern | Limit |
|-----------------|-------|
| `/api/auth/*` | 5 requests / 15 min |
| `/api/*` (general) | 100 requests / 15 min |

---

## Endpoints

### Authentication

#### POST /api/auth/register
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user",
    "identityType": null,
    "isProfileCompleted": false
  }
}
```

#### POST /api/auth/login
Authenticate existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):** Same as register.

#### GET /api/auth/google/url
Get Google OAuth authorization URL.

**Response:**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

#### POST /api/auth/google/callback
Complete Google OAuth flow.

**Request:**
```json
{
  "code": "authorization_code_from_google"
}
```

---

### Users

#### PUT /api/users/set-identity
Set user identity type (Hotel or Corporate).

**Auth Required:** Yes

**Request:**
```json
{
  "identityType": "Hotel" | "Corporate"
}
```

---

### Profiles

#### POST /api/profiles/hotel
Create/update hotel profile.

**Auth Required:** Yes

**Request:**
```json
{
  "hotelName": "Grand Hotel",
  "city": "New York",
  "address": "123 Main St",
  "contactNumber": "+1234567890",
  "contactEmail": "info@grandhotel.com",
  "starCategory": 4
}
```

#### POST /api/profiles/corporate
Create/update corporate profile.

**Auth Required:** Yes

**Request:**
```json
{
  "companyName": "Acme Corp",
  "industryType": "Technology",
  "officeAddress": "456 Business Ave",
  "contactNumber": "+1234567890"
}
```

---

### Browse Hotels

#### GET /api/browse-hotels
Search hotels with filters.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| city | string | Filter by city |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| minStars | number | Minimum star rating |
| guests | number | Minimum capacity |
| sortBy | string | rating, price-low, price-high, name |
| page | number | Page number (default: 1) |
| limit | number | Results per page (default: 12) |

**Response:**
```json
{
  "data": [...hotels],
  "cities": ["New York", "Los Angeles"],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 12,
    "totalPages": 5
  }
}
```

#### GET /api/browse-hotels/:id
Get hotel details with room types.

---

### Bookings

#### POST /api/bookings
Create booking request (Corporate users).

**Auth Required:** Yes (Corporate only)

**Request:**
```json
{
  "hotelDetailsId": 1,
  "roomTypeId": 5,
  "checkInDate": "2024-03-15",
  "checkOutDate": "2024-03-18",
  "guestName": "John Doe",
  "guestEmail": "john@company.com",
  "roomQuantity": 2
}
```

#### GET /api/bookings
Get user's bookings.

#### PUT /api/bookings/:id/approve
Approve booking (Hotel users).

#### PUT /api/bookings/:id/reject
Reject booking (Hotel users).

#### PUT /api/bookings/:id/cancel
Cancel booking.

---

### Room Types

#### GET /api/room-types
Get room types for current hotel.

#### POST /api/room-types
Create room type.

#### PUT /api/room-types/:id
Update room type.

#### DELETE /api/room-types/:id
Delete room type.

---

### Posts

#### GET /api/posts
Get hotel posts (with pagination).

#### POST /api/posts
Create post (Hotel users).

#### PUT /api/posts/:id
Update post.

#### DELETE /api/posts/:id
Delete post.

---

### Chat

#### POST /api/chat/send
Send chat message.

**Request:**
```json
{
  "recipientId": 5,
  "message": "Hello, I have a question...",
  "hotelPostId": 10
}
```

#### GET /api/chat/history/:recipientId
Get chat history with a user.

#### GET /api/chat/inbox
Get chat inbox with all conversations.

---

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error |

## cURL Examples

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Test123!"}'

# Browse hotels
curl http://localhost:5000/api/browse-hotels?city=Mumbai&minStars=4

# Create booking (with auth)
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hotelDetailsId":1,"roomTypeId":2,"checkInDate":"2024-03-15","checkOutDate":"2024-03-18"}'
```
