import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          HelpMate
        </Link>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name || 'Utilizator'}</span>
            <div className="user-avatar">
              {user?.name?.[0] || 'U'}
            </div>
          </div>
          
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 