import { AuthResponse, User } from '../types/auth';

const API_BASE_URL = '/api';

/**
 * API client with credentials for session cookies
 * Maps to: Session-based authentication with secure cookies
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Include cookies in requests
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

/**
 * User registration
 * Maps to: User can register with email and password
 */
export async function register(email: string, password: string): Promise<AuthResponse> {
  return apiCall<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * User login
 * Maps to: User can login with email and password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiCall<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * User logout
 * Maps to: User can logout
 */
export async function logout(): Promise<AuthResponse> {
  return apiCall<AuthResponse>('/auth/logout', {
    method: 'POST',
  });
}

/**
 * Request password reset
 * Maps to: User can reset password via email
 */
export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  return apiCall<AuthResponse>('/auth/reset-password-request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Reset password with token
 * Maps to: User can reset password via email
 */
export async function resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
  return apiCall<AuthResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<{ user: User }> {
  return apiCall<{ user: User }>('/auth/me');
}
