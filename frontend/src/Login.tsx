import React, { useState } from 'react';
import "./App.css"
import userService from './services/userService';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const jwt = await userService.login(username, password)
    localStorage.setItem('token', jwt.token);
    location.reload();
  }

  return (
    <div className="login-container">
    <div className="login-card">
      <h2 className="login-title">Log In</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <br/>
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button 
          type="submit" 
          className="login-btn-main"
        >
          Log In
        </button>
      </form>
      <a 
        href="#" 
        className="signup-link"
      >
        Don't have an account?
      </a>
    </div>
  </div>


  );
};

export default LoginPage;