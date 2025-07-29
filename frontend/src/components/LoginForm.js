import React, { useState } from 'react';
import { login, register } from '../api';

export default function LoginForm({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await register(username, password);
      }
      const res = await login(username, password);
      localStorage.setItem('token', res.data.token);
      onLoggedIn();
    } catch (e) {
      setError('Authentication failed');
    }
  };

  return (
    <div>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>{isRegister ? 'Register' : 'Login'}</button>
      <button onClick={() => setIsRegister(prev => !prev)}>
        {isRegister ? 'Have an account? Login' : 'Need an account? Register'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
