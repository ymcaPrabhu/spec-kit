import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { RegisterForm } from './components/RegisterForm';
import { LoginForm } from './components/LoginForm';
import { PasswordResetForm } from './components/PasswordResetForm';

function App() {
  const { user, loading, error, register, login, logout } = useAuth();
  const [view, setView] = useState<'login' | 'register' | 'reset'>('login');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Welcome, {user.email}!</h1>
        <p>User ID: {user.id}</p>
        <p>Account created: {new Date(user.created_at).toLocaleDateString()}</p>
        <button
          onClick={logout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Authentication Demo</h1>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => setView('login')}
            style={{
              padding: '8px 16px',
              backgroundColor: view === 'login' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setView('register')}
            style={{
              padding: '8px 16px',
              backgroundColor: view === 'register' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
          <button
            onClick={() => setView('reset')}
            style={{
              padding: '8px 16px',
              backgroundColor: view === 'reset' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset Password
          </button>
        </div>
      </div>

      {view === 'login' && <LoginForm onLogin={login} error={error} />}
      {view === 'register' && <RegisterForm onRegister={register} error={error} />}
      {view === 'reset' && <PasswordResetForm />}
    </div>
  );
}

export default App;
