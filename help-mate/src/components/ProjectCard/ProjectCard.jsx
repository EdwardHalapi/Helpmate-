import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Clock, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { toast } from 'react-hot-toast';
import styles from './ProjectCard.module.css';

const ProjectCard = ({ project, onProjectUpdate }) => {
  const navigate = useNavigate();
  const { user, profileStatus, isOrganizer } = useAuth();
  const [applicationStatus, setApplicationStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

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

  const handleProjectApplication = async () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/proiecte/${project.id}` } });
      return;
    }

    try {
      setLoading(true);
      
      const projectRef = doc(db, 'projects', project.id);
      const projectDoc = await getDoc(projectRef);
      
      if (!projectDoc.exists()) {
        throw new Error('Proiectul nu a fost găsit');
      }

      const projectData = projectDoc.data();

      // Create volunteer application data
      const volunteerData = {
        volunteerId: user.uid,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        status: 'Pending',
        appliedAt: Timestamp.now()
      };

      // Update project with new application
      const updatedPendingVolunteers = [
        ...(projectData.pendingVolunteers || []),
        volunteerData
      ];

      await updateDoc(projectRef, {
        pendingVolunteers: updatedPendingVolunteers
      });

      // Update volunteer's pending projects
      const volunteerRef = doc(db, 'volunteers', user.uid);
      const volunteerDoc = await getDoc(volunteerRef);
      const currentPending = volunteerDoc.exists() ? (volunteerDoc.data().pending || []) : [];
      
      await updateDoc(volunteerRef, {
        pending: [...currentPending, project.id]
      });

      setApplicationStatus('pending');
      toast.success('Aplicarea ta a fost înregistrată cu succes!');
      
      if (onProjectUpdate) {
        onProjectUpdate();
      }
      
    } catch (error) {
      console.error('Error applying to project:', error);
      toast.error('Nu s-a putut aplica la proiect. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/proiecte/${project.id}` } });
      return;
    }

    if (profileStatus === 'incomplete') {
      navigate('/profil/completeaza', {
        state: {
          projectId: project.id,
          returnTo: `/proiecte/${project.id}`
        }
      });
    } else {
      handleProjectApplication();
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
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
      <div className={styles.cardActions}>
        <Link 
          to={`/proiecte/${project.id}/donează`} 
          className={`btn btn-error ${styles.donateButton}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Heart size={16} />
          Donează
        </Link>
        {renderApplicationStatus()}
      </div>
    </div>
  );
};

export default ProjectCard; 