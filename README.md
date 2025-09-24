# Painting Scheduler

A full-stack application for scheduling painting services, built with Next.js and NestJS.

## Project Structure

- `src/` - Frontend Next.js application
- `server/` - Legacy Express API server (deprecated)
- `server-nest/` - New NestJS backend with Prisma ORM

## Installation

### Frontend (Next.js)

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The frontend will be available at [http://localhost:3002](http://localhost:3002).

### Backend (NestJS)

```bash
# Navigate to server-nest directory
cd server-nest

# Install dependencies
npm install

# Create a .env file with the following content:
# DATABASE_URL="postgresql://username:password@localhost:5432/..."
# DIRECT_URL="postgresql://username:password@localhost:5432/..."
# JWT_SECRET="your-secret-jwt-token"
# PORT=3001

# Run development server
npm run start:dev
```

The NestJS backend API will be available at [http://localhost:3001](http://localhost:3001).

## Features

- User authentication with JWT and role-based access control
- Customer booking management
- Painter availability scheduling
- Automatic painter assignment based on availability
- Intelligent closest available slot suggestions
- Real-time loading states and error handling
- Responsive UI for both painters and customers

## NestJS Backend Architecture

The new NestJS backend provides several improvements:

- Modular architecture with clear separation of concerns
- Type-safe database access with Prisma ORM
- Robust authentication and authorization
- Comprehensive validation with DTOs
- Improved error handling with custom exceptions
- PostgreSQL database support via Supabase

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user (painter or customer)
- `POST /auth/login` - Login and receive JWT token

### Users

- `GET /users/painters` - Get all painters
- `GET /users/me` - Get current user profile

### Bookings

- `GET /bookings` - Get bookings (filtered by user role)
- `POST /bookings` - Create a new booking (with automatic closest slot finding)
- `GET /bookings/:id` - Get booking details

### Availability

- `GET /availabilities` - Get painter availability
- `POST /availabilities` - Add new availability
- `DELETE /availabilities/:id` - Delete availability

## Environment Setup

The application requires environment variables for database connection and JWT authentication. See the `.env.example` files in both frontend and backend directories.
