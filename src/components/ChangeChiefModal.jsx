import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/ChangeChiefModal.css';

const ChangeChiefModal = ({ isOpen, currentChief, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    newChief: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  const doctors = [
    { id: 1, name: 'Dr. Alice Fournier', specialty: 'Gynécologue', avatar: 'A' },
    { id: 2, name: 'Dr. James Chen', specialty: 'Pédiatre', avatar: 'J' },
    { id: 3, name: 'Dr. Karim Hassan', specialty: 'Ophtalmologue', avatar: 'K' },
    { id: 4, name: 'Dr. Victoria Garcia', specialty: 'Radiologue', avatar: 'V' },
    { id: 5, name: 'Dr. Yves Anderson', specialty: 'Chirurgien', avatar: 'Y' },
    { id: 6, name: 'Dr. Frank Wilson', specialty: 'Médecin interne', avatar: 'F' },
  ];

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
    if (!formData.newChief) newErrors.newChief = 'Sélectionnez un médecin';
    if (!formData.startDate) newErrors.startDate = 'Sélectionnez une date';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedDoctor = doctors.find(d => d.id === parseInt(formData.newChief));
    
    onSubmit({
      newChief: selectedDoctor.name,
      startDate: formData.startDate,
      doctorId: parseInt(formData.newChief)
    });
    
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      newChief: '',
      startDate: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    onClose();
  };

  const selectedDoctorId = parseInt(formData.newChief);
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-chief" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👨‍⚕️ Modifier le Chef de Service</h2>
          <button onClick={handleClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        
        <div className="current-chief-info">
          <h4>Chef actuel</h4>
          <div className="chief-display">
            <div className="avatar-large">{currentChief?.charAt(0)}</div>
            <span className="chief-name">{currentChief || 'Non assigné'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="change-chief-form">
          
          <div className="form-group">
            <label htmlFor="newChief">Nouveau Chef *</label>
            <select
              id="newChief"
              name="newChief"
              value={formData.newChief}
              onChange={handleChange}
              className={errors.newChief ? 'input-error' : ''}
            >
              <option value="">-- Sélectionner un médecin --</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} ({doctor.specialty})
                </option>
              ))}
            </select>
            {errors.newChief && <span className="error-msg">{errors.newChief}</span>}
          </div>

          
          {selectedDoctor && (
            <div className="new-chief-preview">
              <h4>Nouveau chef</h4>
              <div className="chief-card-preview">
                <div className="avatar-large">{selectedDoctor.avatar}</div>
                <div className="chief-preview-info">
                  <h5>{selectedDoctor.name}</h5>
                  <p>{selectedDoctor.specialty}</p>
                </div>
              </div>
            </div>
          )}

          
          <div className="form-group">
            <label htmlFor="startDate">Date de prise de fonction *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? 'input-error' : ''}
            />
            {errors.startDate && <span className="error-msg">{errors.startDate}</span>}
          </div>

          
          <div className="form-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Annuler
            </button>
            <button type="submit" className="btn-save">
              ✅ Confirmer le changement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeChiefModal;
