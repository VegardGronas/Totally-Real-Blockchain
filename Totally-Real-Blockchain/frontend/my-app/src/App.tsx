import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/main.css';
import Login from './pages/login';
import Register from './pages/register';
import Navbar from './components/navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Login />
    </div>
  );
}

export default App;
