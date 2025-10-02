import { useState, useEffect } from 'react';
import { User } from '../types/auth';
import * as api from '../services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { user } = await api.getCurrentUser();
      setUser(user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(email: string, password: string) {
    try {
      setError(null);
      const response = await api.register(email, password);
      if (response.user) {
        setUser(response.user);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    }
  }

  async function handleLogin(email: string, password: string) {
    try {
      setError(null);
      const response = await api.login(email, password);
      if (response.user) {
        setUser(response.user);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  }

  async function handleLogout() {
    try {
      setError(null);
      await api.logout();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    }
  }

  return {
    user,
    loading,
    error,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
  };
}
