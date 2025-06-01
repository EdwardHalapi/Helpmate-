import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import UserAvatar from '../../common/UserAvatar/UserAvatar';
import { LogOut } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.includes('/dashboard');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          HelpMate
        </Link>

        <nav className={styles.nav}>
          {user && (
            <div className={styles.userActions}>
              <UserAvatar />
              <button 
                onClick={handleSignOut}
                className={styles.logoutButton}
              >
                <LogOut size={20} />
                Deconectare
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
