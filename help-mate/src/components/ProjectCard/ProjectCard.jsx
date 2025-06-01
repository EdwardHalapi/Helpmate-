import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, X, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { toast } from 'react-hot-toast';
import styles from './ProjectCard.module.css';
import { FiUsers, FiCalendar, FiMapPin, FiShare2 } from 'react-icons/fi';
import DonationScreen from '../../pages/DonationScreen/DonationScreen';

const ProjectCard = ({ project, onProjectUpdate }) => {
  const navigate = useNavigate();
  const { user, profileStatus } = useAuth();
  const [applicationStatus, setApplicationStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [isOrganizer, setIsOrganizer] = React.useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  
  React.useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsOrganizer(false);
        return;
      }

      try {
        const organizerRef = doc(db, 'organizations', user.uid);
        const organizerDoc = await getDoc(organizerRef);
        setIsOrganizer(organizerDoc.exists());
      } catch (error) {
        console.error('Error checking organizer status:', error);
        setIsOrganizer(false);
      }
    };

    checkRole();
  }, [user]);

  // Check application status
  React.useEffect(() => {
    const checkAllStatuses = async () => {
      if (!user || isOrganizer) {
        setApplicationStatus(null);
        return;
      }

      try {
        const volunteerRef = doc(db, 'volunteers', user.uid);
        const volunteerDoc = await getDoc(volunteerRef);
        
        if (volunteerDoc.exists()) {
          const data = volunteerDoc.data();
          
          if (data.approved?.includes(project.id)) {
            setApplicationStatus('approved');
          } else if (data.pending?.includes(project.id)) {
            setApplicationStatus('pending');
          } else if (data.refused?.includes(project.id)) {
            setApplicationStatus('refused');
          } else {
            setApplicationStatus(null);
          }
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    };

    checkAllStatuses();
  }, [user, project.id, isOrganizer]);

  const handleCardClick = () => {
    navigate(`/proiecte/${project.id}`);
  };

  const handleDonateClick = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowDonationModal(true);
  };

  const handleSupport = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to support this project');
      return;
    }

    if (profileStatus !== 'complete') {
      toast.error('Please complete your profile before supporting projects');
      return;
    }

    setLoading(true);
    try {
      const volunteerRef = doc(db, 'volunteers', user.uid);
      const volunteerDoc = await getDoc(volunteerRef);
      
      if (volunteerDoc.exists()) {
        const data = volunteerDoc.data();
        const pending = data.pending || [];
        
        if (!pending.includes(project.id)) {
          await updateDoc(volunteerRef, {
            pending: [...pending, project.id]
          });
          setApplicationStatus('pending');
          toast.success('Application submitted successfully!');
          onProjectUpdate && onProjectUpdate();
        }
      }
    } catch (error) {
      console.error('Error applying to project:', error);
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString();
  };

  const renderApplicationStatus = () => {
    // Don't show application status for organizers
    if (isOrganizer) {
      return null;
    }

    switch (applicationStatus) {
      case 'pending':
        return (
          <div className={styles.statusText}>
            <Clock size={16} />
            <span>În așteptarea aprobării</span>
          </div>
        );
      case 'approved':
        return (
          <div className={`${styles.statusText} ${styles.approved}`}>
            <Check size={16} />
            <span>Aplicare aprobată</span>
          </div>
        );
      case 'refused':
        return (
          <div className={`${styles.statusText} ${styles.refused}`}>
            <X size={16} />
            <span>Aplicare respinsă</span>
          </div>
        );
      default:
        if (loading) {
          return (
            <div className={`${styles.statusText} ${styles.processing}`}>
              <Clock size={16} />
              <span>Se procesează...</span>
            </div>
          );
        }
        // Only show button if there's no status and user is not an organizer
        return (
          <button 
            onClick={handleSupport}
            className={`btn btn-primary ${styles.supportButton}`}
          >
            <Check size={16} />
            <span>Susține</span>
          </button>
        );
    }
  };

  return (
    <>
      <div className={styles.card} onClick={handleCardClick}>
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{project.title}</h3>
          <p className={styles.cardDescription}>{project.description}</p>
          
          <div className={styles.cardStats}>
            <div className={styles.statItem}>
              <FiUsers />
              <span>{project.currentVolunteers}/{project.maxVolunteers} volunteers</span>
            </div>
            <div className={styles.statItem}>
              <FiCalendar />
              <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
            </div>
            <div className={styles.statItem}>
              <FiMapPin />
              <span>{project.location}</span>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.cardActions}>
              {!isOrganizer && renderApplicationStatus()}
              <button 
                className={styles.donateButton}
                onClick={handleDonateClick}
              >
                <Heart size={16} />
                <span>Donează</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDonationModal && (
        <div className={styles.donationOverlay} onClick={() => setShowDonationModal(false)}>
          <div className={styles.donationModal} onClick={e => e.stopPropagation()}>
            <DonationScreen project={project} onClose={() => setShowDonationModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard; 