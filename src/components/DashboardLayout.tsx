import { ComponentChildren } from 'preact';
import { useLocation } from 'preact-iso';
import { authState } from '../store/authStore';
import { useAuthControllerLogout } from '../api/generated/auth/auth';
import styles from './DashboardLayout.module.scss';

interface Props {
  children: ComponentChildren;
  title?: string;
}

export function DashboardLayout({ children, title = 'Dashboard' }: Props) {
  const { route } = useLocation();
  const user = authState.user.value;

  const logoutMutation = useAuthControllerLogout({
    mutation: {
      onSuccess: () => {
        window.location.href = '/auth/login';
      }
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div class={styles.layout}>
      <aside class={styles.sidebar}>
        <div class={styles.logo}>🐾 Paw Cloud</div>

        <nav class={styles.nav}>
          <a href="/dashboard" class={window.location.pathname === '/dashboard' ? styles.active : ''}>
            Overview
          </a>
          {user?.role === 'superAdmin' && (
            <a href="/dashboard/superadmin" class={window.location.pathname.includes('/superadmin') ? styles.active : ''}>
              Applications
            </a>
          )}
          {user?.role !== 'superAdmin' && (
            <a href="/organizations" class={window.location.pathname.includes('/organizations') ? styles.active : ''}>
              My Organization
            </a>
          )}
        </nav>

        <button class={styles.logoutBtn} onClick={handleLogout} disabled={logoutMutation.isPending}>
          {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
        </button>
      </aside>

      <main class={styles.mainContent}>
        <header class={styles.header}>
          <div class={styles.pageTitle}>{title}</div>
          <div class={styles.userInfo}>
            <span>{user?.email}</span>
            {user?.role && <span class={styles.roleBadge}>{user.role.replace(/([A-Z])/g, ' $1').trim()}</span>}
          </div>
        </header>

        <div class={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
