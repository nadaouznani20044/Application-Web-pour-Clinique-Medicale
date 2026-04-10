const MED_STATE_PREFIX = 'medical-app-medecin';
const MED_SCHEMA_VERSION = 1;

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

const getStorageKey = (doctorId, serviceId) =>
  `${MED_STATE_PREFIX}:${serviceId || 'service'}:${doctorId || 'anonymous'}`;

export const buildInitialMedecinState = ({ doctorId = '', serviceId = '', serviceLabel = '' } = {}) => ({
  schemaVersion: MED_SCHEMA_VERSION,
  doctor: {
    id: doctorId || '',
    serviceId: serviceId || '',
    serviceLabel: serviceLabel || '',
  },
  patients: [],
  appointments: [],
  planning: [],
  consultations: [],
  referrals: [],
  analytics: {
    monthly: [],
    byDoctor: [],
  },
});

const mergeState = (initial, parsed) => ({
  ...initial,
  ...parsed,
  schemaVersion: MED_SCHEMA_VERSION,
  doctor: {
    ...initial.doctor,
    ...(parsed.doctor || {}),
  },
  patients: Array.isArray(parsed?.patients) ? parsed.patients : initial.patients,
  appointments: Array.isArray(parsed?.appointments) ? parsed.appointments : initial.appointments,
  planning: Array.isArray(parsed?.planning) ? parsed.planning : initial.planning,
  consultations: Array.isArray(parsed?.consultations) ? parsed.consultations : initial.consultations,
  referrals: Array.isArray(parsed?.referrals) ? parsed.referrals : initial.referrals,
  analytics: {
    ...initial.analytics,
    ...(parsed?.analytics || {}),
    monthly: Array.isArray(parsed?.analytics?.monthly) ? parsed.analytics.monthly : initial.analytics.monthly,
    byDoctor: Array.isArray(parsed?.analytics?.byDoctor) ? parsed.analytics.byDoctor : initial.analytics.byDoctor,
  },
});

export const loadMedecinState = (doctorId, serviceId, serviceLabel = '') => {
  const initial = buildInitialMedecinState({ doctorId, serviceId, serviceLabel });

  if (typeof window === 'undefined') {
    return clone(initial);
  }

  const storageKey = getStorageKey(doctorId, serviceId);

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      window.localStorage.setItem(storageKey, JSON.stringify(initial));
      return clone(initial);
    }

    const parsed = JSON.parse(stored);
    if (parsed?.schemaVersion !== MED_SCHEMA_VERSION) {
      window.localStorage.setItem(storageKey, JSON.stringify(initial));
      return clone(initial);
    }

    return mergeState(initial, parsed);
  } catch (error) {
    return clone(initial);
  }
};

export const saveMedecinState = (doctorId, serviceId, state) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    getStorageKey(doctorId, serviceId),
    JSON.stringify({ ...state, schemaVersion: MED_SCHEMA_VERSION })
  );
  window.dispatchEvent(
    new CustomEvent('medecin-state-updated', {
      detail: { doctorId, serviceId },
    })
  );
};

export const getOwnedPatients = (state, doctorId) =>
  (state?.patients || []).filter((patient) => patient.assignedDoctorId === doctorId);

export const getTodayAppointments = (state, referenceDate = new Date()) => {
  const today = toIsoDate(referenceDate);

  return [...(state?.appointments || [])]
    .filter((appointment) => appointment.date === today)
    .sort((left, right) => `${left.time}`.localeCompare(`${right.time}`));
};

export const getPendingAppointments = (state, referenceDate = new Date()) =>
  getTodayAppointments(state, referenceDate).filter((appointment) => appointment.status === 'pending');

export const getMedecinStats = (state, doctorId, referenceDate = new Date()) => {
  const ownedPatients = getOwnedPatients(state, doctorId);
  const todayAppointments = getTodayAppointments(state, referenceDate);
  const pendingAppointments = todayAppointments.filter((appointment) => appointment.status === 'pending');
  const consultations = state?.consultations || [];

  return {
    todayAppointments: todayAppointments.length,
    assignedPatients: ownedPatients.length,
    pendingAppointments: pendingAppointments.length,
    consultations: consultations.length,
  };
};

export const getWeeklyPlanning = (state, weekStart = getWeekStart()) => {
  const start = getWeekStart(weekStart);
  const end = addDays(start, 6);

  return [...(state?.planning || [])]
    .filter((entry) => {
      const date = new Date(`${entry.date}T00:00:00`);
      return date >= start && date <= end;
    })
    .sort((left, right) => {
      const byDate = `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`);
      if (byDate !== 0) return byDate;
      if (left.type === right.type) return 0;
      return left.type === 'absence' ? -1 : 1;
    });
};

export const getWeekRangeLabel = (weekStart = getWeekStart()) => {
  const start = getWeekStart(weekStart);
  const end = addDays(start, 6);
  const format = (date) =>
    new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
    }).format(date);

  return `${format(start)} - ${format(end)}`;
};

export const createConsultationEntry = ({
  patientId,
  doctorId,
  notes,
  diagnosis,
  prescriptions,
  exams,
}) => ({
  id: `${doctorId}-consultation-${Date.now()}`,
  patientId,
  doctorId,
  notes: notes?.trim() || '',
  diagnosis: diagnosis?.trim() || '',
  prescriptions: Array.isArray(prescriptions) ? prescriptions : [],
  exams: Array.isArray(exams) ? exams : [],
  createdAt: new Date().toISOString(),
});

export const applyConsultationToState = (state, patientId, consultation) => {
  const cleanedPrescriptions = (consultation.prescriptions || []).filter((item) => item.medication?.trim());
  const cleanedExams = (consultation.exams || []).filter((item) => item.name?.trim());
  const nextConsultation = {
    ...consultation,
    prescriptions: cleanedPrescriptions,
    exams: cleanedExams,
  };

  const nextPatients = (state?.patients || []).map((patient) => {
    if (patient.id !== patientId) {
      return patient;
    }

    const activeMedications = Array.from(
      new Set([
        ...(patient.activeMedications || []),
        ...cleanedPrescriptions.map((item) => {
          const details = [item.dosage, item.duration].filter(Boolean).join(' - ');
          return details ? `${item.medication} (${details})` : item.medication;
        }),
      ])
    );

    const medicalProblems = consultation.diagnosis
      ? Array.from(new Set([...(patient.medicalProblems || []), consultation.diagnosis]))
      : patient.medicalProblems || [];

    const nextTests = [
      ...(patient.tests || []),
      ...cleanedExams.map((item, index) => ({
        id: `${patient.id}-test-${Date.now()}-${index}`,
        name: item.name,
        note: item.note || '',
        result: '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      })),
    ];

    return {
      ...patient,
      consultations: [nextConsultation, ...(patient.consultations || [])],
      lastConsultationDate: toIsoDate(nextConsultation.createdAt),
      activeMedications,
      medicalProblems,
      tests: nextTests,
    };
  });

  return {
    ...state,
    patients: nextPatients,
    consultations: [nextConsultation, ...(state?.consultations || [])],
  };
};

export const createReferralEntry = ({
  patientId,
  doctorId,
  targetService,
  reason,
  urgency,
}) => ({
  id: `${doctorId}-referral-${Date.now()}`,
  patientId,
  doctorId,
  targetService,
  reason: reason?.trim() || '',
  urgency: urgency || 'normal',
  status: 'pending',
  result: '',
  createdAt: new Date().toISOString(),
});

export const applyReferralToState = (state, patientId, referral) => {
  const nextPatients = (state?.patients || []).map((patient) =>
    patient.id === patientId
      ? {
          ...patient,
          referrals: [referral, ...(patient.referrals || [])],
        }
      : patient
  );

  return {
    ...state,
    patients: nextPatients,
    referrals: [referral, ...(state?.referrals || [])],
  };
};

export const receiveReferralResult = (state, patientId, referralId, result) => {
  const timestamp = new Date().toISOString();

  const nextPatients = (state?.patients || []).map((patient) => {
    if (patient.id !== patientId) {
      return patient;
    }

    const updatedReferrals = (patient.referrals || []).map((referral) =>
      referral.id === referralId
        ? {
            ...referral,
            status: 'received',
            result,
            receivedAt: timestamp,
          }
        : referral
    );

    const updatedReferral = updatedReferrals.find((referral) => referral.id === referralId);
    const nextTests = updatedReferral
      ? [
          ...(patient.tests || []),
          {
            id: `${patient.id}-result-${Date.now()}`,
            name: updatedReferral.targetService,
            note: updatedReferral.reason,
            result,
            status: 'received',
            createdAt: timestamp,
          },
        ]
      : patient.tests || [];

    return {
      ...patient,
      referrals: updatedReferrals,
      tests: nextTests,
    };
  });

  const nextReferrals = (state?.referrals || []).map((referral) =>
    referral.id === referralId
      ? {
          ...referral,
          status: 'received',
          result,
          receivedAt: timestamp,
        }
      : referral
  );

  return {
    ...state,
    patients: nextPatients,
    referrals: nextReferrals,
  };
};
