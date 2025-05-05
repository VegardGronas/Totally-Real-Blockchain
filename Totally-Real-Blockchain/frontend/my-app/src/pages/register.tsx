import React, { useState } from 'react';
import { useAuth } from '../context/authContext'; // Import useAuth
import '../styles/register.css';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const { login } = useAuth(); // Access login function from context
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://192.168.1.8:8080/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token); // Call login method from context
        alert('Registration successful!');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      alert('Error connecting to server');
      console.error(err);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        
        <button type="submit">Register</button>

        <p>Already have an account?</p>
        <button type='button' onClick={goToLogin}>Login</button>
      </form>
    </div>
  );
};

export default Register;
