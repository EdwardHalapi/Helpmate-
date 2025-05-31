import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Target, 
  Heart, 
  Share2, 
  Bookmark,
  CheckCircle,
  Star,
  User,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import projectsService from '../../services/api/projects.js';
import { Project } from '../../models/Project.js';
import styles from './ProjectDetailsScreen.module.css';

const ProjectDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const projectData = await projectsService.getProjectById(id);
        if (projectData) {
          setProject(projectData);
        } else {
          setError('Proiectul nu a fost găsit');
        }
      } catch (error) {
        console.error('Eroare la încărcarea proiectului:', error);
        setError('Nu s-a putut încărca proiectul');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id]);

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
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(date);
  };

  const formatDateShort = (date) => {
    if (!date) return 'TBD';
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p className="text-lg text-secondary">Încărcăm detaliile proiectului...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={styles.error}>
        <h2 className="text-h2">Oops! Ceva nu a mers bine</h2>
        <p className="text-lg text-secondary">{error}</p>
        <div className={styles.errorActions}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            Înapoi la Acasă
          </button>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectDetails}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <button 
              className={styles.backButton}
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} />
              Înapoi
            </button>
            <div className={styles.headerActions}>
              <button className={styles.actionButton}>
                <Share2 size={20} />
              </button>
              <button className={styles.actionButton}>
                <Bookmark size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroImage}>
              <div className={styles.projectImage}>
                <span className={styles.imageIcon}>🎯</span>
              </div>
            </div>
            
            <div className={styles.heroInfo}>
              <div className={styles.projectHeader}>
                <div className={styles.badges}>
                  <div className={`badge ${getStatusBadgeClass(project.status)}`}>
                    {project.status}
                  </div>
                  <div className={`${styles.priority} ${getPriorityColor(project.priority)}`}>
                    Prioritate {project.priority}
                  </div>
                </div>
                
                <h1 className="text-h1">{project.title}</h1>
                <p className="text-lead text-secondary">{project.description}</p>
              </div>

              <div className={styles.quickStats}>
                <div className={styles.statItem}>
                  <MapPin size={20} />
                  <div>
                    <span className="text-sm text-muted">Locație</span>
                    <p className="text-base font-medium">{project.location}</p>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <Calendar size={20} />
                  <div>
                    <span className="text-sm text-muted">Data începerii</span>
                    <p className="text-base font-medium">{formatDateShort(project.startDate)}</p>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <Users size={20} />
                  <div>
                    <span className="text-sm text-muted">Voluntari</span>
                    <p className="text-base font-medium">{project.currentVolunteers}/{project.maxVolunteers}</p>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <Clock size={20} />
                  <div>
                    <span className="text-sm text-muted">Ore totale</span>
                    <p className="text-base font-medium">{project.totalHours}h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className={styles.actionSection}>
        <div className={styles.container}>
          <div className={styles.actionButtons}>
            <Link to={`/proiecte/${project.id}/donează`} className="btn btn-error">
              <Heart size={20} />
              Donează pentru proiect
            </Link>
            {project.status === 'Activ' && 
             project.currentVolunteers < project.maxVolunteers && 
             project.progress > 0 && (
              <Link to={`/proiecte/${project.id}/susține`} className="btn btn-primary">
                <Users size={20} />
                Susține ca voluntar
              </Link>
            )}
            <button className="btn btn-secondary">
              <Share2 size={20} />
              Distribuie
            </button>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.tabNavigation}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Prezentare generală
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Detalii complete
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'progress' ? styles.active : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              Progres
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'volunteers' ? styles.active : ''}`}
              onClick={() => setActiveTab('volunteers')}
            >
              Echipa
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <OverviewTab project={project} />
            )}
            {activeTab === 'details' && (
              <DetailsTab project={project} />
            )}
            {activeTab === 'progress' && (
              <ProgressTab project={project} />
            )}
            {activeTab === 'volunteers' && (
              <VolunteersTab project={project} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ project }) => {
  return (
    <div className={styles.overview}>
      <div className={styles.overviewGrid}>
        <div className={styles.overviewMain}>
          <div className="card">
            <div className="card-body">
              <h3 className="text-h3">Despre proiect</h3>
              <p className="text-base">{project.description}</p>
              
              {project.requiredSkills.length > 0 && (
                <div className={styles.skillsSection}>
                  <h4 className="text-h4">Competențe necesare</h4>
                  <div className={styles.skills}>
                    {project.requiredSkills.map((skill, index) => (
                      <span key={index} className="badge badge-info">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.overviewSidebar}>
          <div className="card">
            <div className="card-body">
              <h4 className="text-h4">Progres proiect</h4>
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span className="text-lg font-bold">{project.progress}%</span>
                  <span className="text-sm text-secondary">completat</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className={styles.progressStats}>
                  <div className={styles.progressStat}>
                    <span className="text-sm text-muted">Task-uri completate</span>
                    <span className="text-sm font-medium">{project.completedTasks}/{project.totalTasks}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h4 className="text-h4">Voluntari</h4>
              <div className={styles.volunteerStats}>
                <div className={styles.volunteerStat}>
                  <Users size={24} />
                  <div>
                    <span className="text-lg font-bold">{project.currentVolunteers}</span>
                    <span className="text-sm text-secondary">/ {project.maxVolunteers} voluntari</span>
                  </div>
                </div>
                <div className={styles.volunteerProgress}>
                  <div className={styles.volunteerBar}>
                    <div 
                      className={styles.volunteerFill}
                      style={{ width: `${(project.currentVolunteers / project.maxVolunteers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Details Tab Component
const DetailsTab = ({ project }) => {
  const formatDate = (date) => {
    if (!date) return 'Nu este stabilită';
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(date);
  };

  return (
    <div className={styles.details}>
      <div className={styles.detailsGrid}>
        <div className="card">
          <div className="card-header">
            <h3 className="text-h3">Informații detaliate</h3>
          </div>
          <div className="card-body">
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <Calendar size={20} />
                <div>
                  <span className="text-sm text-muted">Data începerii</span>
                  <p className="text-base font-medium">{formatDate(project.startDate)}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Calendar size={20} />
                <div>
                  <span className="text-sm text-muted">Data finalizării</span>
                  <p className="text-base font-medium">{formatDate(project.endDate)}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <MapPin size={20} />
                <div>
                  <span className="text-sm text-muted">Locația</span>
                  <p className="text-base font-medium">{project.location}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Target size={20} />
                <div>
                  <span className="text-sm text-muted">Prioritate</span>
                  <p className="text-base font-medium">Prioritate {project.priority}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Clock size={20} />
                <div>
                  <span className="text-sm text-muted">Ore estimate</span>
                  <p className="text-base font-medium">{project.totalHours} ore</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-h3">Competențe necesare</h3>
          </div>
          <div className="card-body">
            <div className={styles.skills}>
              {project.requiredSkills.map((skill, index) => (
                <span key={index} className="badge badge-info">
                  <CheckCircle size={14} />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Tab Component
const ProgressTab = ({ project }) => {
  return (
    <div className={styles.progressTab}>
      <div className="card">
        <div className="card-header">
          <h3 className="text-h3">Progresul proiectului</h3>
        </div>
        <div className="card-body">
          <div className={styles.progressOverview}>
            <div className={styles.progressMetric}>
              <Target size={32} />
              <div>
                <span className="text-2xl font-bold">{project.progress}%</span>
                <p className="text-sm text-secondary">Progres general</p>
              </div>
            </div>
            <div className={styles.progressMetric}>
              <CheckCircle size={32} />
              <div>
                <span className="text-2xl font-bold">{project.completedTasks}</span>
                <p className="text-sm text-secondary">Task-uri completate</p>
              </div>
            </div>
            <div className={styles.progressMetric}>
              <Clock size={32} />
              <div>
                <span className="text-2xl font-bold">{project.totalHours}</span>
                <p className="text-sm text-secondary">Ore lucrate</p>
              </div>
            </div>
          </div>
          
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-secondary text-center">
            {project.completedTasks} din {project.totalTasks} task-uri completate
          </p>
        </div>
      </div>
    </div>
  );
};

// Volunteers Tab Component  
const VolunteersTab = ({ project }) => {
  return (
    <div className={styles.volunteersTab}>
      <div className="card">
        <div className="card-header">
          <h3 className="text-h3">Echipa de voluntari</h3>
        </div>
        <div className="card-body">
          <div className={styles.volunteerOverview}>
            <div className={styles.volunteerMetric}>
              <Users size={32} />
              <div>
                <span className="text-2xl font-bold">{project.currentVolunteers}</span>
                <p className="text-sm text-secondary">Voluntari activi</p>
              </div>
            </div>
            <div className={styles.volunteerMetric}>
              <Target size={32} />
              <div>
                <span className="text-2xl font-bold">{project.maxVolunteers}</span>
                <p className="text-sm text-secondary">Voluntari necesari</p>
              </div>
            </div>
            <div className={styles.volunteerMetric}>
              <Star size={32} />
              <div>
                <span className="text-2xl font-bold">{project.maxVolunteers - project.currentVolunteers}</span>
                <p className="text-sm text-secondary">Locuri disponibile</p>
              </div>
            </div>
          </div>
          
          {project.status === 'Activ' && 
           project.currentVolunteers < project.maxVolunteers && 
           project.progress > 0 && (
            <div className={styles.joinTeam}>
              <h4 className="text-h4">Alătură-te echipei!</h4>
              <p className="text-base text-secondary">
                Mai sunt {project.maxVolunteers - project.currentVolunteers} locuri disponibile în această echipă minunată.
              </p>
              <Link to={`/proiecte/${project.id}/susține`} className="btn btn-primary">
                <Users size={20} />
                Susține ca voluntar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsScreen;