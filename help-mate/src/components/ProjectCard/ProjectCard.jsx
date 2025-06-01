import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { toast } from 'react-hot-toast';
import styles from './ProjectCard.module.css';
import { FiMoreVertical, FiEdit2, FiTrash2, FiUsers, FiCalendar, FiMapPin } from 'react-icons/fi';

const ProjectCard = ({ project, onProjectUpdate, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user, profileStatus, isOrganizer } = useAuth();
  const [applicationStatus, setApplicationStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Check all three lists every time the component mounts or user/project changes
  React.useEffect(() => {
    const checkAllStatuses = async () => {
      if (!user) {
        setApplicationStatus(null);
        return;
      }

      try {
        const volunteerRef = doc(db, 'volunteers', user.uid);
        const volunteerDoc = await getDoc(volunteerRef);
        
        if (volunteerDoc.exists()) {
          const data = volunteerDoc.data();
          
          // Check all three lists in priority order
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
  }, [user, project.id]);

  const handleCardClick = (e) => {
    if (e.target.closest(`.${styles.cardMenuBtn}`)) return;
    navigate(`/project/${project.id}`);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit(project);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(project);
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString();
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

  const renderApplicationStatus = () => {
    if (isOrganizer) {
      return null;
    }

    // If there's an application status, show it as text
    switch (applicationStatus) {
      case 'pending':
        return (
          <div className={styles.statusText}>
            <Clock size={16} className={styles.statusIcon} />
            <span>În așteptarea aprobării</span>
          </div>
        );
      case 'approved':
        return (
          <div className={`${styles.statusText} ${styles.approved}`}>
            <Check size={16} className={styles.statusIcon} />
            <span>Aplicare aprobată</span>
          </div>
        );
      case 'refused':
        return (
          <div className={`${styles.statusText} ${styles.refused}`}>
            <X size={16} className={styles.statusIcon} />
            <span>Aplicare respinsă</span>
          </div>
        );
      default:
        if (loading) {
          return (
            <div className={`${styles.statusText} ${styles.processing}`}>
              <Clock size={16} className={styles.statusIcon} />
              <span>Se procesează...</span>
            </div>
          );
        }
        // Only show button if there's no status
        return (
          <button 
            onClick={handleSupport}
            className={`btn btn-primary ${styles.supportButton}`}
          >
            <Check size={16} />
            Susține
          </button>
        );
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3>{project.title}</h3>
          {isOrganizer && (
            <div className={styles.cardMenu}>
              <button className={styles.cardMenuBtn} onClick={handleMenuClick}>
                <FiMoreVertical />
              </button>
              {showMenu && (
                <div className={styles.cardMenuDropdown}>
                  <button onClick={handleEditClick}>
                    <FiEdit2 /> Edit
                  </button>
                  <button onClick={handleDeleteClick}>
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <p>{project.description}</p>
      </div>
      <div className={styles.cardStats}>
        <div className={styles.cardStat}>
          <FiUsers />
          <span>{project.currentVolunteers}/{project.maxVolunteers} volunteers</span>
        </div>
        <div className={styles.cardStat}>
          <FiCalendar />
          <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
        </div>
        <div className={styles.cardStat}>
          <FiMapPin />
          <span>{project.location}</span>
        </div>
      </div>
      <div className={styles.cardProgress}>
        <div className={styles.cardProgressBar}>
          <div 
            className={styles.cardProgressFill}
            style={{ 
              width: `${project.totalTasks ? (project.completedTasks / project.totalTasks) * 100 : 0}%` 
            }}
          />
        </div>
        <span className={styles.cardProgressText}>
          {project.completedTasks}/{project.totalTasks} tasks completed
        </span>
      </div>
      <div className={styles.cardActions}>
        {renderApplicationStatus()}
      </div>
    </div>
  );
};

export default ProjectCard; 