import React, { useState } from 'react';
import '../styles/navbar.css'; // Import your CSS file for styling

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
        <div className="navbar-logo">🌐 Totally Real Blockchain</div>
        <ul className="navbar-links">
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/twatter">Twatter</a></li>
            <li><a href="/market">Market</a></li>
        </ul>
        </nav>
    );
};

export default Navbar;