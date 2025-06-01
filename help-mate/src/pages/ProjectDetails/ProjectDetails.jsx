import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, Check, Heart } from 'lucide-react';
import { db } from '../../services/firebase/config';
import styles from './ProjectDetails.module.css';
import { Link } from 'react-router-dom';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const { user, profileStatus, isOrganizer } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const loadProjectAndStatus = async () => {
    try {
      setPageLoading(true);
      // Load project data
      const projectRef = doc(db, 'projects', projectId);
      const projectDoc = await getDoc(projectRef);
      
      if (!projectDoc.exists()) {
        toast.error('Proiectul nu a fost găsit');
        navigate('/proiecte');
        return;
      }

      setProject({ id: projectDoc.id, ...projectDoc.data() });

      // Check pending status if user is logged in
      if (user) {
        const volunteerRef = doc(db, 'volunteers', user.uid);
        const volunteerDoc = await getDoc(volunteerRef);
        
        if (volunteerDoc.exists()) {
          const data = volunteerDoc.data();
          setIsPending(data.pending?.includes(projectId) || false);
        }
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Nu s-au putut încărca datele proiectului');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadProjectAndStatus();
  }, [projectId, user]);

  const handleProjectApplication = async () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/proiecte/${projectId}` } });
      return;
    }

    try {
      setLoading(true);
      
      // Get latest project data
      const projectRef = doc(db, 'projects', projectId);
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
        pending: [...currentPending, projectId]
      });

      setIsPending(true);
      toast.success('Aplicarea ta a fost înregistrată cu succes!');
      
      // Refresh project data
      await loadProjectAndStatus();
      
    } catch (error) {
      console.error('Error applying to project:', error);
      toast.error('Nu s-a putut aplica la proiect. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/proiecte/${projectId}` } });
      return;
    }

    if (profileStatus === 'incomplete') {
      navigate('/profil/completeaza', {
        state: {
          projectId: projectId,
          returnTo: `/proiecte/${projectId}`
        }
      });
    } else {
      handleProjectApplication();
    }
  };

  const renderApplicationStatus = () => {
    if (isOrganizer) {
      return null; // Don't show anything for organizers
    }

    if (isPending) {
      return (
        <div className={styles.statusPending}>
          <Clock size={16} />
          <span>Aplicare în așteptare</span>
        </div>
      );
    }

    if (loading) {
      return (
        <div className={styles.statusProcessing}>
          <Clock size={16} />
          <span>Se procesează...</span>
        </div>
      );
    }

    return (
      <button 
        onClick={handleSupport}
        className={`btn btn-primary ${styles.supportButton}`}
        disabled={loading}
      >
        <Check size={16} />
        Susține
      </button>
    );
  };

  if (pageLoading) {
    return <div className={styles.loading}>Se încarcă...</div>;
  }

  if (!project) {
    return <div className={styles.error}>Proiectul nu a fost găsit</div>;
  }

  return (
    <div className={styles.projectDetails}>
      <div className={styles.header}>
        <h1>{project.title}</h1>
        <div className={styles.actions}>
          <Link 
            to={`/proiecte/${project.id}/donează`}
            className={`btn btn-error ${styles.donateButton}`}
          >
            <Heart size={16} />
            Donează
          </Link>
          {renderApplicationStatus()}
        </div>
      </div>
      
      <div className={styles.projectContent}>
        <p className={styles.description}>{project.description}</p>
        {/* Add other project details here */}
      </div>
    </div>
  );
};

export default ProjectDetails; 