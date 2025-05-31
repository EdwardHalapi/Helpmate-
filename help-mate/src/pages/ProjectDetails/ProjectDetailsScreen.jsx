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
  Globe,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  CircleDot,
  ArrowRight
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import projectsService from '../../services/api/projects.js';
import { Project } from '../../models/Project.js';
import styles from './ProjectDetailsScreen.module.css';
import ShareButtons from '../../components/common/ShareButtons/ShareButtons';

const ProjectDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const loadProject = async () => {
      try {
        setLoading(true);
        // Set up real-time listener
        unsubscribe = onSnapshot(doc(db, 'projects', id), (doc) => {
          if (doc.exists()) {
            // Create a new Project instance with the data
            const projectData = doc.data();
            const projectInstance = new Project({
              id: doc.id,
              ...projectData,
              // Safely convert timestamps to Date objects
              createdAt: projectData.createdAt?.toDate?.() || new Date(),
              updatedAt: projectData.updatedAt?.toDate?.() || new Date(),
              startDate: projectData.startDate?.toDate?.() || null,
              endDate: projectData.endDate?.toDate?.() || null,
              lastDonationAt: projectData.lastDonationAt?.toDate?.() || null,
              // Ensure other date fields are properly handled
              donations: (projectData.donations || []).map(donation => ({
                ...donation,
                timestamp: donation.timestamp?.toDate?.() || new Date(donation.timestamp) || new Date()
              }))
            });
            setProject(projectInstance);
            setLoading(false);
          } else {
            setError('Proiectul nu a fost găsit');
            setLoading(false);
          }
        }, (error) => {
          console.error('Error loading project:', error);
          setError('Nu s-a putut încărca proiectul');
          setLoading(false);
        });
      } catch (error) {
        console.error('Error setting up project listener:', error);
        setError('Nu s-a putut încărca proiectul');
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
    }

    // Cleanup subscription
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(amount);
  };

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const handleApplyClick = async () => {
    try {
      // For now, we'll use a mock volunteer data since we don't have auth yet
      const mockVolunteer = {
        volunteerId: 'mock-volunteer-id',
        name: 'John Doe',
        email: 'john@example.com'
      };

      // Update project with new application
      await projectsService.updateProject(id, {
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
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Înapoi
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
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
              Înapoi
            </button>
            <div className={styles.headerActions}>
              <ShareButtons 
                url={window.location.href} 
                title={project.title}
                description={project.description}
              />
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

                <div className={styles.projectActions}>
                  <Link 
                    to={`/proiecte/${id}/donează`}
                    className={`btn btn-error ${styles.actionButton}`}
                  >
                    <Heart size={20} />
                    Donează
                  </Link>

                  {project.status !== 'Finalizat' && project.progress < 100 && (
                    <>
                      {showSuccessMessage ? (
                        <div className={styles.successMessage}>
                          <CheckCircle size={20} />
                          Aplicare trimisă cu succes!
                        </div>
                      ) : (
                        <button 
                          onClick={handleApplyClick} 
                          className={`btn btn-primary ${styles.actionButton}`}
                          disabled={applicationStatus === 'Pending'}
                        >
                          {applicationStatus === 'Pending' ? 'Aplicare în așteptare' : 'Susține'}
                          <ArrowRight size={20} />
                        </button>
                      )}
                    </>
                  )}
                </div>
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

      {/* Project Content */}
      <div className={styles.projectContent}>
        <div className={styles.container}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Prezentare Generală
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'donations' ? styles.active : ''}`}
              onClick={() => setActiveTab('donations')}
            >
              Donații
              {project.donations?.length > 0 && (
                <span className={styles.badge}>{project.donations.length}</span>
              )}
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Detalii complete
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'progress' ? styles.active : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              Progres
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'volunteers' ? styles.active : ''}`}
              onClick={() => setActiveTab('volunteers')}
            >
              Echipa
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === 'overview' ? (
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
                            <span className="text-lg font-bold">{project.progress || 0}%</span>
                            <span className="text-sm text-secondary">completat</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill}
                              style={{ width: `${project.progress || 0}%` }}
                            ></div>
                          </div>
                          <div className={styles.progressStats}>
                            <div className={styles.progressStat}>
                              <span className="text-sm text-muted">Task-uri completate</span>
                              <span className="text-sm font-medium">
                                {project.completedTasks || 0}/{project.totalTasks || 0}
                              </span>
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
            ) : activeTab === 'donations' ? (
              <div className={styles.donations}>
                <div className={styles.donationsSummary}>
                  <div className={styles.donationStats}>
                    <div className={styles.donationStat}>
                      <CreditCard size={24} />
                      <div className={styles.statContent}>
                        <h3>Total Donații</h3>
                        <p>{formatCurrency(project.totalDonations || 0)}</p>
                      </div>
                    </div>
                    <div className={styles.donationStat}>
                      <Users size={24} />
                      <div className={styles.statContent}>
                        <h3>Donatori</h3>
                        <p>{project.donations?.length || 0}</p>
                      </div>
                    </div>
                  </div>

                  <Link 
                    to={`/proiecte/${id}/donează`}
                    className={`btn btn-primary ${styles.donateButton}`}
                  >
                    <Heart size={20} />
                    Donează pentru acest proiect
                  </Link>
                </div>

                {project.donations && project.donations.length > 0 ? (
                  <div className={styles.donationsList}>
                    {project.donations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((donation, index) => (
                      <div key={index} className={styles.donationItem}>
                        <div className={styles.donationHeader}>
                          <div className={styles.donorInfo}>
                            <User size={20} />
                            <span className={styles.donorName}>{donation.donorName}</span>
                            <span className={styles.cardNumber}>•••• {donation.lastFourDigits}</span>
                          </div>
                          <span className={styles.donationAmount}>
                            {formatCurrency(donation.amount)}
                          </span>
                        </div>
                        <div className={styles.donationFooter}>
                          <span className={styles.timestamp}>
                            {formatTimestamp(donation.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyStateContent}>
                      <Heart size={48} />
                      <h3>Nicio donație încă</h3>
                      <p>Fii primul care donează pentru acest proiect și ajută-ne să îl realizăm!</p>
                      <Link 
                        to={`/proiecte/${id}/donează`}
                        className="btn btn-primary"
                      >
                        Donează Acum
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'details' ? (
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
            ) : activeTab === 'progress' ? (
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
                          <span className="text-2xl font-bold">{project.progress || 0}%</span>
                          <p className="text-sm text-secondary">Progres general</p>
                        </div>
                      </div>
                      <div className={styles.progressMetric}>
                        <CheckCircle size={32} />
                        <div>
                          <span className="text-2xl font-bold">{project.completedTasks || 0}</span>
                          <p className="text-sm text-secondary">Task-uri completate</p>
                        </div>
                      </div>
                      <div className={styles.progressMetric}>
                        <Clock size={32} />
                        <div>
                          <span className="text-2xl font-bold">{project.totalHours || 0}</span>
                          <p className="text-sm text-secondary">Ore lucrate</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-sm text-secondary text-center">
                      {project.completedTasks || 0} din {project.totalTasks || 0} task-uri completate
                    </p>
                  </div>
                </div>
              </div>
            ) : activeTab === 'volunteers' ? (
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
                     project.currentVolunteers < project.maxVolunteers && (
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsScreen;