import { Request, Response, NextFunction } from 'express';

/**
 * Authentication guard middleware
 * Maps to: User can login with email and password (protected routes)
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
