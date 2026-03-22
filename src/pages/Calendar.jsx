import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import '../styles/Calendar.css';

const DAY_NAMES_FR  = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTH_NAMES_FR = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];

function getWeekDays() {
  const today = new Date();
  const dow   = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      key:     `day${i}`,
      label:   DAY_NAMES_FR[d.getDay()],
      date:    d.getDate(),
      month:   MONTH_NAMES_FR[d.getMonth()],
      isToday: d.toDateString() === today.toDateString(),
    };
  });
}

const WEEK_DAYS = getWeekDays();

const HOURS = [
  '08h','09h','10h','11h','12h',
  '13h','14h','15h','16h','17h','18h',
];

const SERVICES = [
  { key: 'tous',         label: 'Tous les Services', color: '#1a6b4a' },
  { key: 'pediatrie',    label: 'Pédiatrie',          color: '#16a34a' },
  { key: 'gynecologie',  label: 'Gynécologie',         color: '#7c3aed' },
  { key: 'chirurgie',    label: 'Chirurgie',           color: '#374151' },
  { key: 'radiologie',   label: 'Radiologie',          color: '#0f4c75' },
  { key: 'laboratoire',  label: 'Laboratoire',         color: '#b45309' },
  { key: 'urgence',      label: 'Urgence',             color: '#dc2626' },
  { key: 'medecine',     label: 'Méd. Interne',        color: '#0d7377' },
];

const MEDECINS  = ['Tous les médecins','Dr. A. Fournier','Dr. J. Chen','Dr. M. Blanc'];
const CAS_TYPES = ['Tous les cas','Consultation','Suivi','Urgence','Chirurgie','Examen','Vaccination'];

const weekLabel = (() => {
  const f = WEEK_DAYS[0], l = WEEK_DAYS[6];
  return f.month === l.month
    ? `${f.date} — ${l.date} ${l.month}`
    : `${f.date} ${f.month} — ${l.date} ${l.month}`;
})();

const Calendar = () => {
  const [selectedService, setSelectedService] = useState('tous');
  const [selectedMedecin, setSelectedMedecin] = useState('Tous les médecins');
  const [selectedCas,     setSelectedCas]     = useState('Tous les cas');
  const [rdvs,            setRdvs]            = useState([]);
  const [showModal,       setShowModal]       = useState(false);
  const [clickedSlot,     setClickedSlot]     = useState(null);
  const [selectedRdv,     setSelectedRdv]     = useState(null);
  const [newRdv,          setNewRdv]          = useState({
    patient: '', service: 'pediatrie', medecin: MEDECINS[1],
    type: 'Consultation', notes: '',
  });

  const serviceColorMap = {
    pediatrie:    { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
    gynecologie:  { bg: '#f3e8ff', color: '#7c3aed', border: '#c4b5fd' },
    chirurgie:    { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' },
    radiologie:   { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
    laboratoire:  { bg: '#fef3c7', color: '#b45309', border: '#fcd34d' },
    urgence:      { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
    medecine:     { bg: '#ccfbf1', color: '#0f766e', border: '#5eead4' },
  };

  const filtered = rdvs.filter(r => {
    const matchSvc = selectedService === 'tous' || r.service === selectedService;
    const matchMed = selectedMedecin === 'Tous les médecins' || r.medecin === selectedMedecin;
    const matchCas = selectedCas === 'Tous les cas' || r.type === selectedCas;
    return matchSvc && matchMed && matchCas;
  });

  const getRdvsFor = (dayKey, heure) =>
    filtered.filter(r => r.dayKey === dayKey && r.heure === heure);

  const handleCellClick = (dayKey, heure) => {
    setClickedSlot({ dayKey, heure });
    setNewRdv({ patient: '', service: 'pediatrie', medecin: MEDECINS[1], type: 'Consultation', notes: '' });
    setShowModal('add');
  };

  const handleAddRdv = () => {
    if (!newRdv.patient.trim()) return;
    setRdvs(prev => [...prev, {
      ...newRdv,
      ...clickedSlot,
      id: Date.now(),
      initiale: newRdv.patient.trim()[0].toUpperCase(),
    }]);
    setShowModal(false);
  };

  const handleRdvClick = (e, rdv) => {
    e.stopPropagation();
    setSelectedRdv(rdv);
    setShowModal('detail');
  };

  const handleDelete = (id) => {
    setRdvs(prev => prev.filter(r => r.id !== id));
    setShowModal(false);
  };

  const totalRdvs   = filtered.length;
  const todayRdvs   = filtered.filter(r => WEEK_DAYS.find(d => d.key === r.dayKey)?.isToday).length;
  const urgentRdvs  = filtered.filter(r => r.service === 'urgence' || r.type === 'Urgence').length;

  return (
    <div className="cal-container">

      
      <div className="cal-header">
        <div>
          <h1 className="cal-title">Agenda <span>Multi-Services</span></h1>
          <p className="cal-subtitle">Semaine du {weekLabel}</p>
        </div>
        <div className="cal-actions">
          <button className="cal-btn-sync" onClick={() => alert('Synchronisation...')}>
            <RefreshCw size={14} /> Synchroniser
          </button>
          <button className="cal-btn-add" onClick={() => { setClickedSlot({ dayKey: WEEK_DAYS[0].key, heure: '09h' }); setShowModal('add'); }}>
            <Plus size={16} /> Ajouter RDV
          </button>
        </div>
      </div>

      
      <div className="cal-stats">
        {[
          { label: 'RDV semaine', value: totalRdvs,  icon: '📅', cls: 'total' },
          { label: "Aujourd'hui", value: todayRdvs,  icon: '🕐', cls: 'today' },
          { label: 'Urgences',    value: urgentRdvs, icon: '🚨', cls: 'urg'   },
        ].map(s => (
          <div key={s.cls} className={`cal-stat-card ${s.cls}`}>
            <span className="cal-stat-icon">{s.icon}</span>
            <div>
              <div className="cal-stat-value">{s.value}</div>
              <div className="cal-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="cal-services">
        {SERVICES.map(s => (
          <button
            key={s.key}
            className={`cal-service-tab ${selectedService === s.key ? 'active' : ''}`}
            style={selectedService === s.key ? { background: s.color, color: 'white', borderColor: s.color } : {}}
            onClick={() => setSelectedService(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      
      <div className="cal-filters">
        <span className="cal-filter-label">Filtrer :</span>
        <select className="cal-select" value={selectedMedecin} onChange={e => setSelectedMedecin(e.target.value)}>
          {MEDECINS.map(m => <option key={m}>{m}</option>)}
        </select>
        <select className="cal-select" value={selectedCas} onChange={e => setSelectedCas(e.target.value)}>
          {CAS_TYPES.map(c => <option key={c}>{c}</option>)}
        </select>
        <span className="cal-rdv-count">{filtered.length} RDV affichés</span>
      </div>

      
      <div className="cal-grid-wrap">
        <table className="cal-table">
          <thead>
            <tr>
              <th className="cal-th-time" />
              {WEEK_DAYS.map(d => (
                <th key={d.key} className={`cal-th-day ${d.isToday ? 'today' : ''}`}>
                  <div className="cal-th-label">{d.label}</div>
                  <div className={`cal-th-date ${d.isToday ? 'today-circle' : ''}`}>{d.date}</div>
                  <div className="cal-th-month">{d.month}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map(heure => (
              <tr key={heure} className="cal-row">
                <td className="cal-td-time">{heure}</td>
                {WEEK_DAYS.map(d => {
                  const slotRdvs = getRdvsFor(d.key, heure);
                  return (
                    <td
                      key={d.key}
                      className={`cal-td-cell ${d.isToday ? 'today-col' : ''}`}
                      onClick={() => handleCellClick(d.key, heure)}
                    >
                      {slotRdvs.map(rdv => {
                        const cfg = serviceColorMap[rdv.service] || serviceColorMap.medecine;
                        return (
                          <div
                            key={rdv.id}
                            className="cal-rdv"
                            style={{ background: cfg.bg, color: cfg.color, borderLeft: `3px solid ${cfg.border}` }}
                            onClick={e => handleRdvClick(e, rdv)}
                          >
                            <div className="cal-rdv-type">{rdv.type}</div>
                            <div className="cal-rdv-patient">{rdv.patient}</div>
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {filtered.length === 0 && (
        <div className="cal-empty">
          <div className="cal-empty-icon">📅</div>
          <div className="cal-empty-title">Aucun RDV cette semaine</div>
          <div className="cal-empty-sub">Cliquez sur une cellule ou "+ Ajouter RDV" pour planifier</div>
        </div>
      )}

      
      <div className="cal-legend">
        {SERVICES.filter(s => s.key !== 'tous').map(s => (
          <span key={s.key} className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      
      {showModal === 'add' && (
        <div className="cal-overlay" onClick={() => setShowModal(false)}>
          <div className="cal-modal" onClick={e => e.stopPropagation()}>
            <div className="cal-modal-head">
              <span className="cal-modal-title">➕ Nouveau RDV</span>
              <button className="cal-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="cal-modal-body">
              <div className="cal-form-row">
                <label>Nom du patient *</label>
                <input className="cal-form-input" placeholder="Ex: L. Dubois"
                  value={newRdv.patient} onChange={e => setNewRdv({...newRdv, patient: e.target.value})} />
              </div>
              <div className="cal-form-grid">
                <div className="cal-form-row">
                  <label>Service</label>
                  <select className="cal-form-select" value={newRdv.service} onChange={e => setNewRdv({...newRdv, service: e.target.value})}>
                    {SERVICES.filter(s => s.key !== 'tous').map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <div className="cal-form-row">
                  <label>Médecin</label>
                  <select className="cal-form-select" value={newRdv.medecin} onChange={e => setNewRdv({...newRdv, medecin: e.target.value})}>
                    {MEDECINS.filter(m => m !== 'Tous les médecins').map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="cal-form-row">
                  <label>Jour</label>
                  <select className="cal-form-select" value={clickedSlot?.dayKey} onChange={e => setClickedSlot({...clickedSlot, dayKey: e.target.value})}>
                    {WEEK_DAYS.map(d => <option key={d.key} value={d.key}>{d.label} {d.date} {d.month}</option>)}
                  </select>
                </div>
                <div className="cal-form-row">
                  <label>Heure</label>
                  <select className="cal-form-select" value={clickedSlot?.heure} onChange={e => setClickedSlot({...clickedSlot, heure: e.target.value})}>
                    {HOURS.map(h => <option key={h}>{h}</option>)}
                  </select>
                </div>
                <div className="cal-form-row">
                  <label>Type de cas</label>
                  <select className="cal-form-select" value={newRdv.type} onChange={e => setNewRdv({...newRdv, type: e.target.value})}>
                    {CAS_TYPES.filter(c => c !== 'Tous les cas').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="cal-form-row">
                <label>Notes</label>
                <textarea className="cal-form-input cal-form-ta" placeholder="Notes..."
                  value={newRdv.notes} onChange={e => setNewRdv({...newRdv, notes: e.target.value})} />
              </div>
            </div>
            <div className="cal-modal-foot">
              <button className="cal-btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="cal-btn-save" onClick={handleAddRdv}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      
      {showModal === 'detail' && selectedRdv && (() => {
        const cfg = serviceColorMap[selectedRdv.service] || serviceColorMap.medecine;
        const svc = SERVICES.find(s => s.key === selectedRdv.service);
        const day = WEEK_DAYS.find(d => d.key === selectedRdv.dayKey);
        return (
          <div className="cal-overlay" onClick={() => setShowModal(false)}>
            <div className="cal-modal" onClick={e => e.stopPropagation()}>
              <div className="cal-modal-head" style={{ borderBottom: `3px solid ${cfg.border}` }}>
                <span className="cal-modal-title" style={{ color: cfg.color }}>📅 Détail RDV</span>
                <button className="cal-modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="cal-modal-body">
                <div className="cal-detail-patient">
                  <div className="cal-detail-avatar" style={{ background: cfg.color }}>{selectedRdv.initiale}</div>
                  <div>
                    <div className="cal-detail-name">{selectedRdv.patient}</div>
                    <div className="cal-detail-svc" style={{ color: cfg.color }}>{svc?.label}</div>
                  </div>
                </div>
                <div className="cal-detail-grid">
                  {[
                    { label: 'Médecin', value: selectedRdv.medecin },
                    { label: 'Jour',    value: day ? `${day.label} ${day.date} ${day.month}` : '—' },
                    { label: 'Heure',   value: selectedRdv.heure },
                    { label: 'Type',    value: selectedRdv.type },
                    { label: 'Notes',   value: selectedRdv.notes || '—' },
                  ].map(f => (
                    <div key={f.label} className="cal-detail-field">
                      <label>{f.label}</label>
                      <p>{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="cal-modal-foot">
                <button className="cal-btn-delete" onClick={() => handleDelete(selectedRdv.id)}>🗑 Supprimer</button>
                <button className="cal-btn-cancel" onClick={() => setShowModal(false)}>Fermer</button>
                <button className="cal-btn-save" onClick={() => setShowModal(false)}>Modifier</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Calendar;
