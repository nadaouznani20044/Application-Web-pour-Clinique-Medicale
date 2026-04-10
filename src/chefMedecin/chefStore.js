const CHEF_STATE_PREFIX = 'medical-app-chef-medecin';
const CHEF_SCHEMA_VERSION = 2;

const SERVICE_CATALOG = [
  {
    id: 'gynecologie',
    label: 'Gynécologie',
    specialty: 'Gynécologie et obstétrique',
    chief: '',
    location: 'Bloc B - Niveau 2',
    phone: '+33 1 40 00 21 10',
    description: "Service de suivi, consultation et prise en charge gynécologique.",
    occupancyTarget: 85,
    doctors: 5,
    nurses: 8,
    rooms: 12,
    patients: 120,
    weeklyAppointments: 45,
  },
  {
    id: 'pediatrie',
    label: 'Pédiatrie',
    specialty: 'Médecine de l\'enfant',
    chief: '',
    location: 'Bloc A - Niveau 1',
    phone: '+33 1 40 00 21 20',
    description: "Service pédiatrique pour consultations, urgences et suivi vaccinal.",
    occupancyTarget: 78,
    doctors: 4,
    nurses: 7,
    rooms: 10,
    patients: 96,
    weeklyAppointments: 38,
  },
  {
    id: 'chirurgie',
    label: 'Chirurgie',
    specialty: 'Chirurgie générale',
    chief: '',
    location: 'Bloc opératoire - Niveau 3',
    phone: '+33 1 40 00 21 30',
    description: "Bloc, consultations pré-opératoires et suivi post-opératoire.",
    occupancyTarget: 72,
    doctors: 6,
    nurses: 9,
    rooms: 14,
    patients: 84,
    weeklyAppointments: 41,
  },
  {
    id: 'radiologie',
    label: 'Radiologie',
    specialty: 'Imagerie médicale',
    chief: '',
    location: 'Pôle Imagerie - Rez-de-chaussée',
    phone: '+33 1 40 00 21 40',
    description: "Service d\'imagerie, interprétation et suivi radiologique.",
    occupancyTarget: 69,
    doctors: 4,
    nurses: 6,
    rooms: 8,
    patients: 58,
    weeklyAppointments: 30,
  },
  {
    id: 'laboratoire',
    label: 'Laboratoire',
    specialty: 'Analyses biomédicales',
    chief: '',
    location: 'Pôle Biologie - Niveau 1',
    phone: '+33 1 40 00 21 50',
    description: "Prélèvements, analyses et rendu des résultats biologiques.",
    occupancyTarget: 64,
    doctors: 3,
    nurses: 6,
    rooms: 7,
    patients: 52,
    weeklyAppointments: 28,
  },
  {
    id: 'urgence',
    label: 'Urgence',
    specialty: 'Médecine d\'urgence',
    chief: '',
    location: 'Entrée principale - Niveau 0',
    phone: '+33 1 40 00 21 60',
    description: "Prise en charge des urgences, triage et suivi court terme.",
    occupancyTarget: 91,
    doctors: 7,
    nurses: 12,
    rooms: 16,
    patients: 140,
    weeklyAppointments: 52,
  },
  {
    id: 'medecineinterne',
    label: 'Médecine interne',
    specialty: 'Médecine interne',
    chief: '',
    location: 'Bloc C - Niveau 2',
    phone: '+33 1 40 00 21 70',
    description: "Consultations spécialisées, bilans et suivi chronique.",
    occupancyTarget: 74,
    doctors: 5,
    nurses: 7,
    rooms: 11,
    patients: 88,
    weeklyAppointments: 36,
  },
  {
    id: 'ophtalmologie',
    label: 'Ophtalmologie',
    specialty: 'Soins ophtalmologiques',
    chief: '',
    location: 'Bloc D - Niveau 2',
    phone: '+33 1 40 00 21 80',
    description: "Consultations visuelles, examens et suivi chirurgical.",
    occupancyTarget: 67,
    doctors: 4,
    nurses: 5,
    rooms: 9,
    patients: 61,
    weeklyAppointments: 27,
  },
];

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const APPOINTMENT_TIMES = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
const REASONS = [];
const ABSENCE_TYPES = [];
const MONTH_LABELS = [];

const NURSE_NAMES = [];

const PATIENT_NAMES = [];

const clone = (value) => JSON.parse(JSON.stringify(value));

const getStorageKey = (serviceId) => `${CHEF_STATE_PREFIX}:${serviceId}`;

export const getServiceCatalog = () => SERVICE_CATALOG.map((service) => ({ ...service }));

export const getServiceOption = (serviceId) =>
  SERVICE_CATALOG.find((service) => service.id === serviceId) || SERVICE_CATALOG[0];

export const getServiceLabel = (serviceId) => getServiceOption(serviceId).label;

const toIsoDate = (date) => date.toISOString().slice(0, 10);

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

const rotate = (items, offset) => items.slice(offset).concat(items.slice(0, offset));

const buildRooms = () => [];

const buildDoctors = () => [];

const buildNurses = () => [];

const buildPlanning = () => [];

const buildAppointments = () => [];

const buildPatients = () => [];

const buildAnalytics = () => ({
  monthly: [],
  doctors: [],
  rooms: [],
  appointmentStatus: { pending: 0, confirmed: 0, refused: 0 },
});

const mergeLoadedServiceState = (initial, parsed) => ({
  ...initial,
  ...parsed,
  schemaVersion: CHEF_SCHEMA_VERSION,
  service: {
    ...initial.service,
    ...(parsed.service || {}),
  },
  staff: {
    ...initial.staff,
    ...(parsed.staff || {}),
    doctors: Array.isArray(parsed?.staff?.doctors) ? parsed.staff.doctors : initial.staff.doctors,
    nurses: Array.isArray(parsed?.staff?.nurses) ? parsed.staff.nurses : initial.staff.nurses,
    rooms: Array.isArray(parsed?.staff?.rooms) ? parsed.staff.rooms : initial.staff.rooms,
  },
  planning: Array.isArray(parsed?.planning) ? parsed.planning : initial.planning,
  appointments: Array.isArray(parsed?.appointments) ? parsed.appointments : initial.appointments,
  patients: Array.isArray(parsed?.patients) ? parsed.patients : initial.patients,
  analytics: {
    ...initial.analytics,
    ...(parsed?.analytics || {}),
    monthly: Array.isArray(parsed?.analytics?.monthly) ? parsed.analytics.monthly : initial.analytics.monthly,
    doctors: Array.isArray(parsed?.analytics?.doctors) ? parsed.analytics.doctors : initial.analytics.doctors,
    rooms: Array.isArray(parsed?.analytics?.rooms) ? parsed.analytics.rooms : initial.analytics.rooms,
    appointmentStatus: {
      ...initial.analytics.appointmentStatus,
      ...(parsed?.analytics?.appointmentStatus || {}),
    },
  },
});

export const buildInitialServiceState = (serviceId) => {
  const profile = getServiceOption(serviceId);
  const doctors = buildDoctors();
  const nurses = buildNurses();
  const rooms = buildRooms();
  const planning = buildPlanning();
  const appointments = buildAppointments();
  const patients = buildPatients();
  const analytics = buildAnalytics();

  return {
    schemaVersion: CHEF_SCHEMA_VERSION,
    service: {
      id: profile.id,
      name: '',
      specialty: '',
      chief: '',
      location: '',
      phone: '',
      description: '',
      status: 'Active',
      doctorCount: 0,
      patientCount: 0,
      weeklyAppointmentCount: 0,
      roomCount: 0,
    },
    staff: {
      doctors,
      nurses,
      rooms,
    },
    planning,
    appointments,
    patients,
    analytics,
  };
};

export const loadServiceState = (serviceId) => {
  const profile = getServiceOption(serviceId);
  const initial = buildInitialServiceState(profile.id);
  if (typeof window === 'undefined') {
    return clone(initial);
  }

  const storageKey = getStorageKey(profile.id);

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      window.localStorage.setItem(storageKey, JSON.stringify(initial));
      return clone(initial);
    }

    const parsed = JSON.parse(stored);
    if (parsed?.schemaVersion !== CHEF_SCHEMA_VERSION) {
      window.localStorage.setItem(storageKey, JSON.stringify(initial));
      return clone(initial);
    }

    return mergeLoadedServiceState(initial, parsed);
  } catch (error) {
    return clone(initial);
  }
};

export const saveServiceState = (serviceId, state) => {
  if (typeof window === 'undefined') {
    return;
  }

  const profile = getServiceOption(serviceId);
  window.localStorage.setItem(
    getStorageKey(profile.id),
    JSON.stringify({ ...state, schemaVersion: CHEF_SCHEMA_VERSION })
  );
  window.dispatchEvent(new CustomEvent('chef-service-updated', { detail: { serviceId: profile.id } }));
};

export const clearServiceState = (serviceId) => {
  if (typeof window === 'undefined') {
    return;
  }

  const profile = getServiceOption(serviceId);
  window.localStorage.removeItem(getStorageKey(profile.id));
};

export const getServiceStats = (state) => {
  const doctors = state?.staff?.doctors?.length ?? state?.service?.doctorCount ?? 0;
  const activePatients = state?.patients?.length ?? state?.service?.patientCount ?? 0;
  const weeklyAppointments = state?.appointments?.length ?? state?.service?.weeklyAppointmentCount ?? 0;
  const totalCapacity = state?.staff?.rooms?.reduce((sum, room) => sum + (room.capacity || 0), 0) || 0;
  const occupiedBeds = state?.staff?.rooms?.reduce((sum, room) => sum + (room.occupied || 0), 0) || 0;
  const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

  return {
    doctors,
    activePatients,
    weeklyAppointments,
    occupancyRate,
  };
};

export const getUpcomingAppointments = (state) =>
  [...(state?.appointments || [])].sort((left, right) => {
    const rank = (value) => (value === 'pending' ? 0 : value === 'confirmed' ? 1 : 2);
    const byStatus = rank(left.status) - rank(right.status);
    if (byStatus !== 0) {
      return byStatus;
    }

    return `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`);
  });

export const getActiveWeekRange = (weekStart) => {
  const start = getWeekStart(weekStart);
  const end = addDays(start, 6);

  return {
    start,
    end,
    label: `${toIsoDate(start)} → ${toIsoDate(end)}`,
  };
};

export const getServiceSummary = (serviceId) => {
  const profile = getServiceOption(serviceId);
  return {
    id: profile.id,
    label: profile.label,
    chief: profile.chief,
    location: profile.location,
    phone: profile.phone,
    specialty: profile.specialty,
    description: profile.description,
  };
};

export const cloneServiceState = (state) => clone(state);
