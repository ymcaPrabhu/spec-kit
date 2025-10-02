import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Meets requirement: minimum 10 salt rounds

/**
 * Hash a password using bcrypt with minimum 10 salt rounds
 * Maps to: Passwords must be hashed using bcrypt with minimum 10 salt rounds before storage
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plaintext password with a hashed password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
