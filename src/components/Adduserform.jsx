import React, { useState } from 'react';
import '../styles/Adduserform.css';

const AddUserForm = ({ isOpen, onClose, onSubmit, editingUser = null }) => {
  const [formData, setFormData] = useState(
    editingUser || {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      department: ''
    }
  );

  const [errors, setErrors] = useState({});

  const roles = [
    'Administrateur',
    'Réceptionniste',
    'Médecin',
    'Médecin Chef',
    'Infirmier'
  ];

  const departments = [
    'Pédiatrie',
    'Gynécologie',
    'Urgence',
    'Radiologie',
    'Chirurgie',
    'Laboratoire',
    'Oncologie',
    'Cardiologie',
    'Accueil'
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    }
    if (!formData.role) {
      newErrors.role = 'Le rôle est requis';
    }
    if (!formData.department) {
      newErrors.department = 'Le département est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      department: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      department: ''
    });
    setErrors({});
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{editingUser ? "✏️ Modifier l'utilisateur" : '➕ Ajouter un nouvel utilisateur'}</h2>
        </div>
        
        <form className="form-content" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Prénom : <span className="required">*</span></label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ex: Alice"
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label>Nom : <span className="required">*</span></label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ex: Fournier"
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Email : <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: alice@hospital.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Mot de passe : <span className="required">*</span></label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rôle : <span className="required">*</span></label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? 'error' : ''}
              >
                <option value="">Sélectionner</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {errors.role && (
                <span className="error-message">{errors.role}</span>
              )}
            </div>

            <div className="form-group">
              <label>Département : <span className="required">*</span></label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? 'error' : ''}
              >
                <option value="">Sélectionner</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <span className="error-message">{errors.department}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="btn-cancel"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn-create"
            >
              {editingUser ? 'Sauvegarder' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
