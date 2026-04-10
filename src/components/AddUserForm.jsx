import React, { useEffect, useState } from 'react';
import { PERMISSIONS_BY_ROLE, ROLE_LABELS } from '../auth/permissions';
import '../styles/AddUserForm.css';

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: '',
  department: '',
};

const DEPARTMENTS = [
  'Pediatrie',
  'Gynecologie',
  'Urgence',
  'Radiologie',
  'Chirurgie',
  'Laboratoire',
  'Oncologie',
  'Cardiologie',
  'Accueil',
];

const PAGE_LABELS = {
  dashboard: 'Tableau de bord',
  users: 'Gestion des utilisateurs',
  services: 'Services',
  patients: 'Dossiers patients',
  appointments: 'Rendez-vous',
  calendar: 'Calendrier',
  planning: 'Planning',
  record: 'Dossier patient',
  referrals: 'References',
  hospitalization: 'Hospitalisations',
  settings: 'Parametres systeme',
  analytics: 'Analytics',
  chirurgie: 'Chirurgie',
  gynecologie: 'Gynecologie',
  laboratoire: 'Laboratoire',
  medecineinterne: 'Medecine interne',
  ophtalmologie: 'Ophtalmologie',
  pediatrie: 'Pediatrie',
  radiologie: 'Radiologie',
  urgence: 'Urgence',
};

const getPermissionLabels = (role) =>
  (PERMISSIONS_BY_ROLE[role] || []).map((permission) => PAGE_LABELS[permission] || permission);

const AddUserForm = ({ isOpen, onClose, onSubmit, editingUser = null }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    setFormData(
      editingUser
        ? {
            firstName: editingUser.firstName || '',
            lastName: editingUser.lastName || '',
            email: editingUser.email || '',
            password: editingUser.password || '',
              role: editingUser.role || '',
              department: editingUser.department || '',
          }
        : INITIAL_FORM_DATA
    );
    setErrors({});
  }, [editingUser, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.firstName.trim()) nextErrors.firstName = 'Le prenom est requis';
    if (!formData.lastName.trim()) nextErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) nextErrors.email = "L'email est requis";
    if (!formData.password.trim()) nextErrors.password = 'Le mot de passe est requis';
    if (!formData.role) nextErrors.role = 'Le role est requis';
    if (!formData.department) nextErrors.department = 'Le departement est requis';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    onSubmit?.(formData);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onClose?.();
  };

  if (!isOpen) return null;

  const permissionLabels = getPermissionLabels(formData.role);

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{editingUser ? "Modifier l'utilisateur" : 'Ajouter un nouvel utilisateur'}</h2>
          <p className="form-header-subtitle">
            {editingUser
              ? 'Modifiez les informations puis enregistrez les changements.'
              : 'Les permissions sont appliquees automatiquement selon le role choisi. Un email de bienvenue sera envoye apres creation.'}
          </p>
        </div>

        <form className="form-content" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>
                Prenom <span className="required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Prenom"
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label>
                Nom <span className="required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Nom"
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>
              Mot de passe <span className="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Role <span className="required">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? 'error' : ''}
              >
                <option value="">Selectionner</option>
                {ROLE_LABELS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && <span className="error-message">{errors.role}</span>}
            </div>

            <div className="form-group">
              <label>
                Departement <span className="required">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? 'error' : ''}
              >
                <option value="">Selectionner</option>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              {errors.department && <span className="error-message">{errors.department}</span>}
            </div>
          </div>

          <div className="permissions-panel">
            <div className="permissions-panel-header">
              <span className="permissions-title">Permissions du role</span>
              <span className="permissions-count">{permissionLabels.length} acces</span>
            </div>

            {permissionLabels.length === 0 ? (
              <div className="permissions-empty">Choisissez un role pour voir les permissions attribuees.</div>
            ) : (
              <div className="permissions-list">
                {permissionLabels.map((label) => (
                  <span key={label} className="permission-chip">
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Annuler
            </button>
            <button type="submit" className="btn-create">
              {editingUser ? 'Enregistrer Modifications' : 'Ajouter Utilisateur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
