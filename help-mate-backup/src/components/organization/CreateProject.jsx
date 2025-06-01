import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css';

const CreateProject = () => {
  const navigate = useNavigate();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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

    // Here you would typically make an API call to save the project
    console.log('Form submitted:', formData);
    // Navigate back to dashboard after successful submission
    navigate('/dashboard/organizator');
  };

  return (
    <div className="create-project-container">
      <div className="create-project-header">
        <button 
          className="back-button"
          onClick={() => navigate('/dashboard/organizator')}
        >
          <ArrowLeft size={20} />
          Înapoi la Dashboard
        </button>
        <h1>Creare Proiect Nou</h1>
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
            onClick={() => navigate('/dashboard/organizator')}
          >
            Anulează
          </button>
          <button type="submit" className="btn-submit">
            Creează Proiect
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject; 