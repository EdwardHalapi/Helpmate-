import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import HomeScreen from '../pages/HomeScreen/HomeScreen';
import ProjectDetailsScreen from '../pages/ProjectDetails/ProjectDetailsScreen';
import DonationScreen from '../pages/DonationScreen/DonationScreen';
import VolunteerDashboard from '../pages/VolunteerDashboard/VolunteerDashboard';
import VolunteerProfileForm from '../pages/VolunteerProfile/VolunteerProfileForm';
import { useAuth } from '../contexts/AuthContext';
import { UserRoles } from '../services/firebase/auth';

// Placeholder component for pages in development
const PlaceholderPage = ({ pageName }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      gap: "1rem",
      textAlign: "center",
      padding: "2rem",
    }}
  >
    <h1>🚧 {pageName}</h1>
    <p>Această pagină este în dezvoltare și va fi disponibilă în curând.</p>
    <Link to="/" className="btn btn-primary">
      Înapoi la Acasă
    </Link>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, profileStatus } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Se încarcă...</p>
      </div>
    );
  }

  // Redirect to home if not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user has the required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // If trying to access dashboard pages and profile is incomplete, redirect to profile completion
  if (profileStatus === 'incomplete' && 
      (window.location.pathname.includes('/dashboard') || 
       window.location.pathname.includes('/aplicatii') ||
       window.location.pathname.includes('/istoric') ||
       window.location.pathname.includes('/certificare'))) {
    return <Navigate 
      to={user.role === UserRoles.VOLUNTEER ? '/profil/completeaza' : '/organizator/profil/completeaza'} 
      replace 
    />;
  }

  // If trying to access profile completion and profile is complete, redirect to dashboard
  if (profileStatus === 'complete' && 
      (window.location.pathname.includes('/profil/completeaza') || 
       window.location.pathname.includes('/organizator/profil/completeaza'))) {
    return <Navigate 
      to={user.role === UserRoles.VOLUNTEER ? '/dashboard/voluntar' : '/dashboard/organizator'} 
      replace 
    />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<HomeScreen />} />
      <Route path="/proiecte/:id" element={<ProjectDetailsScreen />} />
      <Route path="/proiecte/:id/donează" element={<DonationScreen />} />
      
      {/* Volunteer routes */}
      <Route 
        path="/dashboard/voluntar" 
        element={
          <ProtectedRoute requiredRole={UserRoles.VOLUNTEER}>
            <VolunteerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profil/completeaza" 
        element={
          <ProtectedRoute requiredRole={UserRoles.VOLUNTEER}>
            <VolunteerProfileForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/voluntar/aplicatii" 
        element={
          <ProtectedRoute requiredRole={UserRoles.VOLUNTEER}>
            <PlaceholderPage pageName="Aplicațiile Mele" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/voluntar/istoric" 
        element={
          <ProtectedRoute requiredRole={UserRoles.VOLUNTEER}>
            <PlaceholderPage pageName="Istoric Voluntariat" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/voluntar/certificare" 
        element={
          <ProtectedRoute requiredRole={UserRoles.VOLUNTEER}>
            <PlaceholderPage pageName="Certificări" />
          </ProtectedRoute>
        } 
      />

      {/* Organizer routes */}
      <Route 
        path="/dashboard/organizator" 
        element={
          <ProtectedRoute requiredRole={UserRoles.ORGANIZER}>
            <PlaceholderPage pageName="Tabloul de Bord Organizator" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organizator/profil/completeaza" 
        element={
          <ProtectedRoute requiredRole={UserRoles.ORGANIZER}>
            <PlaceholderPage pageName="Completează Profilul Organizației" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/organizator/proiecte" 
        element={
          <ProtectedRoute requiredRole={UserRoles.ORGANIZER}>
            <PlaceholderPage pageName="Proiectele Mele" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/organizator/creeaza-proiect" 
        element={
          <ProtectedRoute requiredRole={UserRoles.ORGANIZER}>
            <PlaceholderPage pageName="Creare Proiect" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/organizator/voluntari" 
        element={
          <ProtectedRoute requiredRole={UserRoles.ORGANIZER}>
            <PlaceholderPage pageName="Gestionare Voluntari" />
          </ProtectedRoute>
        } 
      />

      {/* Public routes */}
      <Route path="/despre" element={<PlaceholderPage pageName="Despre Noi" />} />
      <Route path="/contact" element={<PlaceholderPage pageName="Contact" />} />
      <Route path="/ajutor" element={<PlaceholderPage pageName="Ajutor" />} />
      <Route path="/confidentialitate" element={<PlaceholderPage pageName="Politica de Confidențialitate" />} />
      <Route path="/termeni" element={<PlaceholderPage pageName="Termeni și Condiții" />} />

      {/* Catch all route - 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 