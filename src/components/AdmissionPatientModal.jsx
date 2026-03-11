import React, { useEffect, useMemo, useState } from 'react';
import Toast from './Toast';
import '../styles/admission-patient-modal.css';

const SERVICE_OPTIONS = [
  { value: 'pediatrie', label: 'Pédiatrie' },
  { value: 'gynecologie', label: 'Gynécologie' },
  { value: 'ophtalmologie', label: 'Ophtalmologie' },
  { value: 'radiologie', label: 'Radiologie' },
  { value: 'laboratoire', label: 'Laboratoire' },
  { value: 'chirurgie', label: 'Chirurgie' },
  { value: 'medecine-interne', label: 'Médecine interne' },
  { value: 'urgence', label: 'Urgence' },
];

const GENDER_OPTIONS = [
  { value: 'masculin', label: 'Masculin' },
  { value: 'feminin', label: 'Féminin' },
];

const normalize = (value) => (value || '').toLowerCase().trim();

const resolveServiceValue = (defaultService) => {
  if (!defaultService) return SERVICE_OPTIONS[0].value;
  const match = SERVICE_OPTIONS.find(
    (opt) =>
      normalize(opt.label) === normalize(defaultService) ||
      normalize(opt.value) === normalize(defaultService)
  );
  return match ? match.value : SERVICE_OPTIONS[0].value;
};

const buildEmptyForm = (serviceValue) => ({
  searchExisting: '',
  nom: '',
  prenom: '',
  dateNaissance: '',
  genre: 'feminin',
  telephone: '',
  contactUrgence: '',
  lienParente: '',
  serviceDemande: serviceValue,
  motif: '',
});

const AdmissionPatientModal = ({ isOpen, onClose, defaultService, onSubmit }) => {
  const defaultServiceValue = useMemo(
    () => resolveServiceValue(defaultService),
    [defaultService]
  );

  const [form, setForm] = useState(() => buildEmptyForm(defaultServiceValue));
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setForm(buildEmptyForm(defaultServiceValue));
    setErrors({});
    setToast(null);
  }, [isOpen, defaultServiceValue]);

  if (!isOpen) return null;

  const setField = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.nom.trim()) nextErrors.nom = 'Nom obligatoire';
    if (!form.prenom.trim()) nextErrors.prenom = 'Prénom obligatoire';
    if (!form.telephone.trim()) nextErrors.telephone = 'Téléphone obligatoire';
    if (!form.serviceDemande) nextErrors.serviceDemande = 'Service obligatoire';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit?.(form);
    setToast({ message: 'Patient admis avec succès', type: 'success' });
  };

  return (
    <div className="admission-overlay" onClick={onClose}>
      <div className="admission-modal" onClick={(event) => event.stopPropagation()}>
        <div className="admission-header">
          <div>
            <div className="admission-title">Admission / Créer un dossier patient</div>
            <div className="admission-subtitle">Réception - saisie rapide et fiable</div>
          </div>
          <button type="button" className="admission-header-btn">
            + Admettre un patient
          </button>
        </div>

        <form className="admission-body" onSubmit={handleSubmit}>
          <div className="admission-search">
            <label className="admission-label">Recherche d’un patient existant</label>
            <input
              className="admission-input"
              placeholder="Rechercher un patient..."
              value={form.searchExisting}
              onChange={setField('searchExisting')}
            />
          </div>

          <div className="admission-section">
            <div className="admission-section-title">Informations personnelles</div>
            <div className="admission-grid two">
              <div className="admission-field">
                <label className="admission-label">
                  Nom <span className="admission-required">*</span>
                </label>
                <input
                  className={`admission-input ${errors.nom ? 'error' : ''}`}
                  value={form.nom}
                  onChange={setField('nom')}
                />
                {errors.nom && <span className="admission-error">{errors.nom}</span>}
              </div>
              <div className="admission-field">
                <label className="admission-label">
                  Prénom <span className="admission-required">*</span>
                </label>
                <input
                  className={`admission-input ${errors.prenom ? 'error' : ''}`}
                  value={form.prenom}
                  onChange={setField('prenom')}
                />
                {errors.prenom && <span className="admission-error">{errors.prenom}</span>}
              </div>
              <div className="admission-field">
                <label className="admission-label">Date de naissance</label>
                <input
                  type="date"
                  className="admission-input"
                  value={form.dateNaissance}
                  onChange={setField('dateNaissance')}
                />
              </div>
              <div className="admission-field">
                <label className="admission-label">Genre</label>
                <div className="admission-radio-group">
                  {GENDER_OPTIONS.map((opt) => (
                    <label key={opt.value} className="admission-radio">
                      <input
                        type="radio"
                        name="genre"
                        value={opt.value}
                        checked={form.genre === opt.value}
                        onChange={setField('genre')}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="admission-section">
            <div className="admission-section-title">Coordonnées & sécurité</div>
            <div className="admission-grid two">
              <div className="admission-field">
                <label className="admission-label">
                  Téléphone <span className="admission-required">*</span>
                </label>
                <input
                  type="tel"
                  className={`admission-input ${errors.telephone ? 'error' : ''}`}
                  value={form.telephone}
                  onChange={setField('telephone')}
                />
                {errors.telephone && <span className="admission-error">{errors.telephone}</span>}
              </div>
              <div className="admission-field">
                <label className="admission-label">Contact d'urgence</label>
                <input
                  className="admission-input"
                  value={form.contactUrgence}
                  onChange={setField('contactUrgence')}
                />
              </div>
              <div className="admission-field">
                <label className="admission-label">Lien de parenté</label>
                <input
                  className="admission-input"
                  value={form.lienParente}
                  onChange={setField('lienParente')}
                />
              </div>
            </div>
          </div>

          <div className="admission-section">
            <div className="admission-section-title">Orientation médicale</div>
            <div className="admission-grid two">
              <div className="admission-field">
                <label className="admission-label">
                  Service demandé <span className="admission-required">*</span>
                </label>
                <select
                  className={`admission-input ${errors.serviceDemande ? 'error' : ''}`}
                  value={form.serviceDemande}
                  onChange={setField('serviceDemande')}
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.serviceDemande && (
                  <span className="admission-error">{errors.serviceDemande}</span>
                )}
              </div>
              <div className="admission-field">
                <label className="admission-label">Motif de consultation</label>
                <textarea
                  className="admission-textarea"
                  rows={3}
                  value={form.motif}
                  onChange={setField('motif')}
                />
              </div>
            </div>
          </div>

          <div className="admission-actions">
            <button type="button" className="admission-btn cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="admission-btn submit">
              Créer le dossier
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
