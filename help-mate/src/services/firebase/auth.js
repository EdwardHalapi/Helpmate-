import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';

const auth = getAuth();

export const UserRoles = {
  VOLUNTEER: 'VOLUNTEER',
  ORGANIZER: 'ORGANIZER'
};

class AuthService {
  constructor() {
    this.auth = auth;
    this.currentUser = null;
    this.userRole = null;
  }

  // Initialize auth state listener
  initAuthStateListener(callback) {
    return onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        // Get user data including role
        const userData = await this.getUserData(user.uid);
        this.currentUser = { ...user, ...userData };
        this.userRole = userData?.role;
      } else {
        this.currentUser = null;
        this.userRole = null;
      }
      if (callback) callback(this.currentUser);
    });
  }

  // Sign up
  async signUp(email, password, role, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore with role explicitly set
      const userDocData = {
        email,
        role: role || UserRoles.VOLUNTEER, // Default to volunteer if no role specified
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileStatus: 'incomplete'
      };

      await setDoc(doc(db, 'users', user.uid), userDocData);

      // Create role-specific document
      if (role === UserRoles.VOLUNTEER) {
        const volunteerRef = doc(db, 'volunteers', user.uid);
        await setDoc(volunteerRef, {
          email: email,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          profileStatus: 'incomplete',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pending: [],
          accepted: [],
          refused: [],
          projects: []
        });
      } else if (role === UserRoles.ORGANIZER) {
        const organizerRef = doc(db, 'organizers', user.uid);
        await setDoc(organizerRef, {
          email: email,
          name: userData.firstName + ' ' + userData.lastName,
          phone: userData.phone || '',
          profileStatus: 'incomplete',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          projects: [],
          volunteers: []
        });
      }

      // Get the complete user data
      const completeUserData = await this.getUserData(user.uid);
      return { ...user, ...completeUserData };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Get user data including role
      const userData = await this.getUserData(user.uid);
      
      return { ...user, ...userData };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(this.auth);
      this.currentUser = null;
      this.userRole = null;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Get user data from Firestore
  async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  // Check if user has specific role
  async checkRole(requiredRole) {
    if (!this.currentUser) return false;
    
    const userData = await this.getUserData(this.currentUser.uid);
    return userData?.role === requiredRole;
  }

  // Handle Firebase Auth errors
  handleAuthError(error) {
    let message = 'A apărut o eroare. Vă rugăm încercați din nou.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Acest email este deja folosit.';
        break;
      case 'auth/invalid-email':
        message = 'Adresa de email este invalidă.';
        break;
      case 'auth/operation-not-allowed':
        message = 'Operațiunea nu este permisă.';
        break;
      case 'auth/weak-password':
        message = 'Parola este prea slabă.';
        break;
      case 'auth/user-disabled':
        message = 'Acest cont a fost dezactivat.';
        break;
      case 'auth/user-not-found':
        message = 'Nu există niciun cont cu acest email.';
        break;
      case 'auth/wrong-password':
        message = 'Parolă incorectă.';
        break;
      default:
        message = error.message;
    }

    return new Error(message);
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get current user role
  getCurrentUserRole() {
    return this.userRole;
  }
}

const authService = new AuthService();
export default authService;
