import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/AddServiceForm.css';

const AddServiceForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    location: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Le nom du service est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La localisation est requise';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le telephone est requis';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Le telephone doit contenir au moins 10 chiffres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      onSubmit(formData);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-add">
          <h2 className="modal-title">Ajouter un nouveau service</h2>
          <button className="btn-close" onClick={onClose} title="Fermer" type="button">
            <X size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="serviceName">
              Nom du Service <span className="required">*</span>
            </label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder=""
              className={`form-input ${errors.serviceName ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.serviceName && <span className="error-message">Erreur: {errors.serviceName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder=""
              rows="3"
              className={`form-input ${errors.description ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.description && <span className="error-message">Erreur: {errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">
              Localisation <span className="required">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder=""
              className={`form-input ${errors.location ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.location && <span className="error-message">Erreur: {errors.location}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Telephone <span className="required">*</span>
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder=""
              className={`form-input ${errors.phone ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.phone && <span className="error-message">Erreur: {errors.phone}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Traitement...' : 'Creer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceForm;
