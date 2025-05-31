import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, CreditCard, CheckCircle } from 'lucide-react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import projectsService from '../../services/api/projects.js';
import styles from './DonationScreen.module.css';

const DonationScreen = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        console.error('Missing projectId:', projectId);
        setError('ID-ul proiectului lipsește');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching project with ID:', projectId);
        const projectData = await projectsService.getProjectById(projectId);
        
        if (projectData) {
          console.log('Project found:', projectData);
          setProject(projectData);
          setError(null);
        } else {
          console.error('Project not found for ID:', projectId);
          setError('Proiectul nu a fost găsit');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Eroare la încărcarea proiectului');
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchProject();
  }, [projectId]);

  const predefinedAmounts = [
    { value: 5, label: '5 LEI' },
    { value: 100, label: '100 LEI' },
    { value: 500, label: '500 LEI' }
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleCardDataChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'expiryDate') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        const month = parseInt(formattedValue.substring(0, 2));
        if (month > 12) {
          formattedValue = '12' + formattedValue.substring(2);
        }
        if (formattedValue.length > 2) {
          formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
        }
        
        // Validate if date is in the past
        if (formattedValue.length === 5) {
          const [inputMonth, inputYear] = formattedValue.split('/');
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100;
          const currentMonth = currentDate.getMonth() + 1;
          
          if (parseInt(inputYear) < currentYear || 
             (parseInt(inputYear) === currentYear && parseInt(inputMonth) < currentMonth)) {
            setDateError('Data de expirare nu poate fi în trecut');
          } else {
            setDateError('');
          }
        }
      }
      formattedValue = formattedValue.substring(0, 5);
      setCardData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate amount
      const amount = selectedAmount || parseFloat(customAmount);
      if (!amount || isNaN(amount) || amount <= 0) {
        throw new Error('Suma donată trebuie să fie un număr pozitiv valid');
      }

      // Get current project data
      const currentProject = await projectsService.getProjectById(projectId);
      if (!currentProject) {
        throw new Error('Proiectul nu a fost găsit');
      }

      // Prepare the update data
      const updatedDonations = currentProject.donations || [];
      updatedDonations.push({
        amount,
        donorName: cardData.cardHolder.trim(),
        timestamp: new Date().toISOString(),
        lastFourDigits: cardData.cardNumber.slice(-4)
      });

      const currentTotal = currentProject.totalDonations || 0;
      const newTotal = currentTotal + amount;

      // Update the project with the new donation
      await projectsService.updateProject(projectId, {
        donations: updatedDonations,
        totalDonations: newTotal,
        lastDonationAt: new Date().toISOString()
      });

      // Fetch the updated project to confirm changes
      const updatedProject = await projectsService.getProjectById(projectId);
      setProject(updatedProject);
      setShowSuccess(true);

    } catch (error) {
      console.error('Error processing donation:', error);
      alert(`Eroare la procesarea donației: ${error.message}`);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (error) {
    return (
      <div className={styles.donationOverlay}>
        <div className={styles.donationModal}>
          <div className={styles.errorScreen}>
            <h2>Oops! A apărut o eroare</h2>
            <p>{error}</p>
            <button 
              className={`${styles.navButton} ${styles.homeButton}`} 
              onClick={handleClose}
            >
              Înapoi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.donationOverlay}>
        <div className={styles.donationModal}>
          <div className={styles.loadingScreen}>
            <div className={styles.spinner}></div>
            <p>Se încarcă...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className={styles.donationOverlay}>
        <div className={styles.donationModal}>
          <div className={styles.successScreen}>
            <CheckCircle size={64} className={styles.successIcon} />
            <h2>Mulțumim pentru donație!</h2>
            <p>Ați donat cu succes {selectedAmount || customAmount} LEI{project ? ` pentru proiectul "${project.title}"` : ''}</p>
            <button 
              className={`${styles.navButton} ${styles.homeButton}`} 
              onClick={handleClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.donationOverlay}>
      <div className={styles.donationModal}>
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={24} />
        </button>

        <div className={styles.donationHeader}>
          <CreditCard size={32} />
          <h2>Donează pentru {project ? `proiectul "${project.title}"` : 'acest proiect'}</h2>
          <p>Alege suma pe care dorești să o donezi</p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className={styles.donationForm} 
          method="post"
          autoComplete="off"
        >
          {/* Hidden input to prevent autofill */}
          <input type="text" style={{ display: 'none' }} name="prevent_autofill" />
          
          <div className={styles.amountSection}>
            <div className={styles.predefinedAmounts}>
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount.value}
                  type="button"
                  className={`${styles.amountButton} ${selectedAmount === amount.value ? styles.selected : ''}`}
                  onClick={() => handleAmountSelect(amount.value)}
                >
                  {amount.label}
                </button>
              ))}
            </div>

            <div className={styles.customAmount}>
              <input
                type="number"
                placeholder="Altă sumă (LEI)"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className={styles.customAmountInput}
                min="1"
                name="donation_amount"
                autoComplete="off"
              />
            </div>
          </div>

          <div className={styles.cardSection}>
            <div className={styles.inputGroup}>
              <label htmlFor="cardNumber">Număr Card</label>
              <input
                type="text"
                id="cardNumber"
                name="cc_number"
                placeholder="1234 5678 9012 3456"
                value={cardData.cardNumber}
                onChange={handleCardDataChange}
                maxLength="19"
                required
                autoComplete="new-text"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="cardHolder">Titular Card</label>
              <input
                type="text"
                id="cardHolder"
                name="cc_name"
                placeholder="NUME PRENUME"
                value={cardData.cardHolder}
                onChange={handleCardDataChange}
                required
                autoComplete="new-text"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
              />
            </div>

            <div className={styles.cardDetails}>
              <div className={styles.inputGroup}>
                <label htmlFor="expiryDate">Data Expirării</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="cc_exp"
                  placeholder="MM/YY"
                  value={cardData.expiryDate}
                  onChange={handleCardDataChange}
                  maxLength="5"
                  required
                  autoComplete="new-text"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                />
                {dateError && <span className={styles.errorText}>{dateError}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cc_csc"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={handleCardDataChange}
                  maxLength="3"
                  required
                  autoComplete="new-text"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={
              !((selectedAmount || customAmount) && 
              cardData.cardNumber && 
              cardData.cardHolder && 
              cardData.expiryDate && 
              cardData.cvv) || 
              dateError // Disable button if there's a date error
            }
          >
            Donează {(selectedAmount || customAmount) ? `${selectedAmount || customAmount} LEI` : ''}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationScreen; 