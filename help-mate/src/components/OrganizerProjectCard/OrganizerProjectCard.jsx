import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiEdit2, FiTrash2, FiUsers, FiCalendar, FiMapPin, FiCheckCircle, FiClock } from 'react-icons/fi';
import styles from './OrganizerProjectCard.module.css';

const OrganizerProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

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
    onDelete(project.id);
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planificat': return 'var(--color-info)';
      case 'Activ': return 'var(--color-success)';
      case 'Finalizat': return 'var(--color-primary)';
      case 'Anulat': return 'var(--color-error)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getProgressPercentage = () => {
    if (!project.totalTasks) return 0;
    return Math.round((project.completedTasks / project.totalTasks) * 100);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.cardHeader}>
        <div className={styles.cardStatus} style={{ backgroundColor: getStatusColor(project.status) }}>
          {project.status}
        </div>
        <div className={styles.cardMenu}>
          <button className={styles.cardMenuBtn} onClick={handleMenuClick}>
            <FiMoreVertical />
          </button>
          {showMenu && (
            <div className={styles.cardMenuDropdown}>
              <button onClick={handleEditClick}>
                <FiEdit2 /> Edit
              </button>
              <button onClick={handleDeleteClick} className={styles.deleteBtn}>
                <FiTrash2 /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardDescription}>{project.description}</p>
      </div>

      <div className={styles.cardProgress}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <span className={styles.progressText}>
          {project.completedTasks}/{project.totalTasks} tasks
        </span>
      </div>

      <div className={styles.cardStats}>
        <div className={styles.statItem}>
          <FiUsers />
          <span>{project.currentVolunteers}/{project.maxVolunteers}</span>
        </div>
        <div className={styles.statItem}>
          <FiClock />
          <span>{project.totalHours}h</span>
        </div>
        <div className={styles.statItem}>
          <FiMapPin />
          <span>{project.location}</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.dateRange}>
          <FiCalendar />
          <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
        </div>
        <div className={styles.priority} style={{ color: project.priority === 'Ridicată' ? 'var(--color-error)' : 'inherit' }}>
          {project.priority}
        </div>
      </div>
    </div>
  );
};

export default OrganizerProjectCard; 