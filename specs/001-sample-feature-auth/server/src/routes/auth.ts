import { Router, Request, Response } from 'express';
import { UserModel } from '../models/User';
import { PasswordResetTokenModel } from '../models/PasswordResetToken';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { logInfo, logError } from '../utils/logger';

const router = Router();

/**
 * User registration endpoint
 * Maps to: User can register with email and password
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password
    if (!password || !isValidPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const startTime = Date.now();
    const user = await UserModel.create({ email, password });
    const duration = Date.now() - startTime;

    logInfo('User registered', { userId: user.id, email: user.email, duration });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    logError('Registration failed', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * User login endpoint with session creation
 * Maps to: User can login with email and password
 * Maps to: Login must complete within 2 seconds
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Verify credentials
    const user = await UserModel.verifyCredentials(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user.id;

    const duration = Date.now() - startTime;
    logInfo('User logged in', { userId: user.id, duration });

    // Check if login completed within 2 seconds
    if (duration > 2000) {
      logError('Login exceeded 2-second target', { duration });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    logError('Login failed', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * User logout endpoint with session destruction
 * Maps to: User can logout
 */
router.post('/logout', (req: Request, res: Response) => {
  const userId = req.session.userId;

  req.session.destroy((err) => {
    if (err) {
      logError('Logout failed', err);
      return res.status(500).json({ error: 'Logout failed' });
    }

    logInfo('User logged out', { userId });
    res.json({ message: 'Logout successful' });
  });
});

/**
 * Request password reset endpoint
 * Maps to: User can reset password via email
 */
router.post('/reset-password-request', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const user = await UserModel.findByEmail(email);

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If the email exists, a reset link will be sent' });
    }

    // Delete any existing tokens for this user
    await PasswordResetTokenModel.deleteByUserId(user.id);

    // Create new token
    const resetToken = await PasswordResetTokenModel.create(user.id);

    logInfo('Password reset requested', { userId: user.id });

    // In a real application, send email here
    // For now, we'll return the token in the response (NOT for production)
    res.json({
      message: 'If the email exists, a reset link will be sent',
      // Remove this in production - only for testing
      token: resetToken.token
    });
  } catch (error) {
    logError('Password reset request failed', error);
    res.status(500).json({ error: 'Password reset request failed' });
  }
});

/**
 * Reset password with token endpoint
 * Maps to: User can reset password via email
 * Maps to: Password reset tokens must expire after 1 hour
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Find valid token
    const resetToken = await PasswordResetTokenModel.findValidToken(token);

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Update password
    await UserModel.updatePassword(resetToken.user_id, newPassword);

    // Delete the token
    await PasswordResetTokenModel.delete(token);

    logInfo('Password reset successful', { userId: resetToken.user_id });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    logError('Password reset failed', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

/**
 * Get current user endpoint (protected)
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await UserModel.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    logError('Get user failed', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;
