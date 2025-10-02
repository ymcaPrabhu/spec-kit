import { v4 as uuidv4 } from 'uuid';
import { database } from '../database/connection';
import { hashPassword, comparePassword } from '../utils/password';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
}

export class UserModel {
  /**
   * Create a new user with hashed password
   * Maps to: User can register with email and password
   */
  static async create(data: CreateUserData): Promise<User> {
    const id = uuidv4();
    const password_hash = await hashPassword(data.password);
    const now = new Date().toISOString();

    await database.run(
      'INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [id, data.email, password_hash, now, now]
    );

    return {
      id,
      email: data.email,
      password_hash,
      created_at: now,
      updated_at: now
    };
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | undefined> {
    return database.get<User>('SELECT * FROM users WHERE email = ?', [email]);
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | undefined> {
    return database.get<User>('SELECT * FROM users WHERE id = ?', [id]);
  }

  /**
   * Verify user credentials
   * Maps to: User can login with email and password
   */
  static async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = await comparePassword(password, user.password_hash);
    return isValid ? user : null;
  }

  /**
   * Update user password
   */
  static async updatePassword(userId: string, newPassword: string): Promise<void> {
    const password_hash = await hashPassword(newPassword);
    const updated_at = new Date().toISOString();

    await database.run(
      'UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?',
      [password_hash, updated_at, userId]
    );
  }
}
