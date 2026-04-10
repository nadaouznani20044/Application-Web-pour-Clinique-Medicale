import { Navigate, useLocation } from 'react-router-dom';
import { normalizeRole } from '../auth/permissions';

const isBlockedPath = (pathname, blockedPath) =>
  pathname === blockedPath || pathname.startsWith(`${blockedPath}/`);

const PrivateRoute = ({
  isAuthenticated,
  userRole,
  allowedRoles = [],
  allowedPaths = [],
  forbiddenPaths = [],
  forbiddenRedirectTo = '/403',
  unauthorizedRedirectTo = '/unauthorized',
  children,
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(normalizeRole(userRole))) {
    return <Navigate to={unauthorizedRedirectTo} replace />;
  }

  if (
    allowedPaths.length > 0 &&
    !allowedPaths.some((allowedPath) => isBlockedPath(location.pathname, allowedPath))
  ) {
    return <Navigate to={forbiddenRedirectTo} replace />;
  }

  if (forbiddenPaths.some((blockedPath) => isBlockedPath(location.pathname, blockedPath))) {
    return <Navigate to={forbiddenRedirectTo} replace />;
  }

  return children;
};

export default PrivateRoute;
