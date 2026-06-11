import { useLocation } from 'preact-iso';
import { isAuthenticated, userRole, UserRole } from '../store/authStore.js';

interface ProtectedRouteProps {
  component: any;
  path: string;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ component: Component, allowedRoles }: ProtectedRouteProps) {
  const { route } = useLocation();

  if (!isAuthenticated.value) {
    // Redirect to login if not authenticated
    // Use setTimeout to avoid state updates during render phase
    setTimeout(() => route('/auth/login'), 0);
    return null;
  }

  if (allowedRoles && userRole.value && !allowedRoles.includes(userRole.value)) {
    return (
      <div class="unauthorized-page">
        <h1>403 - Forbidden</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return <Component />;
}
