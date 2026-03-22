import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/add-personnel-modal.css';

const AddPersonnelModal = ({ isOpen, onClose, onSubmit, existingUsers = [] }) => {
  const [formData, setFormData] = useState({
    userId: '',
    role: 'Médecin',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const doctors = [
    { id: 1, name: 'Dr. Alice Fournier', title: 'Médecin' },
    { id: 2, name: 'Dr. James Chen', title: 'Médecin' },
    { id: 3, name: 'Dr. Karim Hassan', title: 'Médecin Chef' },
    { id: 4, name: 'Sophie Dupont', title: 'Infirmier' },
    { id: 5, name: 'Marc Bernard', title: 'Aide-soignant' },
  ];

  const roles = ['Médecin', 'Infirmier', 'Aide-soignant', 'Technicien'];

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
    if (!formData.userId) newErrors.userId = 'Sélectionnez un utilisateur';
    if (!formData.role) newErrors.role = 'Sélectionnez un rôle';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedUser = doctors.find(d => d.id === parseInt(formData.userId));
    
    onSubmit({
      ...formData,
      userName: selectedUser?.name,
      userId: parseInt(formData.userId)
    });
    
    handleClose();
  };

  const handleClose = () => {
    setFormData({ userId: '', role: 'Médecin', notes: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-compact" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Ajouter du Personnel</h2>
          <button onClick={handleClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-personnel-form">
          
          <div className="form-group">
            <label htmlFor="userId">Sélectionnez un employé *</label>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className={errors.userId ? 'input-error' : ''}
            >
              <option value="">-- Choisir un employé --</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} ({doctor.title})
                </option>
              ))}
            </select>
            {errors.userId && <span className="error-msg">{errors.userId}</span>}
          </div>

          
          <div className="form-group">
            <label htmlFor="role">Rôle dans le service *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? 'input-error' : ''}
            >
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.role && <span className="error-msg">{errors.role}</span>}
          </div>

          
          <div className="form-group">
            <label htmlFor="notes">Note interne (Optionnel)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ex: Spécialiste échographie, disponible les lundis..."
              rows="3"
            />
          </div>

          
          <div className="form-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Annuler
            </button>
            <button type="submit" className="btn-save">
              ➕ Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPersonnelModal;
