import { useState } from 'preact/hooks';
import { useInternationalControllerGetPendingApplications, useInternationalControllerApproveOrg } from '../../api/generated/internationals/internationals';
import { DashboardLayout } from '../../components/DashboardLayout';
import styles from './SuperAdminDashboard.module.scss';

export function SuperAdminDashboard() {
  const { data: applications, refetch, isLoading } = useInternationalControllerGetPendingApplications();
  const approveMutation = useInternationalControllerApproveOrg();

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setProcessingId(id);
    approveMutation.mutate({ data: { applicationId: id } }, {
      onSuccess: () => {
        refetch();
        setProcessingId(null);
      },
      onError: () => {
        alert('Failed to approve application.');
        setProcessingId(null);
      }
    });
  };

  return (
    <DashboardLayout title="SuperAdmin: Pending Applications">
      <div class={styles.container}>
        <div class={styles.tableWrapper}>
          {isLoading ? (
            <div class={styles.emptyState}>Loading applications...</div>
          ) : !(applications?.data as unknown as any[]) || (applications?.data as unknown as any[]).length === 0 ? (
            <div class={styles.emptyState}>
              <div class={styles.icon}>📋</div>
              <h3>No pending applications</h3>
              <p>All clear! There are no new international organizations awaiting approval.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Country & Tax</th>
                  <th>President</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(applications?.data as unknown as any[]).map((app: any) => (
                  <tr key={app.id}>
                    <td>
                      <strong>{app.organizationName}</strong>
                      <span class={styles.subText}>Reg: {app.registrationNumber}</span>
                    </td>
                    <td>
                      {app.countryCode}
                      <span class={styles.subText}>Tax: {app.taxNumber}</span>
                    </td>
                    <td>
                      {app.presidentName} {app.presidentSurname}
                      <span class={styles.subText}>{app.presidentEmail}</span>
                    </td>
                    <td>
                      <div class={styles.actions}>
                        <button 
                          class={styles.approveBtn} 
                          onClick={() => handleApprove(app.id)}
                          disabled={processingId === app.id}
                        >
                          {processingId === app.id ? 'Approving...' : 'Approve'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
