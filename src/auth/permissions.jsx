export const ROLE_LABELS = [
  'Administrateur',
  'M\u00e9decin Chef',
  'M\u00e9decin',
  'Infirmier',
  'R\u00e9ceptionniste',
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
  'M\u00e9decin Chef': ['dashboard', 'services', 'patients', 'calendar'],
  'M\u00e9decin': ['dashboard', 'patients', 'calendar'],
  Infirmier: ['dashboard', 'patients', 'calendar'],
  'R\u00e9ceptionniste': [
    'dashboard',
    'calendar',
    'services',
    'chirurgie',
    'gynecologie',
    'laboratoire',
    'medecineinterne',
    'ophtalmologie',
    'pediatrie',
    'radiologie',
    'urgence',
  ],
};

export const ROLE_OPTIONS = ROLE_LABELS.map((label) => ({
  label,
  value: label,
}));

export const canAccess = (roleLabel, pageKey) => {
  const permissions = PERMISSIONS_BY_ROLE[roleLabel];
  if (!permissions) return false;
  return permissions.includes(pageKey);
};

export const getDefaultPage = (roleLabel) => {
  const permissions = PERMISSIONS_BY_ROLE[roleLabel];
  return permissions?.[0] || 'dashboard';
};
