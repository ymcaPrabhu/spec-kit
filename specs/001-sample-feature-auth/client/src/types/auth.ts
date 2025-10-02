export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
  token?: string; // For password reset testing
}

export interface AuthError {
  error: string;
}
