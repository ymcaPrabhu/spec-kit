import React, { useState } from 'react';
import { isValidEmail, isValidPassword } from '../utils/validation';

interface RegisterFormProps {
  onRegister: (email: string, password: string) => Promise<void>;
  error?: string | null;
}

/**
 * Registration form component
 * Maps to: User can register with email and password
 */
export function RegisterForm({ onRegister, error }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError('');
    setSuccess(false);

    // Validate email
    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!isValidPassword(password)) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await onRegister(email, password);
      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Error is handled by parent component
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Register</h2>

      {success && (
        <div style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px' }}>
          Registration successful!
        </div>
      )}

      {(validationError || error) && (
        <div style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px' }}>
          {validationError || error}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
          Password (min 8 characters)
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
