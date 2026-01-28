# Newscard Backend API

Backend server for the Newscard application with user authentication, credit system, and feature management.

## Tech Stack

- **Node.js** + **Express** - Server framework
- **MySQL** - Database (XAMPP)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Features (Phase 1)

✅ User Authentication (Register/Login)
✅ JWT Token Management
✅ Password Security (hashing, failed attempt tracking)
✅ User Credit System (daily limits based on plan)
✅ Feature Flags (batch processing, custom cards, API access)
✅ Database Migrations
✅ Rate Limiting
✅ Security Headers

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=newscard_db

JWT_SECRET=your-super-secret-jwt-key-change-this
```

### 3. Start XAMPP

- Start Apache and MySQL from XAMPP Control Panel
- Open phpMyAdmin: http://localhost/phpmyadmin
- Create database: `newscard_db`

### 4. Run Migrations

```bash
npm run migrate
```

This will create all required tables:
- `users` - User accounts and subscription info
- `user_credits` - Daily credit limits and feature access
- `card_generations` - Log of all card generations
- `refresh_tokens` - JWT refresh tokens
- `migrations` - Migration tracking

### 5. Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on: http://localhost:5000

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "plan": "Free",
      "created_at": "2024-01-28T..."
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "plan": "Free"
    },
    "credits": {
      "daily_limit": 5,
      "cards_generated_today": 0,
      "last_reset_date": "2024-01-28"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <accessToken>
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "plan": "Free",
      "plan_status": "active",
      "status": "active"
    },
    "credits": {
      "daily_limit": 5,
      "cards_generated_today": 0,
      "total_cards_generated": 0,
      "batch_processing_enabled": false,
      "custom_cards_enabled": false,
      "api_access_enabled": false
    },
    "features": {
      "batchProcessing": false,
      "customCards": false,
      "apiAccess": false
    }
  }
}
```

## Database Schema

### Users Table
- Account information
- Subscription plan (Free, Basic, Premium)
- Plan status and dates
- Security features (failed logins, account locking)

### User Credits Table
- Daily generation limits
- Current usage tracking
- Feature flags per user
- Automatic daily reset

### Card Generations Table
- Complete log of all card generations
- Download tracking and access control
- Security tokens for file access
- Prevents unauthorized downloads

## Plan Limits

| Feature | Free | Basic | Premium |
|---------|------|-------|---------|
| Cards per day | 5 | 100 | Unlimited |
| Custom Cards | ❌ | ✅ | ✅ |
| Batch Processing | ❌ | ❌ | ✅ |
| API Access | ❌ | ❌ | ✅ |

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Failed login attempt tracking
- ✅ Account locking (5 failed attempts → 15min lock)
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Security headers (helmet)
- ✅ Input validation
- ✅ SQL injection protection (parameterized queries)

## Next Steps (Phase 2)

- [ ] Credit checking middleware
- [ ] Card generation endpoints
- [ ] File upload and storage
- [ ] Download security with access tokens
- [ ] Daily credit reset cron job
- [ ] Stripe payment integration
- [ ] Plan upgrade/downgrade logic
- [ ] Admin endpoints

## Development

### Run Migrations
```bash
npm run migrate
```

### Check Database
Open phpMyAdmin: http://localhost/phpmyadmin
Select database: newscard_db

### View Logs
Server logs will show in console with request/response info in development mode.

## Troubleshooting

**Database connection failed:**
- Ensure XAMPP MySQL is running
- Check database credentials in .env
- Verify database exists in phpMyAdmin

**Migration errors:**
- Drop all tables in phpMyAdmin
- Run migrations again: `npm run migrate`

**Port already in use:**
- Change PORT in .env file
- Or stop other services using port 5000
