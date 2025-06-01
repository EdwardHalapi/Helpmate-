import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService, { UserRoles } from '../services/firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = authService.initAuthStateListener(async (user) => {
      if (user) {
        let status = null;
        
        // Check profile status based on role
        if (user.role === UserRoles.VOLUNTEER) {
          const volunteerDoc = await getDoc(doc(db, 'volunteers', user.uid));
          status = volunteerDoc.exists() ? volunteerDoc.data().profileStatus : 'incomplete';
        } else if (user.role === UserRoles.ORGANIZER) {
          const organizerDoc = await getDoc(doc(db, 'organizers', user.uid));
          status = organizerDoc.exists() ? organizerDoc.data().profileStatus : 'incomplete';
        }
        
        setProfileStatus(status);
        
        // Only redirect to profile completion on initial load and if coming from signup
        if (!initialLoadDone && status === 'incomplete' && location.pathname === '/') {
          if (user.role === UserRoles.VOLUNTEER) {
            navigate('/profil/completeaza');
          } else if (user.role === UserRoles.ORGANIZER) {
            navigate('/organizator/profil/completeaza');
          }
        }
      }
      setUser(user);
      setLoading(false);
      setInitialLoadDone(true);
    });

    return () => unsubscribe();
  }, [navigate, initialLoadDone, location]);

  const signIn = async (email, password, requiredRole) => {
    try {
      setError(null);
      const user = await authService.signIn(email, password);
      
      // Check if user has the required role
      if (requiredRole && user.role !== requiredRole) {
        throw new Error(
          requiredRole === UserRoles.VOLUNTEER
            ? 'Acest cont nu este un cont de voluntar.'
            : 'Acest cont nu este un cont de organizator.'
        );
      }
      
      setUser(user);
      
      // Check profile status after sign in
      let status = null;
      if (user.role === UserRoles.VOLUNTEER) {
        const volunteerDoc = await getDoc(doc(db, 'volunteers', user.uid));
        status = volunteerDoc.exists() ? volunteerDoc.data().profileStatus : 'incomplete';
      } else if (user.role === UserRoles.ORGANIZER) {
        const organizerDoc = await getDoc(doc(db, 'organizers', user.uid));
        status = organizerDoc.exists() ? organizerDoc.data().profileStatus : 'incomplete';
      }
      
      setProfileStatus(status);
      
      // Redirect to appropriate dashboard or profile completion
      if (status === 'incomplete') {
        if (user.role === UserRoles.VOLUNTEER) {
          navigate('/profil/completeaza');
        } else if (user.role === UserRoles.ORGANIZER) {
          navigate('/organizator/profil/completeaza');
        }
      } else {
        if (user.role === UserRoles.VOLUNTEER) {
          navigate('/dashboard/voluntar');
        } else if (user.role === UserRoles.ORGANIZER) {
          navigate('/dashboard/organizator');
        }
      }
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signUp = async (email, password, role, userData) => {
    try {
      setError(null);
      const user = await authService.signUp(email, password, role, userData);
      setUser(user);
      
      // If signing up as volunteer, set initial profile status
      if (role === UserRoles.VOLUNTEER) {
        setProfileStatus('incomplete');
      }
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setProfileStatus(null);
      setInitialLoadDone(false);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    profileStatus,
    signIn,
    signUp,
    signOut,
    isVolunteer: user?.role === UserRoles.VOLUNTEER,
    isOrganizer: user?.role === UserRoles.ORGANIZER
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 