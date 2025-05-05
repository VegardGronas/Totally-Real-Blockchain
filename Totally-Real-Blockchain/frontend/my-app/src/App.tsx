import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/main.css';
import Navbar from './components/navbar';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import CreateCoin from './pages/createCoin';
import Twatter from './pages/twatter';

const App: React.FC = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-coin"
          element={token ? <CreateCoin /> : <Navigate to="/login" />}
        />
        <Route
          path="/twatter"
          element={token ? <Twatter /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
