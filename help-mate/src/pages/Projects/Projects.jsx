import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import styles from './Projects.module.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsCollection = collection(db, 'projects');
      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsList);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Se încarcă proiectele...</div>;
  }

  return (
    <div className={styles.projectsPage}>
      <h1>Proiecte disponibile</h1>
      <div className={styles.projectsGrid}>
        {projects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project}
            onProjectUpdate={loadProjects}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects; 