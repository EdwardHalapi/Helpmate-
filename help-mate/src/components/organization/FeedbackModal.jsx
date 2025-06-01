import React, { useState } from 'react';
import { X } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, volunteer, onSubmit }) => {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="feedback-modal modal-content">
        <div className="modal-header">
          <h2>Oferă Feedback</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <p>Oferă feedback constructiv pentru {volunteer.name}</p>
          <textarea
            className="feedback-textarea"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Scrie feedback-ul tău aici..."
          />
        </div>
        <div className="form-actions">
          <button className="btn-cancel" onClick={onClose}>
            Anulează
          </button>
          <button
            className="btn-submit"
            onClick={() => {
              onSubmit(feedback);
              onClose();
            }}
            disabled={!feedback.trim()}
          >
            Trimite Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal; 