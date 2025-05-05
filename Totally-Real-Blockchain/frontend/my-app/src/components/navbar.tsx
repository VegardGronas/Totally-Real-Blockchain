import React, { useState } from 'react';
import '../styles/navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="navbar-logo">🌐 Totally Real Blockchain</div>
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/create-coin">Create Coin</Link></li>
        <li><Link to="/twatter">Twatter</Link></li>
        {isAuthenticated && (
          <li>
            <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
