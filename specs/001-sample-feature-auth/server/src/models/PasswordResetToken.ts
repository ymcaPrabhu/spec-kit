import { v4 as uuidv4 } from 'uuid';
import { database } from '../database/connection';

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export class PasswordResetTokenModel {
  /**
   * Create a password reset token that expires after 1 hour
   * Maps to: Password reset tokens must expire after 1 hour
   */
  static async create(userId: string): Promise<PasswordResetToken> {
    const id = uuidv4();
    const token = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    await database.run(
      'INSERT INTO password_reset_tokens (id, user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?, ?)',
      [id, userId, token, expiresAt.toISOString(), now.toISOString()]
    );

    return {
      id,
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
      created_at: now.toISOString()
    };
  }

  /**
   * Find a valid (non-expired) token
   */
  static async findValidToken(token: string): Promise<PasswordResetToken | undefined> {
    const now = new Date().toISOString();
    return database.get<PasswordResetToken>(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > ?',
      [token, now]
    );
  }

  /**
   * Delete a token after use
   */
  static async delete(token: string): Promise<void> {
    await database.run('DELETE FROM password_reset_tokens WHERE token = ?', [token]);
  }

  /**
   * Delete all tokens for a user
   */
  static async deleteByUserId(userId: string): Promise<void> {
    await database.run('DELETE FROM password_reset_tokens WHERE user_id = ?', [userId]);
  }
}
