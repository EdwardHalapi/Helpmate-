import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

const RatingModal = ({ isOpen, onClose, volunteer, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="rating-modal modal-content">
        <div className="modal-header">
          <h2>Evaluează Voluntar</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <p>Evaluează contribuția lui {volunteer.name} în cadrul proiectului</p>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                className={`star ${
                  star <= (hoveredRating || rating) ? 'filled' : ''
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-cancel" onClick={onClose}>
            Anulează
          </button>
          <button
            className="btn-submit"
            onClick={() => {
              onSubmit(rating);
              onClose();
            }}
            disabled={!rating}
          >
            Salvează Evaluarea
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal; 