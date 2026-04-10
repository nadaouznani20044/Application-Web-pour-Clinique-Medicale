const INFIRMIER_STATE_PREFIX = 'medical-app-infirmier';
const INFIRMIER_SCHEMA_VERSION = 1;

const clone = (value) => JSON.parse(JSON.stringify(value));

const toIsoDate = (value) => new Date(value).toISOString().slice(0, 10);

export const getWeekStart = (value = new Date()) => {
  const date = new Date(value);
  const day = date.getDay() || 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (day - 1));
  return date;
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
};

const getStorageKey = (nurseId, serviceId) =>
  `${INFIRMIER_STATE_PREFIX}:${serviceId || 'service'}:${nurseId || 'anonymous'}`;

export const buildInitialInfirmierState = ({ nurseId = '', serviceId = '', serviceLabel = '' } = {}) => ({
  schemaVersion: INFIRMIER_SCHEMA_VERSION,
  nurse: {
    id: nurseId || '',
    serviceId: serviceId || '',
    serviceLabel: serviceLabel || '',
  },
  patients: [],
  planning: [],
  careNotes: [],
  vitalsLog: [],
  alerts: [],
  medicationAdministrations: [],
  careTasks: [],
});

const mergeState = (initial, parsed) => ({
  ...initial,
  ...parsed,
  schemaVersion: INFIRMIER_SCHEMA_VERSION,
  nurse: {
    ...initial.nurse,
    ...(parsed.nurse || {}),
  },
  patients: Array.isArray(parsed?.patients) ? parsed.patients : initial.patients,
  planning: Array.isArray(parsed?.planning) ? parsed.planning : initial.planning,
  careNotes: Array.isArray(parsed?.careNotes) ? parsed.careNotes : initial.careNotes,
  vitalsLog: Array.isArray(parsed?.vitalsLog) ? parsed.vitalsLog : initial.vitalsLog,
  alerts: Array.isArray(parsed?.alerts) ? parsed.alerts : initial.alerts,
  medicationAdministrations: Array.isArray(parsed?.medicationAdministrations)
    ? parsed.medicationAdministrations
    : initial.medicationAdministrations,
  careTasks: Array.isArray(parsed?.careTasks) ? parsed.careTasks : initial.careTasks,
});

export const loadInfirmierState = (nurseId, serviceId, serviceLabel = '') => {
  const initial = buildInitialInfirmierState({ nurseId, serviceId, serviceLabel });

  if (typeof window === 'undefined') {
    return clone(initial);
  }

  const storageKey = getStorageKey(nurseId, serviceId);

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      window.localStorage.setItem(storageKey, JSON.stringify(initial));
      return clone(initial);
    }

    const parsed = JSON.parse(stored);
    if (parsed?.schemaVersion !== INFIRMIER_SCHEMA_VERSION) {
      window.localStorage.setItem(storageKey, JSON.stringify(initial));
      return clone(initial);
    }

    return mergeState(initial, parsed);
  } catch (error) {
    return clone(initial);
  }
};

export const saveInfirmierState = (nurseId, serviceId, state) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    getStorageKey(nurseId, serviceId),
    JSON.stringify({ ...state, schemaVersion: INFIRMIER_SCHEMA_VERSION })
  );
  window.dispatchEvent(
    new CustomEvent('infirmier-state-updated', {
      detail: { nurseId, serviceId },
    })
  );
};

export const getAssignedPatients = (state, nurseId, serviceId) =>
  (state?.patients || []).filter((patient) => {
    const nurseMatch = !nurseId || patient.assignedNurseId === nurseId;
    const serviceMatch = !serviceId || !patient.serviceId || patient.serviceId === serviceId;
    return nurseMatch && serviceMatch;
  });

export const getTodayPlanning = (state, referenceDate = new Date()) => {
  const today = toIsoDate(referenceDate);
  return [...(state?.planning || [])]
    .filter((entry) => entry.date === today)
    .sort((left, right) => `${left.time || ''}`.localeCompare(`${right.time || ''}`));
};

export const getWeekPlanning = (state, weekStart = getWeekStart()) => {
  const start = getWeekStart(weekStart);
  const end = addDays(start, 6);

  return [...(state?.planning || [])]
    .filter((entry) => {
      const date = new Date(`${entry.date}T00:00:00`);
      return date >= start && date <= end;
    })
    .sort((left, right) => `${left.date} ${left.time || ''}`.localeCompare(`${right.date} ${right.time || ''}`));
};

export const getWeekRangeLabel = (weekStart = getWeekStart()) => {
  const start = getWeekStart(weekStart);
  const end = addDays(start, 6);
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
  });

  return `${formatter.format(start)} - ${formatter.format(end)}`;
};

export const getPendingMedicationTasks = (state, nurseId, serviceId) => {
  const patients = getAssignedPatients(state, nurseId, serviceId);
  const tasks = [];

  patients.forEach((patient) => {
    (patient.prescriptions || []).forEach((prescription) => {
      if (prescription.administeredAt) {
        return;
      }

      tasks.push({
        id: `${patient.id}-${prescription.id || prescription.medication || 'prescription'}`,
        patientId: patient.id,
        patientName: patient.fullName || patient.name || patient.id,
        room: patient.room || patient.chambre || '--',
        medication: prescription.medication || prescription.name || '--',
        dosage: prescription.dosage || '',
        duration: prescription.duration || '',
        notes: prescription.notes || '',
      });
    });
  });

  return tasks;
};

export const getDashboardStats = (state, nurseId, serviceId, referenceDate = new Date()) => {
  const assignedPatients = getAssignedPatients(state, nurseId, serviceId);
  const todayPlanning = getTodayPlanning(state, referenceDate);
  const pendingMedicationTasks = getPendingMedicationTasks(state, nurseId, serviceId);
  const pendingCareTasks = (state?.careTasks || []).filter((task) => task.status === 'pending');

  return {
    assignedPatients: assignedPatients.length,
    todayConsultations: todayPlanning.length,
    pendingCare: pendingMedicationTasks.length + pendingCareTasks.length,
    serviceLabel: state?.nurse?.serviceLabel || '',
  };
};

export const createVitalsEntry = ({
  patientId,
  nurseId,
  weight,
  height,
  bloodPressure,
  pulse,
  temperature,
  oxygen,
  notes,
}) => ({
  id: `${patientId}-vitals-${Date.now()}`,
  patientId,
  nurseId,
  weight: weight?.trim() || '',
  height: height?.trim() || '',
  bloodPressure: bloodPressure?.trim() || '',
  pulse: pulse?.trim() || '',
  temperature: temperature?.trim() || '',
  oxygen: oxygen?.trim() || '',
  notes: notes?.trim() || '',
  createdAt: new Date().toISOString(),
});

export const createCareNoteEntry = ({ patientId, nurseId, type, note }) => ({
  id: `${patientId}-care-${Date.now()}`,
  patientId,
  nurseId,
  type: type || 'Observation',
  note: note?.trim() || '',
  createdAt: new Date().toISOString(),
});

export const createAlertEntry = ({ patientId, nurseId, type, description }) => ({
  id: `${patientId}-alert-${Date.now()}`,
  patientId,
  nurseId,
  type: type || 'etat_change',
  description: description?.trim() || '',
  createdAt: new Date().toISOString(),
});

export const createMedicationAdministrationEntry = ({
  patientId,
  nurseId,
  prescriptionId,
  notes,
}) => ({
  id: `${patientId}-admin-${Date.now()}`,
  patientId,
  nurseId,
  prescriptionId,
  notes: notes?.trim() || '',
  administeredAt: new Date().toISOString(),
});

export const applyVitalsToState = (state, patientId, vitalsEntry) => {
  const nextPatients = (state?.patients || []).map((patient) => {
    if (patient.id !== patientId) {
      return patient;
    }

    return {
      ...patient,
      vitals: {
        ...(patient.vitals || {}),
        weight: vitalsEntry.weight,
        height: vitalsEntry.height,
        bloodPressure: vitalsEntry.bloodPressure,
        pulse: vitalsEntry.pulse,
        temperature: vitalsEntry.temperature,
        oxygen: vitalsEntry.oxygen,
      },
      vitalsHistory: [vitalsEntry, ...(patient.vitalsHistory || [])],
    };
  });

  return {
    ...state,
    patients: nextPatients,
    vitalsLog: [vitalsEntry, ...(state?.vitalsLog || [])],
  };
};

export const applyCareNoteToState = (state, patientId, careNoteEntry) => {
  const nextPatients = (state?.patients || []).map((patient) =>
    patient.id === patientId
      ? {
          ...patient,
          careNotes: [careNoteEntry, ...(patient.careNotes || [])],
        }
      : patient
  );

  return {
    ...state,
    patients: nextPatients,
    careNotes: [careNoteEntry, ...(state?.careNotes || [])],
  };
};

export const applyAlertToState = (state, patientId, alertEntry) => {
  const nextPatients = (state?.patients || []).map((patient) =>
    patient.id === patientId
      ? {
          ...patient,
          alerts: [alertEntry, ...(patient.alerts || [])],
        }
      : patient
  );

  return {
    ...state,
    patients: nextPatients,
    alerts: [alertEntry, ...(state?.alerts || [])],
  };
};

export const administerMedication = (state, patientId, prescriptionId, administrationEntry) => {
  const nextPatients = (state?.patients || []).map((patient) => {
    if (patient.id !== patientId) {
      return patient;
    }

    return {
      ...patient,
      prescriptions: (patient.prescriptions || []).map((prescription) =>
        (prescription.id || prescription.medication) === prescriptionId
          ? {
              ...prescription,
              administeredAt: administrationEntry.administeredAt,
              administeredBy: administrationEntry.nurseId,
              administrationNotes: administrationEntry.notes,
            }
          : prescription
      ),
    };
  });

  return {
    ...state,
    patients: nextPatients,
    medicationAdministrations: [administrationEntry, ...(state?.medicationAdministrations || [])],
  };
};

export const getPatientById = (state, patientId, nurseId, serviceId) =>
  getAssignedPatients(state, nurseId, serviceId).find((patient) => patient.id === patientId) || null;

export const getWeekPlanningCounts = (state, weekStart = getWeekStart()) => {
  const planning = getWeekPlanning(state, weekStart);
  return {
    total: planning.length,
    consultation: planning.filter((entry) => (entry.type || '').toLowerCase() === 'consultation').length,
    occupation: planning.filter((entry) => (entry.type || '').toLowerCase() === 'occupation').length,
    absence: planning.filter((entry) => (entry.type || '').toLowerCase() === 'absence').length,
  };
};
