export const ROLE_LABELS = [
  'Administrateur',
  'M\u00e9decin Chef',
  'M\u00e9decin',
  'Infirmier',
  'R\u00e9ceptionniste',
];

export const ROLE_OPTIONS = [
  { label: 'Administrateur', value: 'administrateur' },
  { label: 'M\u00e9decin Chef', value: 'chef_medecin' },
  { label: 'M\u00e9decin', value: 'medecin' },
  { label: 'Infirmier', value: 'infirmier' },
  { label: 'R\u00e9ceptionniste', value: 'receptionniste' },
];

const ROLE_ALIASES = {
  administrateur: 'administrateur',
  Administrateur: 'administrateur',
  'M\u00e9decin Chef': 'chef_medecin',
  chef_medecin: 'chef_medecin',
  'M\u00e9decin': 'medecin',
  medecin: 'medecin',
  Infirmier: 'infirmier',
  infirmier: 'infirmier',
  'R\u00e9ceptionniste': 'receptionniste',
  receptionniste: 'receptionniste',
};

const CHEF_MEDECIN_PERMISSIONS = [
  'dashboard',
  'planning',
  'calendar',
  'patients',
  'services',
  'analytics',
];

export const PERMISSIONS_BY_ROLE = {
  Administrateur: [
    'dashboard',
    'users',
    'services',
    'patients',
    'calendar',
    'hospitalization',
    'settings',
  ],
  administrateur: [
    'dashboard',
    'users',
    'services',
    'patients',
    'calendar',
    'hospitalization',
    'settings',
  ],
  'M\u00e9decin Chef': CHEF_MEDECIN_PERMISSIONS,
  chef_medecin: CHEF_MEDECIN_PERMISSIONS,
  'M\u00e9decin': ['dashboard', 'patients', 'appointments', 'calendar'],
  medecin: ['dashboard', 'patients', 'appointments', 'calendar'],
  Infirmier: ['dashboard', 'patients', 'calendar'],
  infirmier: ['dashboard', 'patients', 'calendar'],
  'R\u00e9ceptionniste': ['dashboard', 'calendar'],
  receptionniste: ['dashboard', 'calendar'],
};

export const normalizeRole = (roleLabelOrValue) => ROLE_ALIASES[roleLabelOrValue] || roleLabelOrValue || '';

export const canAccess = (roleLabel, pageKey) => {
  const permissions = PERMISSIONS_BY_ROLE[normalizeRole(roleLabel)];
  if (!permissions) return false;
  return permissions.includes(pageKey);
};

export const getDefaultPage = (roleLabel) => {
  const permissions = PERMISSIONS_BY_ROLE[normalizeRole(roleLabel)];
  return permissions?.[0] || 'dashboard';
};
