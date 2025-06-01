import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ArrowRight,
  Map as MapIcon,
  Building2
} from 'lucide-react';
import { doc, onSnapshot, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import projectsService from '../../services/api/projects.js';
import { Project } from '../../models/Project.js';
import styles from './ProjectDetailsScreen.module.css';
import ShareButtons from '../../components/common/ShareButtons/ShareButtons';
import Map from '../../components/common/Map/Map';
import Modal from '../../components/common/Modal/Modal';
import Header from '../../components/layout/Header/Header';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../../components/auth/AuthModal';
import { UserRoles } from '../../services/firebase/auth';

const ProjectDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(doc(db, 'projects', id), (doc) => {
          if (doc.exists()) {
            const projectData = new Project({ id: doc.id, ...doc.data() });
            setProject(projectData);
            
            // Check application status if user is logged in
            if (user) {
              const application = projectData.pendingVolunteers?.find(
                (v) => v.volunteerId === user.uid
              );
              setApplicationStatus(application?.status || null);
            }
          } else {
            setError('Proiectul nu a fost găsit');
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading project:', error);
        setError('A apărut o eroare la încărcarea proiectului');
        setLoading(false);
      }
    };

    loadProject();
  }, [id, user]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Activ':
        return styles.statusActive;
      case 'Planificat':
        return styles.statusPlanned;
      case 'Finalizat':
        return styles.statusCompleted;
      default:
        return styles.statusPlanned;
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
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return 'Nu este stabilită';
    }
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(date);
  };

  const formatDateShort = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return 'TBD';
    }
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
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'N/A';
    
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleApplyClick = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Check if user has already applied
      const existingApplication = project.pendingVolunteers?.find(
        (v) => v.volunteerId === user.uid
      );

      if (existingApplication) {
        // Already applied, just show the success message
        setShowSuccessMessage(true);
        setApplicationStatus(existingApplication.status);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
        return;
      }

      // Create volunteer application data
      const volunteerData = {
        volunteerId: user.uid,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      };

      // Update project with new application
      const updatedPendingVolunteers = [
        ...(project.pendingVolunteers || []),
        {
          volunteerId: volunteerData.volunteerId,
          status: 'Pending',
          appliedAt: new Date().toISOString(),
          name: volunteerData.name,
          email: volunteerData.email
        }
      ];

      await projectsService.updateProject(project.id, {
        pendingVolunteers: updatedPendingVolunteers
      });

      // Update volunteer's pending projects
      const volunteerRef = doc(db, 'volunteers', user.uid);
      const volunteerDoc = await getDoc(volunteerRef);
      
      if (volunteerDoc.exists()) {
        const volunteerData = volunteerDoc.data();
        await updateDoc(volunteerRef, {
          pending: [...(volunteerData.pending || []), project.id]
        });
      } else {
        // Create volunteer document if it doesn't exist
        await setDoc(volunteerRef, {
          pending: [project.id],
          accepted: [],
          refused: [],
          projects: []
        });
      }

      // Show success message
      setShowSuccessMessage(true);
      setApplicationStatus('Pending');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error applying to project:', error);
    }
  };

  const handleDonateClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      // Save current scroll position before navigating
      sessionStorage.setItem('projectDetailsScrollPosition', window.scrollY.toString());
      navigate(`/proiecte/${id}/donează`, { 
        state: { 
          projectTitle: project?.title,
          fromProjectDetails: true 
        }
      });
    }
  };

  const renderLocationSection = () => {
    if (!project) return null;

    return (
      <div className={styles.locationSection}>
        <div className={styles.sectionHeader}>
          <h3>
            <MapPin className={styles.sectionIcon} />
            Locație
          </h3>
        </div>
        <div className={styles.locationContent}>
          <p className={styles.locationText}>{project.location}</p>
          <div 
            className={styles.mapContainer} 
            onClick={() => setShowMapModal(true)}
            role="button"
            tabIndex={0}
          >
            <Map coordinates={project.coordinates} isStatic={true} />
            <div className={styles.mapOverlay}>
              <button className={styles.viewMapButton}>
                <MapIcon size={16} />
                Vezi harta completă
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Încărcăm detaliile proiectului...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
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
    <div className={styles.projectDetails}>
      <Header />

      <div className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroImage}>
              <div className={styles.projectImage}>
                <Building2 className={styles.imageIcon} size={48} />
              </div>
            </div>

            <div className={styles.heroInfo}>
              <div className={styles.projectHeader}>
                <div className={styles.badges}>
                  <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`${styles.priority} ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
                <h1>{project.title}</h1>
                <p className="text-lead text-secondary">{project.description}</p>
              </div>

              <div className={styles.quickStats}>
                <div className={styles.statItem}>
                  <Calendar size={20} />
                  <div>
                    <h4>Data începerii</h4>
                    <p>{formatDate(project.startDate)}</p>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <Users size={20} />
                  <div>
                    <h4>Voluntari necesari</h4>
                    <p>{project.currentVolunteers}/{project.maxVolunteers}</p>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <Target size={20} />
                  <div>
                    <h4>Progres</h4>
                    <p>{project.progress}% completat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actionSection}>
        <div className={styles.container}>
          <div className={styles.actionButtons}>
            {project?.status !== 'Finalizat' && project?.progress < 100 && (
              <>
                {showSuccessMessage ? (
                  <div className={styles.successMessage}>
                    <CheckCircle size={20} />
                    Aplicare trimisă cu succes!
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handleApplyClick}
                    disabled={applicationStatus === 'Pending'}
                  >
                    <Users size={20} />
                    {applicationStatus === 'Pending' ? 'Aplicare în așteptare' : 
                     applicationStatus === 'Approved' ? 'Aplicare aprobată' :
                     applicationStatus === 'Refused' ? 'Aplicare respinsă' : 'Susține'}
                  </button>
                )}
              </>
            )}
            <button 
              className="btn btn-error btn-lg"
              onClick={handleDonateClick}
            >
              <Heart size={20} />
              Donează
            </button>
            <button className="btn btn-secondary btn-lg">
              <Share2 size={20} />
              Distribuie
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Target size={20} />
              Prezentare generală
              <span className={styles.badge}>4</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <CheckCircle size={20} />
              Detalii
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'progress' ? styles.active : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              <Star size={20} />
              Progres
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'volunteers' ? styles.active : ''}`}
              onClick={() => setActiveTab('volunteers')}
            >
              <Users size={20} />
              Voluntari
              <span className={styles.badge}>{project.currentVolunteers}</span>
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.overview}>
                <div className={styles.overviewGrid}>
                  <div className={styles.overviewMain}>
                    <div className={styles.description}>
                      <h3>Despre proiect</h3>
                      <p>{project.description}</p>
                    </div>

                    {renderLocationSection()}

                    <div className={styles.skillsSection}>
                      <h3>Abilități necesare</h3>
                      <div className={styles.skills}>
                        {project.requiredSkills.map((skill, index) => (
                          <span key={index} className="badge badge-secondary">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.overviewSidebar}>
                    <div className={styles.progressSection}>
                      <div className={styles.progressHeader}>
                        <h3>Progres proiect</h3>
                        <span>{project.progress}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className={styles.progressStats}>
                        <div className={styles.progressStat}>
                          <span>Voluntari</span>
                          <span>{project.currentVolunteers}/{project.maxVolunteers}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.volunteerStats}>
                      <h3>Statistici voluntari</h3>
                      <div className={styles.volunteerStat}>
                        <Users size={20} />
                        <div>
                          <strong>{project.currentVolunteers}</strong> voluntari activi
                        </div>
                      </div>
                      <div className={styles.volunteerStat}>
                        <Clock size={20} />
                        <div>
                          <strong>{project.totalHours}</strong> ore de voluntariat
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
            )}

            {activeTab === 'details' && (
              <div className={styles.details}>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailsList}>
                    <div className={styles.detailItem}>
                      <Calendar size={20} />
                      <div>
                        <h4>Data începerii</h4>
                        <p>{formatDate(project.startDate)}</p>
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <Clock size={20} />
                      <div>
                        <h4>Durată estimată</h4>
                        <p>{project.duration} zile</p>
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <MapPin size={20} />
                      <div>
                        <h4>Locație</h4>
                        <p>{project.location}</p>
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <Globe size={20} />
                      <div>
                        <h4>Website</h4>
                        <a href={project.website} target="_blank" rel="noopener noreferrer">
                          {project.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className={styles.detailsList}>
                    <div className={styles.detailItem}>
                      <User size={20} />
                      <div>
                        <h4>Coordonator</h4>
                        <p>{project.coordinator}</p>
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <Mail size={20} />
                      <div>
                        <h4>Email contact</h4>
                        <a href={`mailto:${project.contactEmail}`}>{project.contactEmail}</a>
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <Phone size={20} />
                      <div>
                        <h4>Telefon</h4>
                        <a href={`tel:${project.contactPhone}`}>{project.contactPhone}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className={styles.progressTab}>
                <div className={styles.progressOverview}>
                  <div className={styles.progressMetric}>
                    <Target size={24} />
                    <div>
                      <h4>Progres general</h4>
                      <p>{project.progress}% completat</p>
                    </div>
                  </div>
                  <div className={styles.progressMetric}>
                    <CheckCircle2 size={24} />
                    <div>
                      <h4>Obiective îndeplinite</h4>
                      <p>{project.completedObjectives}/{project.totalObjectives}</p>
                    </div>
                  </div>
                  <div className={styles.progressMetric}>
                    <AlertCircle size={24} />
                    <div>
                      <h4>Provocări active</h4>
                      <p>{project.activeIssues}</p>
                    </div>
                  </div>
                  <div className={styles.progressMetric}>
                    <CircleDot size={24} />
                    <div>
                      <h4>Milestone-uri</h4>
                      <p>{project.completedMilestones}/{project.totalMilestones}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.milestones}>
                  <h3>Milestone-uri proiect</h3>
                  {project.milestones?.map((milestone, index) => (
                    <div key={index} className={styles.milestone}>
                      <div className={styles.milestoneHeader}>
                        <h4>{milestone.title}</h4>
                        <span className={`badge ${milestone.completed ? 'badge-success' : 'badge-warning'}`}>
                          {milestone.completed ? 'Completat' : 'În progres'}
                        </span>
                      </div>
                      <p>{milestone.description}</p>
                      <div className={styles.milestoneProgress}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${milestone.progress}%` }}
                          ></div>
                        </div>
                        <span>{milestone.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'volunteers' && (
              <div className={styles.volunteersTab}>
                <div className={styles.volunteerOverview}>
                  <div className={styles.volunteerMetric}>
                    <Users size={24} />
                    <div>
                      <h4>Voluntari activi</h4>
                      <p>{project.currentVolunteers}</p>
                    </div>
                  </div>
                  <div className={styles.volunteerMetric}>
                    <Clock size={24} />
                    <div>
                      <h4>Ore de voluntariat</h4>
                      <p>{project.totalHours}</p>
                    </div>
                  </div>
                  <div className={styles.volunteerMetric}>
                    <Star size={24} />
                    <div>
                      <h4>Impact</h4>
                      <p>{project.impactScore} puncte</p>
                    </div>
                  </div>
                </div>

                {project.volunteers?.length > 0 ? (
                  <div className={styles.volunteersList}>
                    <h3>Echipa de voluntari</h3>
                    {project.volunteers.map((volunteer, index) => (
                      <div key={index} className={styles.volunteerCard}>
                        <div className={styles.volunteerInfo}>
                          <div className={styles.volunteerAvatar}>
                            {volunteer.avatar ? (
                              <img src={volunteer.avatar} alt={volunteer.name} />
                            ) : (
                              <User size={24} />
                            )}
                          </div>
                          <div>
                            <h4>{volunteer.name}</h4>
                            <p>{volunteer.role}</p>
                          </div>
                        </div>
                        <div className={styles.volunteerStats}>
                          <div>
                            <strong>{volunteer.hours}</strong>
                            <span>ore</span>
                          </div>
                          <div>
                            <strong>{volunteer.tasks}</strong>
                            <span>sarcini</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.joinTeam}>
                    <h4>Fii primul voluntar!</h4>
                    <p>Acest proiect are nevoie de voluntari dedicați ca tine.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={handleApplyClick}
                    >
                      <ArrowRight size={20} />
                      Aplică acum
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        title="Locație proiect"
      >
        <div className={styles.fullMapContainer}>
          <Map coordinates={project?.coordinates} />
        </div>
      </Modal>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        requiredRole={UserRoles.VOLUNTEER}
        redirectPath={`/proiecte/${id}`}
      />
    </div>
  );
};

export default ProjectDetailsScreen;