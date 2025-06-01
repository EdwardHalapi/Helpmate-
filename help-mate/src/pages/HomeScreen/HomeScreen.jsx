import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, Star, Heart, User, Building2, ChevronRight, Filter, ArrowRight, CheckCircle } from 'lucide-react';
import projectsService from '../../services/api/projects.js';
import { Project } from '../../models/Project.js';
import styles from './HomeScreen.module.css';

const SCROLL_POSITION_KEY = 'homeScreenScrollPosition';

const HomeScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    planned: 0,
    totalVolunteers: 0
  });

  // Restore scroll position on mount if coming back from donation
  useEffect(() => {
    if (location.state?.fromDonation) {
      const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPosition));
        }, 0);
      }
    }
  }, [location]);

  // Încarcă proiectele din Firebase
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectList = await projectsService.getAllProjects();
        setProjects(projectList);
        setFilteredProjects(projectList);
        
        // Calculează statisticile
        const newStats = {
          total: projectList.length,
          active: projectList.filter(p => p.status === 'Activ').length,
          planned: projectList.filter(p => p.status === 'Planificat').length,
          totalVolunteers: projectList.reduce((sum, p) => sum + p.currentVolunteers, 0)
        };
        setStats(newStats);
      } catch (error) {
        console.error('Eroare la încărcarea proiectelor:', error);
        setError('Nu s-au putut încărca proiectele');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filtrează proiectele în funcție de căutare și filtru
  useEffect(() => {
    let filtered = projects;

    // Filtrare după termen de căutare
    if (searchTerm.trim()) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrare după status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(project => {
        switch (selectedFilter) {
          case 'active':
            return project.status === 'Activ';
          case 'planned':
            return project.status === 'Planificat';
          case 'available':
            return project.status === 'Activ' && project.currentVolunteers < project.maxVolunteers;
          default:
            return true;
        }
      });
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedFilter]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Activ':
        return 'badge-success';
      case 'Planificat':
        return 'badge-warning';
      case 'Finalizat':
        return 'badge-info';
      default:
        return 'badge-warning';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Ridicată':
        return styles.priorityHigh;
      case 'Medie':
        return styles.priorityMedium;
      case 'Scăzută':
        return styles.priorityLow;
      default:
        return styles.priorityMedium;
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p className="text-lg text-secondary">Încărcăm proiectele...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p className="text-lg text-error">{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Încearcă din nou
        </button>
      </div>
    );
  }

  return (
    <div className={styles.homeScreen}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <h1 className="text-h2 text-brand">HelpMate</h1>
              <p className="text-subtitle">Conectând comunități prin voluntariat</p>
            </div>
            <Link to="/login" className={`btn btn-secondary ${styles.loginBtn}`}>
              <User size={20} />
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h2 className="text-h1">
              Descoperă proiecte și fă diferența în comunitate
            </h2>
            <p className="text-lead text-secondary">
              Conectează-te cu organizații locale și contribuie la cauze care îți pasă
            </p>
            
            <div className={styles.actionCards}>
              <div className="card">
                <div className="card-body">
                  <div className={styles.actionIcon}>
                    <User size={32} />
                  </div>
                  <h3 className="text-h4">Sunt Voluntar</h3>
                  <p className="text-base text-secondary">
                    Caută și aplică la proiecte care te inspiră
                  </p>
                  <Link to="/proiecte" className="btn btn-primary">
                    Explorează Proiecte
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <div className={`${styles.actionIcon} ${styles.organizerIcon}`}>
                    <Building2 size={32} />
                  </div>
                  <h3 className="text-h4">Sunt Organizator</h3>
                  <p className="text-base text-secondary">
                    Creează și gestionează proiecte de voluntariat
                  </p>
                  <Link to="/dashboard/organizator/creeaza-proiect" className="btn btn-secondary">
                    Creează Proiect
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className="stats-card">
              <div className="stats-number">{stats.total}</div>
              <div className="stats-label">Proiecte Totale</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{stats.active}</div>
              <div className="stats-label">Proiecte Active</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{stats.planned}</div>
              <div className="stats-label">Proiecte Planificate</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{stats.totalVolunteers}</div>
              <div className="stats-label">Voluntari Activi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className={styles.searchSection}>
        <div className={styles.container}>
          <div className={styles.searchHeader}>
            <h3 className="text-h2">Explorează Proiecte</h3>
            <p className="text-base text-secondary">
              Găsește proiecte care se potrivesc intereselor tale
            </p>
          </div>
          
          <div className={styles.searchControls}>
            <div className={styles.searchInput}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Caută proiecte după nume, descriere sau locație..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.input}
              />
            </div>
            
            <div className={styles.filters}>
              <Filter size={20} />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className={styles.select}
              >
                <option value="all">Toate proiectele</option>
                <option value="active">Proiecte active</option>
                <option value="planned">Proiecte planificate</option>
                <option value="available">Locuri disponibile</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className={styles.projects}>
        <div className={styles.container}>
          {filteredProjects.length === 0 ? (
            <div className={styles.noProjects}>
              <p className="text-lg text-secondary">Nu s-au găsit proiecte care să corespundă criteriilor tale.</p>
            </div>
          ) : (
            <div className={styles.projectsGrid}>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h5 className="text-h5">HelpMate</h5>
              <p className="text-sm text-secondary">
                Conectând comunități prin voluntariat
              </p>
            </div>
            <div className={styles.footerSection}>
              <h6 className="text-h6">Pentru Voluntari</h6>
              <ul className={styles.footerLinks}>
                <li><Link to="/proiecte" className="link-muted">Caută Proiecte</Link></li>
                <li><Link to="/cum-functioneaza" className="link-muted">Cum Funcționează</Link></li>
                <li><Link to="/comunitate" className="link-muted">Comunitate</Link></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h6 className="text-h6">Pentru Organizații</h6>
              <ul className={styles.footerLinks}>
                <li><Link to="/dashboard/organizator/creeaza-proiect" className="link-muted">Creează Proiect</Link></li>
                <li><Link to="/dashboard/organizator/voluntari" className="link-muted">Gestionează Voluntari</Link></li>
                <li><Link to="/ajutor" className="link-muted">Resurse</Link></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h6 className="text-h6">Suport</h6>
              <ul className={styles.footerLinks}>
                <li><Link to="/contact" className="link-muted">Contact</Link></li>
                <li><Link to="/ajutor" className="link-muted">FAQ</Link></li>
                <li><Link to="/termeni" className="link-muted">Termeni</Link></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className="text-sm text-muted">
              &copy; 2025 HelpMate. Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </footer>

      {/* Donation Modal Outlet */}
      <Outlet />
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Activ':
        return 'badge-success';
      case 'Planificat':
        return 'badge-warning';
      case 'Finalizat':
        return 'badge-info';
      default:
        return 'badge-warning';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Ridicată':
        return styles.priorityHigh;
      case 'Medie':
        return styles.priorityMedium;
      case 'Scăzută':
        return styles.priorityLow;
      default:
        return styles.priorityMedium;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Nu este stabilită';
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleDonateClick = (e) => {
    e.preventDefault();
    navigate(`/proiecte/${project.id}/donează`);
  };

  const handleApplyClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // For now, we'll use a mock volunteer data since we don't have auth yet
      const mockVolunteer = {
        volunteerId: 'mock-volunteer-id',
        name: 'John Doe',
        email: 'john@example.com'
      };

      // Update project with new application
      await projectsService.updateProject(project.id, {
        pendingVolunteers: [
          ...(project.pendingVolunteers || []),
          {
            volunteerId: mockVolunteer.volunteerId,
            status: 'Pending',
            appliedAt: new Date().toISOString(),
            name: mockVolunteer.name,
            email: mockVolunteer.email
          }
        ]
      });

      // Show success message
      setShowSuccessMessage(true);
      setApplicationStatus('Pending');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error applying to project:', error);
      // You might want to show an error message here
    }
  };

  return (
    <Link to={`/proiecte/${project.id}`} className={styles.projectCardLink}>
      <div className={`card ${styles.projectCard}`}>
        <div className="card-header">
          <div className={styles.cardHeader}>
            <div className={`badge ${getStatusBadgeClass(project.status)}`}>
              {project.status}
            </div>
            <div className={`${styles.priority} ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <h4 className="text-h4">{project.title}</h4>
          <p className="text-sm text-secondary" style={{ marginBottom: 'var(--spacing-md)' }}>
            {project.description.length > 120 
              ? `${project.description.substring(0, 120)}...` 
              : project.description
            }
          </p>
          
          <div className={styles.projectMeta}>
            <div className={styles.metaItem}>
              <MapPin size={16} />
              <span className="text-sm">{project.location}</span>
            </div>
            <div className={styles.metaItem}>
              <Calendar size={16} />
              <span className="text-sm">{formatDate(project.startDate)}</span>
            </div>
            <div className={styles.metaItem}>
              <Users size={16} />
              <span className="text-sm">
                {project.currentVolunteers}/{project.maxVolunteers} voluntari
              </span>
            </div>
          </div>

          {project.requiredSkills.length > 0 && (
            <div className={styles.skills}>
              {project.requiredSkills.slice(0, 3).map((skill, index) => (
                <span key={index} className={`badge ${styles.skillBadge}`}>
                  {skill}
                </span>
              ))}
              {project.requiredSkills.length > 3 && (
                <span className="text-xs text-muted">
                  +{project.requiredSkills.length - 3} mai multe
                </span>
              )}
            </div>
          )}

          <div className={styles.progress}>
            <div className={styles.progressHeader}>
              <span className="text-sm font-medium">Progres</span>
              <span className="text-sm text-secondary">{project.progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="card-footer">
          <div className={styles.cardActions} onClick={(e) => e.preventDefault()}>
            <button onClick={handleDonateClick} className="btn btn-error">
              <Heart size={16} />
              Donează
            </button>
            {project.status !== 'Finalizat' && project.progress < 100 && (
              <>
                {showSuccessMessage ? (
                  <div className={styles.successMessage}>
                    <CheckCircle size={16} />
                    Aplicare trimisă cu succes!
                  </div>
                ) : (
                  <button 
                    onClick={handleApplyClick} 
                    className="btn btn-primary"
                    disabled={applicationStatus === 'Pending'}
                  >
                    {applicationStatus === 'Pending' ? 'Aplicare în așteptare' : 'Susține'}
                    <ArrowRight size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomeScreen;