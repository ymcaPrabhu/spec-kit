# User Authentication Feature

A complete user authentication system built with React, TypeScript, Express, and SQLite.

## Features

- User registration with email validation
- User login with session-based authentication
- Secure session management with cookies
- User logout with session destruction
- Password reset functionality with email tokens
- Password hashing with bcrypt (10+ salt rounds)
- Session expiry after 24 hours of inactivity
- Password reset tokens expire after 1 hour

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for development and bundling
- Session-based authentication with cookies

### Backend
- Node.js with Express
- TypeScript
- SQLite database
- bcrypt for password hashing
- express-session for session management

## Getting Started

### Prerequisites
- Node.js 18+ or compatible runtime
- npm or yarn

### Installation

1. Install server dependencies:
```bash
cd server
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
```

### Configuration

1. Create a `.env` file in the server directory (copy from `.env.example`):
```bash
cd server
cp .env.example .env
```

2. Update the environment variables:
```env
PORT=5000
SESSION_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
DATABASE_PATH=./database.sqlite
```

### Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. In another terminal, start the client:
```bash
cd client
npm run dev
```

3. Open your browser to `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ email: string, password: string }`

- `POST /api/auth/login` - Login with credentials
  - Body: `{ email: string, password: string }`

- `POST /api/auth/logout` - Logout and destroy session

- `GET /api/auth/me` - Get current authenticated user

- `POST /api/auth/reset-password-request` - Request password reset
  - Body: `{ email: string }`

- `POST /api/auth/reset-password` - Reset password with token
  - Body: `{ token: string, newPassword: string }`

## Security Features

- Passwords hashed with bcrypt (10 salt rounds minimum)
- Secure HTTP-only cookies for sessions
- CSRF protection with SameSite cookies
- No plaintext passwords in database or logs
- Session expiry after 24 hours
- Password reset tokens expire after 1 hour
- Email validation before registration
- Proper error handling without exposing sensitive data

## Performance Requirements

- Login completes within 2 seconds (including authentication and session creation)
- Supports 1000 concurrent users

## Testing

Run server tests:
```bash
cd server
npm test
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── database/      # Database schema and connection
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   └── package.json
│
└── README.md
```

## License

This is a sample implementation for demonstration purposes.
