const AUTH_STORAGE_KEY = 'medical-app-auth-session';

const safeBtoa = (value) => {
  if (typeof window === 'undefined') {
    return value;
  }

  return window.btoa(unescape(encodeURIComponent(value)));
};

const createMockJwt = (payload) => {
  const header = { alg: 'none', typ: 'JWT' };
  const encodeSegment = (segment) => safeBtoa(JSON.stringify(segment));

  return `${encodeSegment(header)}.${encodeSegment(payload)}.mock-signature`;
};

export const createAuthSession = ({
  username,
  role,
  roleLabel,
  serviceId,
  serviceLabel,
  doctorId,
  nurseId,
}) => {
  const issuedAt = new Date().toISOString();
  const tokenPayload = {
    sub: username,
    role,
    doctorId,
    nurseId,
    serviceId,
    roleLabel,
    serviceLabel,
    iat: issuedAt,
  };

  return {
    token: createMockJwt(tokenPayload),
    user: {
      username,
      role,
      roleLabel,
      doctorId,
      nurseId,
      serviceId,
      serviceLabel,
      issuedAt,
    },
  };
};

export const loadAuthSession = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    if (!parsed?.token || !parsed?.user?.role) {
      return null;
    }

    if (parsed.user.role === 'medecin' && (!parsed.user.doctorId || !parsed.user.serviceId)) {
      return null;
    }

    if (parsed.user.role === 'infirmier' && (!parsed.user.nurseId || !parsed.user.serviceId)) {
      return null;
    }

    if (parsed.user.role === 'chef_medecin' && !parsed.user.serviceId) {
      return null;
    }

    return parsed;
  } catch (error) {
    return null;
  }
};

export const saveAuthSession = (session) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearAuthSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export { AUTH_STORAGE_KEY };
