import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Toast from './Toast';
import '../styles/AdmissionPatientModal.css';

const SERVICE_OPTIONS = [
  { value: 'pediatrie', label: 'Pediatrie' },
  { value: 'cardiologie', label: 'Cardiologie' },
  { value: 'gynecologie', label: 'Gynecologie' },
  { value: 'ophtalmologie', label: 'Ophtalmologie' },
  { value: 'radiologie', label: 'Radiologie' },
  { value: 'laboratoire', label: 'Laboratoire' },
  { value: 'chirurgie', label: 'Chirurgie' },
  { value: 'medecine-interne', label: 'Medecine interne' },
  { value: 'urgence', label: 'Urgence' },
];

const BLOOD_TYPE_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const GENDER_OPTIONS = [
  { value: 'homme', label: 'Homme' },
  { value: 'femme', label: 'Femme' },
  { value: 'autre', label: 'Autre' },
];

const normalize = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const resolveServiceValue = (defaultService) => {
  if (!defaultService) return '';
  const match = SERVICE_OPTIONS.find(
    (option) =>
      normalize(option.label) === normalize(defaultService) ||
      normalize(option.value) === normalize(defaultService)
  );
  return match ? match.value : '';
};

const buildEmptyForm = (serviceValue) => ({
  fullName: '',
  birthDate: '',
  gender: 'homme',
  phone: '',
  service: serviceValue,
  bloodType: '',
  medicalHistory: '',
  emergencyName: '',
  emergencyRelation: '',
  emergencyPhone: '',
});

const getTodayIso = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().split('T')[0];
};

const AdmissionPatientModal = ({
  isOpen,
  onClose,
  defaultService,
  onSubmit,
  patientIdPreview,
}) => {
  const defaultServiceValue = resolveServiceValue(defaultService);
  const [form, setForm] = useState(() => buildEmptyForm(defaultServiceValue));
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setForm(buildEmptyForm(defaultServiceValue));
    setErrors({});
    setToast(null);
  }, [defaultServiceValue, isOpen]);

  if (!isOpen) return null;

  const setField = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Nom complet obligatoire';
    }
    if (!form.birthDate) {
      nextErrors.birthDate = 'Date de naissance obligatoire';
    } else if (form.birthDate > getTodayIso()) {
      nextErrors.birthDate = 'La date ne peut pas etre dans le futur';
    }
    if (!form.phone.trim()) {
      nextErrors.phone = 'Telephone obligatoire';
    }
    if (!form.service) {
      nextErrors.service = 'Service obligatoire';
    }
    if (!form.bloodType) {
      nextErrors.bloodType = 'Groupe sanguin obligatoire';
    }
    if (!form.emergencyName.trim()) {
      nextErrors.emergencyName = "Nom du contact obligatoire";
    }
    if (!form.emergencyRelation.trim()) {
      nextErrors.emergencyRelation = 'Lien de parente obligatoire';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      serviceLabel:
        SERVICE_OPTIONS.find((option) => option.value === form.service)?.label || form.service,
    };

    if (onSubmit) {
      onSubmit(payload);
      return;
    }

    setToast({ message: 'Dossier patient enregistre', type: 'success' });
    setForm(buildEmptyForm(defaultServiceValue));
  };

  return (
    <div className="admission-overlay" onClick={onClose}>
      <div className="admission-modal" onClick={(event) => event.stopPropagation()}>
        <div className="admission-header">
          <div>
            <div className="admission-title">Ajouter un nouveau dossier patient</div>
            <div className="admission-subtitle">
              Saisie structuree pour les informations personnelles, medicales et d'urgence
            </div>
          </div>
          <button
            type="button"
            className="admission-close"
            onClick={onClose}
            aria-label="Fermer le formulaire"
          >
            <X size={24} strokeWidth={2.4} />
          </button>
        </div>

        <form className="admission-body" onSubmit={handleSubmit}>
          <div className="admission-section">
            <div className="admission-section-title">Informations personnelles</div>
            <div className="admission-grid three">
              <div className="admission-field admission-field-span-two">
                <label className="admission-label">Patient ID (auto-genere)</label>
                <input
                  className="admission-input admission-readonly"
                  value={patientIdPreview || 'Genere par le backend'}
                  readOnly
                />
              </div>

              <div className="admission-field admission-field-span-two">
                <label className="admission-label">
                  Nom complet <span className="admission-required">*</span>
                </label>
                <input
                  className={`admission-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Nom et prenom du patient"
                  value={form.fullName}
                  onChange={setField('fullName')}
                />
                {errors.fullName && <span className="admission-error">{errors.fullName}</span>}
              </div>

              <div className="admission-field">
                <label className="admission-label">
                  Date de naissance <span className="admission-required">*</span>
                </label>
                <input
                  type="date"
                  max={getTodayIso()}
                  className={`admission-input ${errors.birthDate ? 'error' : ''}`}
                  value={form.birthDate}
                  onChange={setField('birthDate')}
                />
                {errors.birthDate && <span className="admission-error">{errors.birthDate}</span>}
              </div>

              <div className="admission-field">
                <label className="admission-label">Sexe</label>
                <div className="admission-radio-group">
                  {GENDER_OPTIONS.map((option) => (
                    <label key={option.value} className="admission-radio">
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={form.gender === option.value}
                        onChange={setField('gender')}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="admission-field">
                <label className="admission-label">
                  Numero de telephone <span className="admission-required">*</span>
                </label>
                <input
                  type="tel"
                  className={`admission-input ${errors.phone ? 'error' : ''}`}
                  placeholder="05xxxxxxxx"
                  value={form.phone}
                  onChange={setField('phone')}
                />
                {errors.phone && <span className="admission-error">{errors.phone}</span>}
              </div>
            </div>
          </div>

          <div className="admission-section">
            <div className="admission-section-title">Details medicaux</div>
            <div className="admission-grid three">
              <div className="admission-field">
                <label className="admission-label">
                  Service <span className="admission-required">*</span>
                </label>
                <select
                  className={`admission-input ${errors.service ? 'error' : ''}`}
                  value={form.service}
                  onChange={setField('service')}
                >
                  <option value="">-- Selectionnez --</option>
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.service && <span className="admission-error">{errors.service}</span>}
              </div>

              <div className="admission-field">
                <label className="admission-label">
                  Groupe sanguin <span className="admission-required">*</span>
                </label>
                <select
                  className={`admission-input ${errors.bloodType ? 'error' : ''}`}
                  value={form.bloodType}
                  onChange={setField('bloodType')}
                >
                  <option value="">-- Selectionnez --</option>
                  {BLOOD_TYPE_OPTIONS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                {errors.bloodType && <span className="admission-error">{errors.bloodType}</span>}
              </div>

              <div className="admission-field admission-field-span-three">
                <label className="admission-label">Antecedents</label>
                <textarea
                  className="admission-textarea"
                  rows={4}
                  placeholder="Informations cliniques, allergies, pathologies chroniques..."
                  value={form.medicalHistory}
                  onChange={setField('medicalHistory')}
                />
              </div>
            </div>
          </div>

          <div className="admission-section">
            <div className="admission-section-title">Contact d'urgence</div>
            <div className="admission-grid three">
              <div className="admission-field">
                <label className="admission-label">
                  Nom du contact <span className="admission-required">*</span>
                </label>
                <input
                  className={`admission-input ${errors.emergencyName ? 'error' : ''}`}
                  value={form.emergencyName}
                  onChange={setField('emergencyName')}
                />
                {errors.emergencyName && (
                  <span className="admission-error">{errors.emergencyName}</span>
                )}
              </div>

              <div className="admission-field">
                <label className="admission-label">
                  Lien de parente <span className="admission-required">*</span>
                </label>
                <input
                  className={`admission-input ${errors.emergencyRelation ? 'error' : ''}`}
                  value={form.emergencyRelation}
                  onChange={setField('emergencyRelation')}
                />
                {errors.emergencyRelation && (
                  <span className="admission-error">{errors.emergencyRelation}</span>
                )}
              </div>

              <div className="admission-field">
                <label className="admission-label">Telephone du contact</label>
                <input
                  type="tel"
                  className="admission-input"
                  value={form.emergencyPhone}
                  onChange={setField('emergencyPhone')}
                />
              </div>
            </div>
          </div>

          <div className="admission-actions">
            <button type="button" className="admission-btn cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="admission-btn submit">
              Enregistrer
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <div onClick={(event) => event.stopPropagation()}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default AdmissionPatientModal;
