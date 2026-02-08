
---

# Weather Forecast Website 

## Course

Web Technologies 2

---

## Project Overview

This project is a **Weather Forecast Website** with authentication and user-specific data storage.
The backend is built with **Node.js, Express, and MongoDB**, while the frontend is implemented using **HTML, CSS, and Vanilla JavaScript** and served by the Express server.

The application allows users to:

* register and log in
* access protected routes using JWT authentication
* manage their user profile
* save favorite locations (cities)
* request weather forecasts for saved locations using an external Weather API

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Token)
* bcryptjs
* Joi
* Axios

### Frontend

* HTML
* CSS
* Vanilla JavaScript (Fetch API)

---

## Project Structure

```
weather-forecast/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── resource.controller.js
│   │   │   └── weather.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validate.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Favorite.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── resource.routes.js
│   │   │   └── weather.routes.js
│   │   ├── validators/
│   │   │   ├── auth.validators.js
│   │   │   ├── user.validators.js
│   │   │   └── resource.validators.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── client/
│   ├── index.html
│   ├── app.html
│   ├── auth.js
│   ├── app.js
│   └── styles.css
│
└── README.md
```

---

## Features

### Authentication

* User registration with password hashing (bcrypt)
* User login
* JWT-based authentication for protected routes

### User Profile (Protected)

* Get current user profile
* Update current user profile

### Favorites (Second Resource – Protected CRUD)

Favorites are user-specific and stored in MongoDB.

* Create favorite location
* Get all favorites
* Get a favorite by ID
* Update a favorite
* Delete a favorite

### Weather Forecast (External API)

* Fetch weather forecast by latitude and longitude using an external Weather API

---

## Environment Variables

Create a `.env` file inside the `server/` directory based on `.env.example`.

Example `.env.example`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/weather_app
JWT_SECRET=super_secret_change_me
WEATHER_API_KEY=your_api_key_here
WEATHER_API_BASE=https://api.openweathermap.org/data/2.5
```

⚠️ The `.env` file is not committed to GitHub for security reasons.

---

## Installation and Running the Project

### 1. Install dependencies

```
cd server
npm install
```

### 2. Configure environment variables

Create `server/.env` and fill in required values.

### 3. Run MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Start the server

```
npm run dev
```

The server will run at:

```
http://localhost:5000
```

Health check:

```
http://localhost:5000/health
```

Frontend:

* Auth page: `http://localhost:5000`
* Main app: `http://localhost:5000/app.html`

---

## API Endpoints

### Authentication (Public)

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| POST   | /api/auth/register | Register new user          |
| POST   | /api/auth/login    | Login user and receive JWT |

### User (Private)

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| GET    | /api/users/profile | Get user profile    |
| PUT    | /api/users/profile | Update user profile |

### Favorites / Resource (Private)

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| POST   | /api/resource     | Create favorite    |
| GET    | /api/resource     | Get all favorites  |
| GET    | /api/resource/:id | Get favorite by ID |
| PUT    | /api/resource/:id | Update favorite    |
| DELETE | /api/resource/:id | Delete favorite    |

### Weather (External API)

| Method | Endpoint                        | Description          |
| ------ | ------------------------------- | -------------------- |
| GET    | /api/weather/forecast?lat=&lon= | Get weather forecast |

---

## Authentication

Protected endpoints require a JWT token in the request headers:

```
Authorization: Bearer <TOKEN>
```

The token is returned after successful registration or login.

---

## Validation and Error Handling

* Joi is used for request validation
* Global error handler handles errors consistently
* Proper HTTP status codes are returned (400, 401, 404, 500)

---

## Notes

* Frontend is intentionally simple and used for demonstration
* Favorites are linked to the authenticated user
* Secrets and API keys are stored only in environment variables
