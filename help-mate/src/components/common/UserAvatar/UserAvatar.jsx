import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { UserRoles } from '../../../services/firebase/auth';
import styles from './UserAvatar.module.css';

const UserAvatar = () => {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const getInitials = () => {
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={styles.userAvatar}>
      <button
        className={styles.avatarButton}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className={styles.avatar}>
          {user.profileImage ? (
            <img src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
          ) : (
            <span>{getInitials()}</span>
          )}
        </div>
        <span className={styles.userName}>{user.firstName} {user.lastName}</span>
      </button>

      {showDropdown && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <div className={styles.userInfo}>
              <span className={styles.name}>{user.firstName} {user.lastName}</span>
              <span className={styles.email}>{user.email}</span>
            </div>
          </div>

          <div className={styles.dropdownContent}>
            <Link 
              to={user.role === UserRoles.VOLUNTEER ? '/voluntar/profil' : '/organizatie/profil'}
              className={styles.dropdownItem}
              onClick={() => setShowDropdown(false)}
            >
              <User size={18} />
              Profil
            </Link>
            
            <Link 
              to={user.role === UserRoles.VOLUNTEER ? '/voluntar/setari' : '/organizatie/setari'}
              className={styles.dropdownItem}
              onClick={() => setShowDropdown(false)}
            >
              <Settings size={18} />
              Setări
            </Link>

            <button 
              onClick={handleSignOut}
              className={`${styles.dropdownItem} ${styles.signOut}`}
            >
              <LogOut size={18} />
              Deconectare
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar; 