import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/edit-service-modal.css';

const EditServiceModal = ({ isOpen, service, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    type: service?.type || '',
    description: service?.description || '',
    location: service?.location || '',
    startTime: '08:00',
    endTime: '18:00',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Nom requis';
    if (!formData.description?.trim()) newErrors.description = 'Description requise';
    if (!formData.location?.trim()) newErrors.location = 'Localisation requise';
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-edit" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modifier le Service</h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Nom du Service:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Type:</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="">Sélectionner</option>
              <option value="Spécialité Médicale">Spécialité Médicale</option>
              <option value="Urgence">Urgence</option>
              <option value="Laboratoire">Laboratoire</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />
            {errors.description && <span className="error-msg">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label>Localisation:</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} />
            {errors.location && <span className="error-msg">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label>Horaires d'Ouverture:</label>
            <div className="time-inputs">
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
              <span className="time-separator">à</span>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Annuler</button>
            <button type="submit" className="btn-save">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;