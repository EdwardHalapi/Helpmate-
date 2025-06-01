import React, { useState } from 'react';
import { Bell, Plus, Filter, Search, ArrowLeft, Target, TrendingUp, Calendar, Users, Clock, CheckSquare, X, MapPin, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './OrganizationProfile.css';

const CreateProjectModal = ({ isOpen, onClose, onSubmit, editProject = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    requiredVolunteers: '',
    estimatedHours: '',
    skills: [],
    priority: 'Medie',
    category: ''
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Mediu',
    'Educație',
    'Social',
    'Cultural',
    'Sport',
    'Sănătate',
    'Tehnologie',
    'Altele'
  ];

  const priorities = ['Ridicată', 'Medie', 'Scăzută'];

  const skillOptions = [
    'Comunicare',
    'Organizare',
    'Lucru în echipă',
    'Leadership',
    'Adaptabilitate',
    'Creativitate',
    'Abilități digitale',
    'Limbi străine',
    'Primul ajutor',
    'Management de proiect'
  ];

  React.useEffect(() => {
    if (isOpen && editProject) {
      const projectToEdit = {
        title: editProject.title,
        description: editProject.description,
        location: editProject.location || '',
        startDate: editProject.startDate || '',
        endDate: editProject.endDate || '',
        requiredVolunteers: editProject.volunteers ? editProject.volunteers.split('/')[1] : '',
        estimatedHours: editProject.hours ? editProject.hours.replace('h', '') : '',
        skills: editProject.skills || [],
        priority: editProject.status[1],
        category: editProject.category || ''
      };
      setFormData(projectToEdit);
    } else if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        requiredVolunteers: '',
        estimatedHours: '',
        skills: [],
        priority: 'Medie',
        category: ''
      });
    }
  }, [isOpen, editProject]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSkillsChange = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Titlul este obligatoriu';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrierea este obligatorie';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Locația este obligatorie';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Data de început este obligatorie';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'Data de sfârșit este obligatorie';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'Data de sfârșit trebuie să fie după data de început';
    }
    
    if (!formData.requiredVolunteers) {
      newErrors.requiredVolunteers = 'Numărul de voluntari este obligatoriu';
    } else if (formData.requiredVolunteers < 1) {
      newErrors.requiredVolunteers = 'Trebuie să fie cel puțin un voluntar';
    }
    
    if (!formData.estimatedHours) {
      newErrors.estimatedHours = 'Numărul de ore este obligatoriu';
    } else if (formData.estimatedHours < 1) {
      newErrors.estimatedHours = 'Trebuie să fie cel puțin o oră';
    }
    
    if (!formData.category) {
      newErrors.category = 'Categoria este obligatorie';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editProject ? 'Editare Proiect' : 'Creare Proiect Nou'}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-project-form">
          <div className="form-section">
            <h2>Informații Generale</h2>
            
            <div className="form-group">
              <label htmlFor="title">Titlul Proiectului*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? 'error' : ''}
                placeholder="ex: Curățenie în Parcul Central"
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Descriere*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={errors.description ? 'error' : ''}
                placeholder="Descrieți pe scurt proiectul și obiectivele sale..."
                rows="4"
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Categoria*</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Selectează categoria</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="priority">Prioritate</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Detalii Organizatorice</h2>
            
            <div className="form-group">
              <label htmlFor="location">Locație*</label>
              <div className="input-with-icon">
                <MapPin size={20} />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={errors.location ? 'error' : ''}
                  placeholder="ex: Parcul Central, Cluj-Napoca"
                />
              </div>
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Data Început*</label>
                <div className="input-with-icon">
                  <Calendar size={20} />
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={errors.startDate ? 'error' : ''}
                  />
                </div>
                {errors.startDate && <span className="error-message">{errors.startDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="endDate">Data Sfârșit*</label>
                <div className="input-with-icon">
                  <Calendar size={20} />
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={errors.endDate ? 'error' : ''}
                  />
                </div>
                {errors.endDate && <span className="error-message">{errors.endDate}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="requiredVolunteers">Număr Voluntari*</label>
                <div className="input-with-icon">
                  <Users size={20} />
                  <input
                    type="number"
                    id="requiredVolunteers"
                    name="requiredVolunteers"
                    value={formData.requiredVolunteers}
                    onChange={handleInputChange}
                    className={errors.requiredVolunteers ? 'error' : ''}
                    min="1"
                    placeholder="ex: 10"
                  />
                </div>
                {errors.requiredVolunteers && <span className="error-message">{errors.requiredVolunteers}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="estimatedHours">Ore Estimate*</label>
                <div className="input-with-icon">
                  <Clock size={20} />
                  <input
                    type="number"
                    id="estimatedHours"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleInputChange}
                    className={errors.estimatedHours ? 'error' : ''}
                    min="1"
                    placeholder="ex: 4"
                  />
                </div>
                {errors.estimatedHours && <span className="error-message">{errors.estimatedHours}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Abilități Necesare</h2>
            <div className="skills-grid">
              {skillOptions.map(skill => (
                <label key={skill} className="skill-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillsChange(skill)}
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onClose}
            >
              Anulează
            </button>
            <button type="submit" className="btn-submit">
              {editProject ? 'Salvează Modificările' : 'Crează Proiect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, projectTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-confirmation">
        <div className="modal-header">
          <h2>Confirmare Ștergere</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <p>Ești sigur că vrei să ștergi proiectul "{projectTitle}"?</p>
          <p className="warning">Această acțiune nu poate fi anulată.</p>
        </div>
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={onClose}
          >
            Anulează
          </button>
          <button 
            type="button" 
            className="btn-delete"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Șterge Proiect
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectCardMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="card-menu" ref={menuRef}>
      <button 
        className="btn-more"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreVertical size={20} />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={() => {
            onEdit();
            setIsOpen(false);
          }}>
            <Edit2 size={16} />
            <span>Editează</span>
          </button>
          <button className="dropdown-item delete" onClick={() => {
            onDelete();
            setIsOpen(false);
          }}>
            <Trash2 size={16} />
            <span>Șterge</span>
          </button>
        </div>
      )}
    </div>
  );
};

const OrganizationProfile = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const userName = "Andrei"; // Acest nume ar trebui să vină din context/props/backend
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Curățenie Parc Central",
      description: "Activitate de curățenie și plantare în parcul central. Contribuim la un mediu mai curat pentru comun...",
      status: ["Activ", "Ridicată"],
      progress: 60,
      volunteers: "12/20",
      tasks: "6/10",
      hours: "48h"
    },
    {
      id: 2,
      title: "Educație Digitală",
      description: "Predarea competențelor digitale de bază pentru persoanele în vârstă și copii din familii defavorizat...",
      status: ["Planificat", "Medie"],
      progress: 0,
      volunteers: "8/15",
      tasks: "0/12",
      hours: "0h"
    }
  ]);

  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setShowCreateProject(true);
  };

  const handleDeleteProject = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    }
  };

  const handleCreateOrUpdateProject = (formData) => {
    if (projectToEdit) {
      setProjects(prevProjects => prevProjects.map(project => 
        project.id === projectToEdit.id
          ? {
              ...project,
              title: formData.title,
              description: formData.description,
              status: [formData.startDate > new Date().toISOString() ? "Planificat" : "Activ", formData.priority],
              volunteers: `0/${formData.requiredVolunteers}`,
              tasks: "0/0",
              hours: `${formData.estimatedHours}h`,
              location: formData.location,
              category: formData.category,
              skills: formData.skills
            }
          : project
      ));
      setProjectToEdit(null);
    } else {
      const newProject = {
        id: projects.length + 1,
        title: formData.title,
        description: formData.description,
        status: [formData.startDate > new Date().toISOString() ? "Planificat" : "Activ", formData.priority],
        progress: 0,
        volunteers: `0/${formData.requiredVolunteers}`,
        tasks: "0/0",
        hours: `${formData.estimatedHours}h`,
        location: formData.location,
        category: formData.category,
        skills: formData.skills
      };
      setProjects(prevProjects => [newProject, ...prevProjects]);
    }
    setShowCreateProject(false);
  };

  // Filtrarea proiectelor în funcție de termenul de căutare
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculate din proiectele filtrate
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status[0] === "Activ").length,
    plannedProjects: projects.filter(p => p.status[0] === "Planificat").length,
    activeVolunteers: 68 // Acest număr ar trebui să vină din backend
  };

  return (
    <>
      <div className="platform-header">
        <div className="platform-header-content">
          <div className="platform-branding">
            <div className="branding-with-home">
              <Link to="/" className="back-link">
                <ArrowLeft size={24} strokeWidth={2.5} />
              </Link>
              <div className="user-avatar">
                {userName[0]}
              </div>
              <div className="user-info">
                <h2>Bun venit, {userName}!</h2>
                <p className="dashboard-type">Dashboard Organizator</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <div className="notifications-wrapper">
              <button 
                className="notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                <span className="notification-badge">3</span>
              </button>
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notificări</h3>
                  </div>
                  <div className="notifications-list">
                    <div className="notification-item">
                      <div className="notification-content">
                        <h4>Voluntar nou</h4>
                        <p>Ion Popescu s-a alăturat proiectului Curățenie Parc Central</p>
                        <span className="notification-time">acum 5 minute</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-content">
                        <h4>Actualizare proiect</h4>
                        <p>Proiectul Educație Digitală a atins 50% din obiective</p>
                        <span className="notification-time">acum 2 ore</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-content">
                        <h4>Cerere nouă</h4>
                        <p>3 voluntari noi așteaptă aprobarea pentru Bancă de Alimente</p>
                        <span className="notification-time">acum 1 zi</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="organization-dashboard">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon projects-icon">
              <Target size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalProjects}</span>
              <span className="stat-label">Proiecte Totale</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.activeProjects}</span>
              <span className="stat-label">Proiecte Active</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon planned-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.plannedProjects}</span>
              <span className="stat-label">Proiecte Planificate</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon volunteers-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.activeVolunteers}</span>
              <span className="stat-label">Voluntari Activi</span>
            </div>
          </div>
        </div>

        <div className="projects-section">
          <div className="projects-header">
            <div className="search-bar">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Caută proiecte..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters">
              <button className="filter-btn">
                <Filter size={20} />
                Toate proiectele
              </button>
            </div>
            <button 
              className="btn-new-project" 
              onClick={() => setShowCreateProject(true)}
            >
              <Plus size={20} />
              Crează Proiect
            </button>
          </div>

          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <ProjectCardMenu
                    onEdit={() => handleEditProject(project)}
                    onDelete={() => handleDeleteProject(project)}
                  />
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-status">
                  <span className={`status-badge ${project.status[0].toLowerCase()}`}>
                    {project.status[0]}
                  </span>
                  <span className={`priority-badge ${project.status[1].toLowerCase()}`}>
                    {project.status[1]}
                  </span>
                  {project.category && (
                    <span className="status-badge">
                      {project.category}
                    </span>
                  )}
                </div>
                {project.location && (
                  <div className="project-location">
                    <MapPin size={16} />
                    <span>{project.location}</span>
                  </div>
                )}
                <div className="project-progress">
                  <div className="progress-label">
                    <span>Progres</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="project-metrics">
                  <div className="metric">
                    <Users size={20} />
                    <div className="metric-content">
                      <span className="metric-label">Voluntari</span>
                      <span className="metric-value">{project.volunteers}</span>
                    </div>
                  </div>
                  <div className="metric">
                    <CheckSquare size={20} />
                    <div className="metric-content">
                      <span className="metric-label">Sarcini</span>
                      <span className="metric-value">{project.tasks}</span>
                    </div>
                  </div>
                  <div className="metric">
                    <Clock size={20} />
                    <div className="metric-content">
                      <span className="metric-label">Durată</span>
                      <span className="metric-value">{project.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateProjectModal
        isOpen={showCreateProject}
        onClose={() => {
          setShowCreateProject(false);
          setProjectToEdit(null);
        }}
        onSubmit={handleCreateOrUpdateProject}
        editProject={projectToEdit}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setProjectToDelete(null);
        }}
        onConfirm={confirmDelete}
        projectTitle={projectToDelete?.title}
      />
    </>
  );
};

export default OrganizationProfile; 