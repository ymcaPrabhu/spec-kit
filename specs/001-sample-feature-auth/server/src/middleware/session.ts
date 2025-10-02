import session from 'express-session';

/**
 * Session middleware with secure cookie settings
 * Maps to: Session-based authentication with secure cookies
 * Maps to: Sessions must expire after 24 hours of inactivity
 */
export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    sameSite: 'strict' // CSRF protection
  }
});

/**
 * Extend Express session type to include user
 */
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}
