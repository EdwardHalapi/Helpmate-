import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import all CSS files with correct paths
import './styles/variables.css';
import './styles/globals.css';
import './styles/typography.css';
import './styles/components.css';

// Import pages - doar HomeScreen este implementat momentan
import HomeScreen from './pages/HomeScreen/HomeScreen';
import ProjectDetailsScreen from './pages/ProjectDetails/ProjectDetailsScreen';
import DonationScreen from './pages/DonationScreen/DonationScreen';

// Placeholder components pentru paginile care vor fi implementate
const PlaceholderPage = ({ pageName }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: 'var(--spacing-lg)',
    textAlign: 'center',
    padding: 'var(--spacing-xl)'
  }}>
    <h1 className="text-h2">🚧 {pageName}</h1>
    <p className="text-base text-secondary">
      Această pagină este în dezvoltare și va fi disponibilă în curând.
    </p>
    <a href="/" className="btn btn-primary">
      Înapoi la Acasă
    </a>
  </div>
);

// Componente placeholder pentru paginile viitoare
const ProjectsScreen = () => <PlaceholderPage pageName="Lista Proiecte" />;
const ProjectDetailsScreenPlaceholder = () => <PlaceholderPage pageName="Detalii Proiect" />;
const LoginScreen = () => <PlaceholderPage pageName="Login" />;
const RegisterScreen = () => <PlaceholderPage pageName="Înregistrare" />;
const VolunteerDashboard = () => <PlaceholderPage pageName="Dashboard Voluntar" />;
const OrganizerDashboard = () => <PlaceholderPage pageName="Dashboard Organizator" />;
const ProfileScreen = () => <PlaceholderPage pageName="Profil Utilizator" />;
const CreateProjectScreen = () => <PlaceholderPage pageName="Creează Proiect" />;
const ApplicationsScreen = () => <PlaceholderPage pageName="Aplicațiile Mele" />;
const NotificationsScreen = () => <PlaceholderPage pageName="Notificări" />;
const SettingsScreen = () => <PlaceholderPage pageName="Setări" />;
const AboutScreen = () => <PlaceholderPage pageName="Despre Noi" />;
const ContactScreen = () => <PlaceholderPage pageName="Contact" />;
const HelpScreen = () => <PlaceholderPage pageName="Ajutor" />;
const TermsScreen = () => <PlaceholderPage pageName="Termeni și Condiții" />;
const PrivacyScreen = () => <PlaceholderPage pageName="Politica de Confidențialitate" />;
const NotFoundScreen = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: 'var(--spacing-lg)',
    textAlign: 'center',
    padding: 'var(--spacing-xl)'
  }}>
    <h1 className="text-h1" style={{ fontSize: '6rem', margin: 0 }}>404</h1>
    <h2 className="text-h2">Pagina nu a fost găsită</h2>
    <p className="text-base text-secondary">
      Ne pare rău, dar pagina pe care o căutați nu există.
    </p>
    <a href="/" className="btn btn-primary">
      Înapoi la Acasă
    </a>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Pagina principală - HomeScreen implementat */}
          <Route path="/" element={<HomeScreen />}>
            <Route path="proiecte/:projectId/donează" element={<DonationScreen />} />
          </Route>
          
          {/* Autentificare */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/forgot-password" element={<PlaceholderPage pageName="Resetare Parolă" />} />
          
          {/* Proiecte */}
          <Route path="/proiecte" element={<ProjectsScreen />} />
          <Route path="/proiecte/:id" element={<ProjectDetailsScreen />} />
          <Route path="/proiecte/:id/susține" element={<PlaceholderPage pageName="Susține ca Voluntar" />} />
          <Route path="/proiecte/categorie/:category" element={<PlaceholderPage pageName="Proiecte pe Categorie" />} />
          
          {/* Dashboard Voluntar */}
          <Route path="/dashboard/voluntar" element={<VolunteerDashboard />} />
          <Route path="/dashboard/voluntar/aplicatii" element={<ApplicationsScreen />} />
          <Route path="/dashboard/voluntar/istoric" element={<PlaceholderPage pageName="Istoric Voluntariat" />} />
          <Route path="/dashboard/voluntar/certificare" element={<PlaceholderPage pageName="Certificări" />} />
          
          {/* Dashboard Organizator */}
          <Route path="/dashboard/organizator" element={<OrganizerDashboard />} />
          <Route path="/dashboard/organizator/proiecte" element={<PlaceholderPage pageName="Proiectele Mele" />} />
          <Route path="/dashboard/organizator/creeaza-proiect" element={<CreateProjectScreen />} />
          <Route path="/dashboard/organizator/voluntari" element={<PlaceholderPage pageName="Gestionare Voluntari" />} />
          <Route path="/dashboard/organizator/rapoarte" element={<PlaceholderPage pageName="Rapoarte" />} />
          <Route path="/dashboard/organizator/organizatie" element={<PlaceholderPage pageName="Setări Organizație" />} />
          
          {/* Profil și Setări */}
          <Route path="/profil" element={<ProfileScreen />} />
          <Route path="/profil/edit" element={<PlaceholderPage pageName="Editare Profil" />} />
          <Route path="/notificari" element={<NotificationsScreen />} />
          <Route path="/setari" element={<SettingsScreen />} />
          
          {/* Pagini informaționale */}
          <Route path="/despre" element={<AboutScreen />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/ajutor" element={<HelpScreen />} />
          <Route path="/cum-functioneaza" element={<PlaceholderPage pageName="Cum Funcționează" />} />
          <Route path="/comunitate" element={<PlaceholderPage pageName="Comunitate" />} />
          <Route path="/blog" element={<PlaceholderPage pageName="Blog" />} />
          <Route path="/success-stories" element={<PlaceholderPage pageName="Povești de Succes" />} />
          
          {/* Legal */}
          <Route path="/termeni" element={<TermsScreen />} />
          <Route path="/confidentialitate" element={<PrivacyScreen />} />
          <Route path="/cookies" element={<PlaceholderPage pageName="Politica Cookies" />} />
          
          {/* Admin Routes (pentru viitor) */}
          <Route path="/admin" element={<PlaceholderPage pageName="Admin Dashboard" />} />
          <Route path="/admin/utilizatori" element={<PlaceholderPage pageName="Gestionare Utilizatori" />} />
          <Route path="/admin/organizatii" element={<PlaceholderPage pageName="Gestionare Organizații" />} />
          <Route path="/admin/proiecte" element={<PlaceholderPage pageName="Moderare Proiecte" />} />
          <Route path="/admin/rapoarte" element={<PlaceholderPage pageName="Rapoarte Admin" />} />
          <Route path="/admin/setari" element={<PlaceholderPage pageName="Setări Sistem" />} />
          
          {/* Redirects pentru compatibilitate */}
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/projects" element={<ProjectsScreen />} />
          <Route path="/dashboard" element={<PlaceholderPage pageName="Selectează tipul de dashboard" />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;