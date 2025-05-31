import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import styles from './ProjectCard.module.css';

const ProjectCard = ({ project }) => {
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
      </div>
    </div>
  );
};

export default ProjectCard; 