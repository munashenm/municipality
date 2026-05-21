import { MapPin, Calendar } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useApp } from '../../context/AppContext';
import { getNotices } from '../../services/notices';

const CATEGORY_COLORS = {
  Event: 'badge-green',
  'Road Closure': 'badge-red',
  'Community Meeting': 'badge-blue',
  'Public Participation': 'badge-yellow',
  General: 'badge-blue',
};

export default function Notices() {
  useApp();
  const notices = getNotices();

  return (
    <div className="container app-main animate-fade-in">
      <PageHeader title="Community Notices" subtitle="Events, road closures, community meetings, and public participation" backTo="/" />

      <div className="grid grid-cols-1 gap-6">
        {notices.map((n) => (
          <article key={n.id} className="card notice-card">
            <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
              <span className={`badge ${CATEGORY_COLORS[n.category] || 'badge-blue'}`}>{n.category}</span>
              <small style={{ color: 'var(--text-muted)' }}>Published {new Date(n.publishedAt).toLocaleDateString('en-ZA')}</small>
            </div>
            <h3>{n.title}</h3>
            <p>{n.content}</p>
            <div className="flex gap-4 flex-wrap" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {n.location && (
                <span className="flex items-center gap-1"><MapPin size={16} /> {n.location}</span>
              )}
              {n.date && (
                <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(n.date).toLocaleDateString('en-ZA')}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
