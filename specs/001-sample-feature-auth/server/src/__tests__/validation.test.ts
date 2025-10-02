import { isValidEmail, isValidPassword } from '../utils/validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for passwords with 8+ characters', () => {
      expect(isValidPassword('12345678')).toBe(true);
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('VeryLongPassword123')).toBe(true);
    });

    it('should return false for passwords with less than 8 characters', () => {
      expect(isValidPassword('1234567')).toBe(false);
      expect(isValidPassword('short')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });
});
