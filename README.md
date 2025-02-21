# Ride-Hailing Application Backend

A robust Node.js backend application for a ride-hailing service featuring user authentication, real-time cab tracking, and order management.

## 🚀 Features

- User Authentication (Register/Login)
- JWT-based Authorization
- Cab Listing with Geospatial Queries
- Order Creation and Real-time Tracking
- Comprehensive Error Handling
- Automated Testing Suite

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Testing**: Jest & Supertest


## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Postman](https://www.postman.com/)

## Setup

1. Clone the repository:
   ```sh
   git clone <repo_url>
   cd <repo_folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure MongoDB:
   ```env
   MONGODB_TEST_URI=mongodb://localhost:27017/cab_booking_test
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### 1. Register a New User
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "+1234567890"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Message",
    "token": "<JWT_TOKEN>"
  }
  ```

### 2. Login User
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "<JWT_TOKEN>"
  }
  ```

### 3. List Available Cabs
- **Endpoint:** `GET /api/cabs`
- **Query Parameters:**
  ```json
  {
    "latitude": 40.7789,
    "longitude": -73.9667,
    "radius": 5000
  }
  ```
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response:**
  ```json
  {
    "cabs": [
      {
        "_id": "<cabId>",
        "driverName": "John Doe",
        "vehicleNumber": "ABC123",
        "vehicleType": "sedan",
        "isAvailable": true
      }
    ]
  }
  ```

### 4. Create an Order
- **Endpoint:** `POST /api/orders`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Request Body:**
  ```json
  {
    "cabId": "<cabId>",
    "pickup": [-73.9667, 40.7789],
    "dropoff": [-73.9669, 40.7791],
    "fare": 25.50
  }
  ```
- **Response:**
  ```json
  {
    "order": {
      "_id": "<orderId>",
      ....
      "status": "pending"
    }
  }
  ```

### 5. Track an Order
- **Endpoint:** `GET /api/orders/<orderId>/track`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response:**
  ```json
  {
    "order": {
      "_id": "<orderId>",
      "status": "pending"
    }
  }
  ```


## Conclusion

You can use Postman to test these endpoints by setting up requests with the appropriate method, headers, and body data. Make sure to replace `<JWT_TOKEN>`, `<cabId>`, and `<orderId>` with actual values from API responses.

