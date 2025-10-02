import { sanitizeLogData } from '../utils/logger';

describe('Logger Utilities', () => {
  describe('sanitizeLogData', () => {
    it('should redact password fields', () => {
      const data = {
        email: 'test@example.com',
        password: 'secretpassword',
        username: 'testuser'
      };

      const sanitized = sanitizeLogData(data);

      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.username).toBe('testuser');
    });

    it('should redact password_hash fields', () => {
      const data = {
        id: '123',
        email: 'test@example.com',
        password_hash: 'hashedvalue'
      };

      const sanitized = sanitizeLogData(data);

      expect(sanitized.password_hash).toBe('[REDACTED]');
    });

    it('should redact token fields', () => {
      const data = {
        userId: '123',
        token: 'secret-token-value'
      };

      const sanitized = sanitizeLogData(data);

      expect(sanitized.token).toBe('[REDACTED]');
    });

    it('should handle non-object inputs', () => {
      expect(sanitizeLogData('string')).toBe('string');
      expect(sanitizeLogData(123)).toBe(123);
      expect(sanitizeLogData(null)).toBe(null);
    });
  });
});
