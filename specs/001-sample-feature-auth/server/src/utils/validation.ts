/**
 * Email validation utility
 * Maps to: System validates email format before accepting registration
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation utility
 */
export function isValidPassword(password: string): boolean {
  // Minimum 8 characters
  return password.length >= 8;
}
