import React, { useMemo, useState } from 'react';
import { Edit2, Hospital, Plus, Save, Trash2, Users, BedDouble, FileText } from 'lucide-react';
import { getServiceLabel, getServiceStats, loadServiceState, saveServiceState } from './chefStore';
import '../styles/Dashboard.css';

const TAB_CONFIG = [
  { id: 'service', label: 'Service', icon: Hospital },
  { id: 'doctors', label: 'Médecins', icon: Users },
  { id: 'nurses', label: 'Infirmiers', icon: Users },
  { id: 'rooms', label: 'Chambres', icon: BedDouble },
  { id: 'patients', label: 'Patients', icon: FileText },
];

const createDraft = (tab, state) => {
  if (tab === 'service') {
    return {
      name: state.service.name,
      chief: state.service.chief,
      location: state.service.location,
      phone: state.service.phone,
      description: state.service.description,
    };
  }

  if (tab === 'doctors') {
    return {
      name: '',
      specialty: '',
      consultationsThisMonth: 0,
      patientsAssigned: 0,
    };
  }

  if (tab === 'nurses') {
    return {
      name: '',
      shift: 'Matin',
      status: 'Disponible',
    };
  }

  if (tab === 'rooms') {
    return {
      number: '',
      floor: 1,
      capacity: 1,
      occupied: 0,
      status: 'Disponible',
      patientName: '',
    };
  }

  return {};
};

const ChefServices = ({ serviceId }) => {
  const [state, setState] = useState(() => loadServiceState(serviceId));
  const [activeTab, setActiveTab] = useState('service');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(() => createDraft('service', loadServiceState(serviceId)));
  const [patientAssignments, setPatientAssignments] = useState({});

  const stats = useMemo(() => getServiceStats(state), [state]);

  const persist = (nextState) => {
    setState(nextState);
    saveServiceState(serviceId, nextState);
  };

  const resetDraft = (tab = activeTab) => {
    setEditingId(null);
    setDraft(createDraft(tab, state));
  };

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    resetDraft(tab);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    if (activeTab === 'service') {
      setDraft({
        name: state.service.name,
        chief: state.service.chief,
        location: state.service.location,
        phone: state.service.phone,
        description: state.service.description,
      });
      return;
    }

    if (activeTab === 'doctors') {
      setDraft({
        name: item.name,
        specialty: item.specialty,
        consultationsThisMonth: item.consultationsThisMonth,
        patientsAssigned: item.patientsAssigned,
      });
      return;
    }

    if (activeTab === 'nurses') {
      setDraft({
        name: item.name,
        shift: item.shift,
        status: item.status,
      });
      return;
    }

    if (activeTab === 'rooms') {
      setDraft({
        number: item.number,
        floor: item.floor,
        capacity: item.capacity,
        occupied: item.occupied,
        status: item.status,
        patientName: item.patientName,
      });
    }
  };

  const handleDelete = (itemId) => {
    if (activeTab === 'doctors') {
      const remainingDoctors = state.staff.doctors.filter((item) => item.id !== itemId);
      persist({
        ...state,
        staff: { ...state.staff, doctors: remainingDoctors },
        patients: state.patients.map((patient) =>
          patient.assignedDoctorId === itemId
            ? {
                ...patient,
                assignedDoctorId: '',
                assignedDoctorName: '',
              }
            : patient
        ),
      });
      setPatientAssignments({});
    }

    if (activeTab === 'nurses') {
      persist({
        ...state,
        staff: { ...state.staff, nurses: state.staff.nurses.filter((item) => item.id !== itemId) },
      });
    }

    if (activeTab === 'rooms') {
      persist({
        ...state,
        staff: { ...state.staff, rooms: state.staff.rooms.filter((item) => item.id !== itemId) },
      });
    }

    if (editingId === itemId) {
      resetDraft();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (activeTab === 'service') {
      persist({
        ...state,
        service: {
          ...state.service,
          name: draft.name,
          chief: draft.chief,
          location: draft.location,
          phone: draft.phone,
          description: draft.description,
        },
      });
      return;
    }

    if (activeTab === 'doctors') {
      const nextDoctor = {
        id: editingId || `${serviceId}-doctor-${Date.now()}`,
        name: draft.name,
        specialty: draft.specialty,
        consultationsThisMonth: Number(draft.consultationsThisMonth) || 0,
        patientsAssigned: Number(draft.patientsAssigned) || 0,
      };

      persist({
        ...state,
        staff: {
          ...state.staff,
          doctors: editingId
            ? state.staff.doctors.map((doctor) => (doctor.id === editingId ? nextDoctor : doctor))
            : [nextDoctor, ...state.staff.doctors],
        },
      });
    }

    if (activeTab === 'nurses') {
      const nextNurse = {
        id: editingId || `${serviceId}-nurse-${Date.now()}`,
        name: draft.name,
        shift: draft.shift,
        status: draft.status,
      };

      persist({
        ...state,
        staff: {
          ...state.staff,
          nurses: editingId
            ? state.staff.nurses.map((nurse) => (nurse.id === editingId ? nextNurse : nurse))
            : [nextNurse, ...state.staff.nurses],
        },
      });
    }

    if (activeTab === 'rooms') {
      const nextRoom = {
        id: editingId || `${serviceId}-room-${Date.now()}`,
        number: draft.number,
        floor: Number(draft.floor) || 1,
        capacity: Number(draft.capacity) || 1,
        occupied: Number(draft.occupied) || 0,
        status: draft.status,
        patientName: draft.patientName,
      };

      persist({
        ...state,
        staff: {
          ...state.staff,
          rooms: editingId
            ? state.staff.rooms.map((room) => (room.id === editingId ? nextRoom : room))
            : [nextRoom, ...state.staff.rooms],
        },
      });
    }

    resetDraft();
  };

  const handleAssignmentChange = (patientId, doctorId) => {
    setPatientAssignments((current) => ({
      ...current,
      [patientId]: doctorId,
    }));

    const doctor = state.staff.doctors.find((item) => item.id === doctorId);
    const nextPatients = state.patients.map((patient) =>
      patient.id === patientId
        ? {
            ...patient,
            assignedDoctorId: doctorId,
            assignedDoctorName: doctor?.name || '',
          }
        : patient
    );

    persist({
      ...state,
      patients: nextPatients,
    });
  };

  const roomsCapacity = state.staff.rooms.reduce((sum, room) => sum + room.capacity, 0);
  const roomsOccupied = state.staff.rooms.reduce((sum, room) => sum + room.occupied, 0);

  const renderTabContent = () => {
    if (activeTab === 'service') {
      return (
        <form className="settings-language-card" onSubmit={handleSubmit}>
          <label className="settings-field">
            <span>Nom du service</span>
            <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
          </label>
          <label className="settings-field">
            <span>Médecin chef</span>
            <input value={draft.chief} onChange={(event) => setDraft((current) => ({ ...current, chief: event.target.value }))} />
          </label>
          <label className="settings-field">
            <span>Localisation</span>
            <input value={draft.location} onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))} />
          </label>
          <label className="settings-field">
            <span>Téléphone</span>
            <input value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} />
          </label>
          <label className="settings-field">
            <span>Description</span>
            <textarea
              rows={4}
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
            />
          </label>
          <button type="submit" className="dashboard-button dashboard-button--primary">
            <Save size={16} />
            Enregistrer le service
          </button>
        </form>
      );
    }

    if (activeTab === 'patients') {
      return (
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Médecin assigné</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.patients.map((patient) => {
                const selectedDoctorId =
                  patientAssignments[patient.id] ||
                  patient.assignedDoctorId ||
                  state.staff.doctors[0]?.id ||
                  '';

                return (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>
                      <select
                        value={selectedDoctorId}
                        onChange={(event) => handleAssignmentChange(patient.id, event.target.value)}
                      >
                        {state.staff.doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{patient.status}</td>
                    <td>
                      <span className="dashboard-chip dashboard-chip--neutral">Lecture seule</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    const items = activeTab === 'doctors' ? state.staff.doctors : activeTab === 'nurses' ? state.staff.nurses : state.staff.rooms;

    return (
      <div className="dashboard-grid dashboard-grid--overview">
        <div className="dashboard-stack">
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">{TAB_CONFIG.find((tab) => tab.id === activeTab)?.label}</h2>
                <p className="dashboard-panel-subtitle">Ajout, modification et suppression locale.</p>
              </div>
              <button
                type="button"
                className="dashboard-button dashboard-button--primary"
                onClick={() => {
                  setEditingId(null);
                  setDraft(createDraft(activeTab, state));
                }}
              >
                <Plus size={16} />
                Nouveau
              </button>
            </div>

            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    {activeTab === 'doctors' && (
                      <>
                        <th>Nom</th>
                        <th>Spécialité</th>
                        <th>Consultations</th>
                        <th>Patients</th>
                      </>
                    )}
                    {activeTab === 'nurses' && (
                      <>
                        <th>Nom</th>
                        <th>Service</th>
                        <th>Statut</th>
                      </>
                    )}
                    {activeTab === 'rooms' && (
                      <>
                        <th>Chambre</th>
                        <th>Étage</th>
                        <th>Capacité</th>
                        <th>Occupés</th>
                        <th>Statut</th>
                      </>
                    )}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'rooms' ? 6 : activeTab === 'doctors' ? 5 : 4}>
                        <div className="role-empty">Aucun élément pour le moment.</div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id}>
                        {activeTab === 'doctors' && (
                          <>
                            <td>{item.name}</td>
                            <td>{item.specialty}</td>
                            <td>{item.consultationsThisMonth}</td>
                            <td>{item.patientsAssigned}</td>
                          </>
                        )}
                        {activeTab === 'nurses' && (
                          <>
                            <td>{item.name}</td>
                            <td>{item.shift}</td>
                            <td>{item.status}</td>
                          </>
                        )}
                        {activeTab === 'rooms' && (
                          <>
                            <td>{item.number}</td>
                            <td>{item.floor}</td>
                            <td>{item.capacity}</td>
                            <td>{item.occupied}</td>
                            <td>{item.status}</td>
                          </>
                        )}
                        <td>
                          <div className="dashboard-row-actions">
                            <button type="button" className="dashboard-button dashboard-button--ghost" onClick={() => handleEdit(item)}>
                              <Edit2 size={14} />
                              Modifier
                            </button>
                            <button type="button" className="dashboard-button dashboard-button--ghost" onClick={() => handleDelete(item.id)}>
                              <Trash2 size={14} />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">{editingId ? 'Modifier' : 'Ajouter'}</h2>
              <p className="dashboard-panel-subtitle">Formulaire lié au tab actif.</p>
            </div>
          </div>

          <form className="settings-language-card" onSubmit={handleSubmit}>
            {activeTab === 'doctors' && (
              <>
                <label className="settings-field">
                  <span>Nom</span>
                  <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
                </label>
                <label className="settings-field">
                  <span>Spécialité</span>
                  <input value={draft.specialty} onChange={(event) => setDraft((current) => ({ ...current, specialty: event.target.value }))} />
                </label>
                <label className="settings-field">
                  <span>Consultations du mois</span>
                  <input
                    type="number"
                    value={draft.consultationsThisMonth}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, consultationsThisMonth: event.target.value }))
                    }
                  />
                </label>
                <label className="settings-field">
                  <span>Patients assignés</span>
                  <input
                    type="number"
                    value={draft.patientsAssigned}
                    onChange={(event) => setDraft((current) => ({ ...current, patientsAssigned: event.target.value }))}
                  />
                </label>
              </>
            )}

            {activeTab === 'nurses' && (
              <>
                <label className="settings-field">
                  <span>Nom</span>
                  <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
                </label>
                <label className="settings-field">
                  <span>Équipe</span>
                  <select value={draft.shift} onChange={(event) => setDraft((current) => ({ ...current, shift: event.target.value }))}>
                    <option value="Matin">Matin</option>
                    <option value="Soir">Soir</option>
                    <option value="Nuit">Nuit</option>
                  </select>
                </label>
                <label className="settings-field">
                  <span>Statut</span>
                  <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>
                    <option value="Disponible">Disponible</option>
                    <option value="Présent">Présent</option>
                    <option value="En congé">En congé</option>
                  </select>
                </label>
              </>
            )}

            {activeTab === 'rooms' && (
              <>
                <label className="settings-field">
                  <span>Numéro</span>
                  <input value={draft.number} onChange={(event) => setDraft((current) => ({ ...current, number: event.target.value }))} />
                </label>
                <div className="chef-form-grid">
                  <label className="settings-field">
                    <span>Étage</span>
                    <input
                      type="number"
                      value={draft.floor}
                      onChange={(event) => setDraft((current) => ({ ...current, floor: event.target.value }))}
                    />
                  </label>
                  <label className="settings-field">
                    <span>Capacité</span>
                    <input
                      type="number"
                      value={draft.capacity}
                      onChange={(event) => setDraft((current) => ({ ...current, capacity: event.target.value }))}
                    />
                  </label>
                </div>
                <div className="chef-form-grid">
                  <label className="settings-field">
                    <span>Occupés</span>
                    <input
                      type="number"
                      value={draft.occupied}
                      onChange={(event) => setDraft((current) => ({ ...current, occupied: event.target.value }))}
                    />
                  </label>
                  <label className="settings-field">
                    <span>Statut</span>
                    <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>
                      <option value="Disponible">Disponible</option>
                      <option value="Complet">Complet</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </label>
                </div>
                <label className="settings-field">
                  <span>Patient occupant</span>
                  <input value={draft.patientName} onChange={(event) => setDraft((current) => ({ ...current, patientName: event.target.value }))} />
                </label>
              </>
            )}

            <div className="dashboard-row-actions">
              {editingId && (
                <button
                  type="button"
                  className="dashboard-button dashboard-button--ghost"
                  onClick={() => {
                    setEditingId(null);
                    setDraft(createDraft(activeTab, state));
                  }}
                >
                  Réinitialiser
                </button>
              )}
              {activeTab !== 'patients' && (
                <button type="submit" className="dashboard-button dashboard-button--primary">
                  <Save size={16} />
                  Enregistrer
                </button>
              )}
            </div>
          </form>

          <div className="dashboard-list" style={{ marginTop: 16 }}>
            <div className="dashboard-list-item">
              <div>
                <div className="dashboard-list-title">Taux d'occupation</div>
                <div className="dashboard-list-meta">
                  {roomsOccupied} / {roomsCapacity} lits occupés
                </div>
              </div>
              <span className="dashboard-chip dashboard-chip--success">{stats.occupancyRate}%</span>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Service</span>
          <h1 className="dashboard-title">{state.service.name || getServiceLabel(serviceId)}</h1>
          <p className="dashboard-subtitle">
            Gestion du service, du personnel et de la répartition des patients.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard icon={Users} label="Médecins" value={stats.doctors} hint="Équipe médicale active" tone="teal" />
        <MetricCard icon={Users} label="Infirmiers" value={state.staff.nurses.length} hint="Personnel soignant" tone="teal" />
        <MetricCard icon={BedDouble} label="Chambres" value={state.staff.rooms.length} hint="Structure du service" tone="violet" />
        <MetricCard icon={Hospital} label="Occupation" value={`${stats.occupancyRate}%`} hint="Lits occupés / capacité totale" tone="orange" />
      </section>

      <section className="dashboard-tabs" role="tablist" aria-label="Gestion du service">
        {TAB_CONFIG.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`dashboard-tab ${active ? 'active' : ''}`}
              onClick={() => handleChangeTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </section>

      {renderTabContent()}
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, hint, tone }) => (
  <article className="dashboard-stat-card">
    <div className="dashboard-stat-top">
      <div>
        <span className="dashboard-stat-label">{label}</span>
        <div className="dashboard-stat-value">{value}</div>
      </div>
      <div className={`dashboard-stat-icon dashboard-icon--${tone}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="dashboard-stat-hint">{hint}</p>
  </article>
);

export default ChefServices;
