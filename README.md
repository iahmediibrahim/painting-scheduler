# Painting Scheduler

A full-stack application for scheduling painting services, built with Next.js and Express.

## Project Structure

- `src/` - Frontend Next.js application
- `server/` - Backend Express API server

## Installation

### Frontend (Next.js)

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

### Backend (Express)

```bash
# Navigate to server directory
cd server

# Install dependencies
pnpm install

# Run development server
node index.js
```

The backend API will be available at [http://localhost:3001](http://localhost:3001).

## Features

- Customer booking management
- Painter availability scheduling
- Automatic painter assignment based on ratings
- Closest available slot suggestions

## API Documentation

API documentation is available at [http://localhost:3001/api-docs](http://localhost:3001/api-docs) when the server is running.

### Key Endpoints

#### Users

- `GET /api/users/painters` - Get all painters
- `GET /api/users/customers` - Get all customers
- `POST /api/users/painters` - Create a new painter
- `POST /api/users/customers` - Create a new customer

#### Bookings

- `GET /api/bookings` - Get bookings (filter by userId and userType)
- `POST /api/bookings/request` - Create a booking request

#### Availability

- `GET /api/availability` - Get painter availability
- `POST /api/availability` - Add new availability
- `DELETE /api/availability/:id` - Delete availability

# painting-scheduler
