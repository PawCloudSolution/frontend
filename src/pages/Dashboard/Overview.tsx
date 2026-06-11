import { DashboardLayout } from '../../components/DashboardLayout';
import { authState } from '../../store/authStore';

export function DashboardOverview() {
  const user = authState.user.value;
  return (
    <DashboardLayout title="Dashboard Overview">
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2>Welcome back, {user?.email}!</h2>
        <p style={{ marginTop: '1rem', color: '#cbd5e1' }}>
          This is your Paw Cloud control panel. Select an option from the sidebar to manage your organization or applications.
        </p>
      </div>
    </DashboardLayout>
  );
}
