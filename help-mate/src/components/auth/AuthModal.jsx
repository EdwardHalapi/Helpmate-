import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Modal from '../common/Modal/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { UserRoles } from '../../services/firebase/auth';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose, requiredRole, redirectPath }) => {
  const navigate = useNavigate();
  const { signIn, signUp, error } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(formData.email, formData.password, requiredRole);
      onClose();
      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: requiredRole
      };

      await signUp(formData.email, formData.password, requiredRole, userData);
      onClose();
      
      // Redirect to profile completion form based on role
      if (requiredRole === UserRoles.VOLUNTEER) {
        navigate('/profil/completeaza');
      } else if (requiredRole === UserRoles.ORGANIZER) {
        navigate('/organizator/profil/completeaza');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={requiredRole === UserRoles.VOLUNTEER ? 'Cont Voluntar' : 'Cont Organizator'}
    >
      <div className={styles.authModal}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Autentificare
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'signup' ? styles.active : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Înregistrare
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputGroup}>
                <Mail size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Parolă</label>
              <div className={styles.inputGroup}>
                <Lock size={20} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Se procesează...' : 'Autentificare'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">Prenume</label>
              <div className={styles.inputGroup}>
                <User size={20} />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Nume</label>
              <div className={styles.inputGroup}>
                <User size={20} />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputGroup}>
                <Mail size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Telefon</label>
              <div className={styles.inputGroup}>
                <Phone size={20} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Parolă</label>
              <div className={styles.inputGroup}>
                <Lock size={20} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Se procesează...' : 'Înregistrare'}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default AuthModal; 