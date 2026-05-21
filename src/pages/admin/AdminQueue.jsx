import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Toast, { useToast } from '../../components/ui/Toast';
import { useApp, useRefresh } from '../../context/AppContext';
import { getBookings, cancelBooking } from '../../services/queue';

export default function AdminQueue() {
  useApp();
  const refresh = useRefresh();
  const { toast, show, clear } = useToast();
  const bookings = getBookings();

  const handleCancel = (id) => {
    cancelBooking(id);
    refresh();
    show('Booking cancelled');
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader title="Queue Bookings" subtitle="View and manage citizen appointments" backTo="/admin" />

      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Reference</th><th>Department</th><th>Citizen</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings yet.</td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.reference}</td>
                  <td>{b.departmentName}</td>
                  <td>{b.citizenName}<br /><small>{b.citizenPhone}</small></td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    {b.status === 'Confirmed' && (
                      <button type="button" className="btn btn-danger" style={{ padding: '0.25rem 0.75rem' }} onClick={() => handleCancel(b.id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
