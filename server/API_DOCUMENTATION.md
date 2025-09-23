# Painting Scheduler API Documentation

## Base URL

All API endpoints are relative to: `http://localhost:3001`

## Authentication

Currently, the API does not require authentication.

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK` - Request succeeded
- `400 Bad Request` - Invalid input parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error responses follow this format:
```json
{
  "error": "Error message description"
}
```

## API Endpoints

### Users

#### Get All Painters

Retrieves a list of all painters in the system.

- **URL**: `/api/users/painters`
- **Method**: `GET`
- **Response**: Array of painter objects
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "rating": number,
      "type": "painter"
    }
  ]
  ```

#### Get All Customers

Retrieves a list of all customers in the system.

- **URL**: `/api/users/customers`
- **Method**: `GET`
- **Response**: Array of customer objects
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "type": "customer"
    }
  ]
  ```

#### Create Painter

Creates a new painter in the system.

- **URL**: `/api/users/painters`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "string",
    "rating": number
  }
  ```
- **Response**: Created painter object
  ```json
  {
    "id": "string",
    "name": "string",
    "rating": number,
    "type": "painter"
  }
  ```

#### Create Customer

Creates a new customer in the system.

- **URL**: `/api/users/customers`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "string"
  }
  ```
- **Response**: Created customer object
  ```json
  {
    "id": "string",
    "name": "string",
    "type": "customer"
  }
  ```

### Availability

#### Get Painter Availability

Retrieves availability slots for painters.

- **URL**: `/api/availability`
- **Method**: `GET`
- **Query Parameters**:
  - `painterId` (optional): Filter by painter ID
- **Response**: Array of availability objects
  ```json
  [
    {
      "id": "string",
      "painterId": "string",
      "start": "ISO date string",
      "end": "ISO date string"
    }
  ]
  ```

#### Add Availability

Adds a new availability slot for a painter.

- **URL**: `/api/availability`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "painterId": "string",
    "start": "ISO date string",
    "end": "ISO date string"
  }
  ```
- **Response**: Created availability object
  ```json
  {
    "id": "string",
    "painterId": "string",
    "start": "ISO date string",
    "end": "ISO date string"
  }
  ```

#### Delete Availability

Deletes an availability slot.

- **URL**: `/api/availability/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id`: Availability ID
- **Response**: Success message
  ```json
  {
    "message": "Availability deleted successfully"
  }
  ```

### Bookings

#### Get Bookings

Retrieves bookings filtered by user ID and type.

- **URL**: `/api/bookings`
- **Method**: `GET`
- **Query Parameters**:
  - `userId`: User ID (painter or customer)
  - `userType`: Type of user (`painter` or `customer`)
- **Response**: Array of booking objects with related user details
  ```json
  [
    {
      "id": "string",
      "painterId": "string",
      "customerId": "string",
      "start": "ISO date string",
      "end": "ISO date string",
      "painter": {
        "id": "string",
        "name": "string",
        "rating": number
      },
      "customer": {
        "id": "string",
        "name": "string"
      }
    }
  ]
  ```

#### Create Booking Request

Creates a new booking request, finding the best available painter.

- **URL**: `/api/bookings/request`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "customerId": "string",
    "start": "ISO date string",
    "end": "ISO date string",
    "preferredPainterId": "string" (optional)
  }
  ```
- **Response**: Created booking object with painter details
  ```json
  {
    "id": "string",
    "painterId": "string",
    "customerId": "string",
    "start": "ISO date string",
    "end": "ISO date string",
    "painter": {
      "id": "string",
      "name": "string",
      "rating": number
    }
  }
  ```

## Helper Endpoints

#### Find Closest Available Slot

Finds the closest available slot to the requested time period.

- **URL**: `/api/closest-slot`
- **Method**: `GET`
- **Query Parameters**:
  - `start`: Start time (ISO date string)
  - `end`: End time (ISO date string)
  - `painterId` (optional): Preferred painter ID
- **Response**: Closest available slot with painter details
  ```json
  {
    "slot": {
      "id": "string",
      "painterId": "string",
      "start": "ISO date string",
      "end": "ISO date string"
    },
    "painter": {
      "id": "string",
      "name": "string",
      "rating": number
    }
  }
  ```