import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/layout/Header/Header';
import styles from './VolunteerProfileForm.module.css';

const experienceLevels = ['Începător', '1-2 ani', '3-5 ani', '5+ ani'];
const availabilityOptions = [
  'Luni dimineața',
  'Luni după-masa',
  'Marți dimineața',
  'Marți după-masa',
  'Miercuri dimineața',
  'Miercuri după-masa',
  'Joi dimineața',
  'Joi după-masa',
  'Vineri dimineața',
  'Vineri după-masa',
  'Sâmbătă',
  'Duminică'
];

const skillOptions = [
  'Comunicare',
  'Organizare',
  'Leadership',
  'Lucru în echipă',
  'Social Media',
  'Fotografie',
  'Video',
  'Design',
  'Programare',
  'Educație',
  'Medicină',
  'Sport'
];

const VolunteerProfileForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    experience: 'Începător',
    skills: [],
    availability: [],
    status: 'Activ'
  });

  useEffect(() => {
    const loadVolunteerData = async () => {
      try {
        if (!user) return;
        
        const volunteerDoc = await getDoc(doc(db, 'volunteers', user.uid));
        if (volunteerDoc.exists()) {
          const data = volunteerDoc.data();
          setFormData(prev => ({
            ...prev,
            ...data,
            firstName: user.firstName || data.firstName || '',
            lastName: user.lastName || data.lastName || '',
            email: user.email || data.email || ''
          }));
        }
      } catch (error) {
        console.error('Error loading volunteer data:', error);
        setError('Nu s-au putut încărca datele profilului');
      } finally {
        setLoading(false);
      }
    };

    loadVolunteerData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const volunteerRef = doc(db, 'volunteers', user.uid);
      const userRef = doc(db, 'users', user.uid);
      
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'phone', 'age', 'experience'];
      const isComplete = requiredFields.every(field => formData[field]) &&
                        formData.skills.length > 0 &&
                        formData.availability.length > 0;

      // Update volunteer document
      await updateDoc(volunteerRef, {
        ...formData,
        profileStatus: isComplete ? 'completed' : 'incomplete',
        updatedAt: new Date().toISOString()
      });

      // Update user document with name
      await updateDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        updatedAt: new Date().toISOString()
      });

      // Only navigate if profile is complete
      if (isComplete) {
        navigate('/dashboard/voluntar');
      } else {
        setError('Te rugăm să completezi toate câmpurile obligatorii pentru a continua.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Nu s-a putut actualiza profilul');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Se încarcă...</div>;
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <button 
              onClick={() => navigate('/')} 
              className={styles.backButton}
            >
              <ArrowLeft size={20} />
              Înapoi la pagina principală
            </button>
            <h2>Completează-ți profilul de voluntar</h2>
            <p className={styles.subtitle}>
              Pentru a putea aplica la proiecte, te rugăm să completezi următoarele informații
            </p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">Prenume *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Nume *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Telefon *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="age">Vârstă *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="16"
                max="100"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="experience">Experiență *</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Abilități *</label>
              <div className={styles.checkboxGrid}>
                {skillOptions.map(skill => (
                  <label key={skill} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleCheckboxChange('skills', skill)}
                    />
                    {skill}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Disponibilitate *</label>
              <div className={styles.checkboxGrid}>
                {availabilityOptions.map(time => (
                  <label key={time} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(time)}
                      onChange={() => handleCheckboxChange('availability', time)}
                    />
                    {time}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                onClick={() => navigate('/')}
                className="btn btn-secondary btn-lg"
              >
                Completez mai târziu
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? 'Se salvează...' : 'Salvează profilul'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfileForm; 