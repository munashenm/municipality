const STATUS_MAP = {
  Open: 'badge-red',
  'In Progress': 'badge-yellow',
  Resolved: 'badge-green',
  Closed: 'badge-blue',
  Submitted: 'badge-blue',
  'Under Review': 'badge-yellow',
  Shortlisted: 'badge-green',
  Rejected: 'badge-red',
  Confirmed: 'badge-green',
  Cancelled: 'badge-red',
  Unpaid: 'badge-red',
  Paid: 'badge-green',
  Pending: 'badge-yellow',
  Approved: 'badge-green',
  Received: 'badge-blue',
  Published: 'badge-green',
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_MAP[status] || 'badge-blue'}`}>{status}</span>;
}
