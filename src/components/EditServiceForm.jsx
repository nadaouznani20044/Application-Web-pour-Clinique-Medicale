import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/EditServiceForm.css';

const EditServiceForm = ({ service, doctors = [], onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    location: '',
    phone: '',
    headDoctor: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    if (service) {
      setFormData({
        serviceName: service.serviceName || '',
        description: service.description || '',
        location: service.location || '',
        phone: service.phone || '',
        headDoctor: service.headDoctor || ''
      });
    }
    setErrors({});
  }, [service]);

  
  const handleChange = (e) => {
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
      newErrors.phone = 'Le tÃ©lÃ©phone est requis';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Le tÃ©lÃ©phone doit contenir au moins 10 chiffres';
    }

    if (!formData.headDoctor.trim()) {
      newErrors.headDoctor = 'Le mÃ©decin chef est requis';
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

  const getDoctorPhoto = (doctorName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=1b5e20&color=fff&size=40`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2 className="modal-title">
            âœï¸ Modifier le Service
          </h2>
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
              placeholder="Ex: Oncologie, PÃ©diatrie, Chirurgie..."
              className={`form-input ${errors.serviceName ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.serviceName && (
              <span className="error-message">âŒ {errors.serviceName}</span>
            )}
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
              placeholder="Ex: Service spÃ©cialisÃ© dans le traitement des cancers..."
              rows="3"
              className={`form-input ${errors.description ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.description && (
              <span className="error-message">âŒ {errors.description}</span>
            )}
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
              placeholder="Ex: Bloc H, Ã‰tage 5"
              className={`form-input ${errors.location ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.location && (
              <span className="error-message">âŒ {errors.location}</span>
            )}
          </div>

    

          
          <div className="form-group">
            <label htmlFor="headDoctor">
              MÃ©decin Chef <span className="required">*</span>
            </label>
            <input
              type="text"
              id="headDoctor"
              name="headDoctor"
              value={formData.headDoctor}
              onChange={handleChange}
              placeholder="Ex: Dr. Alice Fournier"
              list="doctors-list-edit"
              className={`form-input ${errors.headDoctor ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            <datalist id="doctors-list-edit">
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.name} />
              ))}
            </datalist>
            {errors.headDoctor && (
              <span className="error-message">âŒ {errors.headDoctor}</span>
            )}

            
            {formData.headDoctor && (
              <div className="doctor-preview">
                <img
                  src={getDoctorPhoto(formData.headDoctor)}
                  alt={formData.headDoctor}
                  className="doctor-photo"
                />
                <div className="doctor-info">
                  <p className="doctor-name">ðŸ‘¨â€âš•ï¸ {formData.headDoctor}</p>
                </div>
              </div>
            )}
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
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'â³ Traitement...' : 'ðŸ’¾ Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceForm;
