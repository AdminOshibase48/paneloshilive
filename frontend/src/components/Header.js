import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/img/logo.png" alt="OshiLive48" />
          <span>OshiLive48</span>
        </Link>
        
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                <i className="fas fa-home"></i> Home
              </Link>
            </li>
            <li>
              <Link to="/streaming" className={location.pathname === '/streaming' ? 'active' : ''}>
                <i className="fas fa-video"></i> Streaming
              </Link>
            </li>
            <li>
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                <i className="fas fa-cog"></i> Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;