import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import { useApp } from '../../context/AppContext';
import { getReportByTicket } from '../../services/reports';

export default function TrackTicket() {
  useApp();
  const [searchParams] = useSearchParams();
  const [ticket, setTicket] = useState(searchParams.get('ticket') || '');
  const [report, setReport] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const t = searchParams.get('ticket');
    if (t) {
      setTicket(t);
      setReport(getReportByTicket(t));
      setSearched(true);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setReport(getReportByTicket(ticket.trim()));
    setSearched(true);
  };

  return (
    <div className="container app-main animate-fade-in">
      <PageHeader title="Track Your Ticket" subtitle="Enter your ticket number to view status and updates" backTo="/" />

      <form className="card search-card mb-8" onSubmit={handleSearch}>
        <div className="flex gap-4">
          <input
            className="form-control"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            placeholder="e.g. #IS-1042"
          />
          <button type="submit" className="btn btn-primary">
            <Search size={18} /> Track
          </button>
        </div>
      </form>

      {searched && !report && (
        <div className="card text-center empty-state">
          <p>No ticket found for <strong>{ticket}</strong>. Check the number and try again.</p>
        </div>
      )}

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 style={{ margin: 0 }}>{report.ticketNumber}</h3>
                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>{report.type}</p>
              </div>
              <StatusBadge status={report.status} />
            </div>
            <p><strong>Location:</strong> {report.location}</p>
            {report.gps && (
              <p><strong>GPS:</strong> {report.gps.lat.toFixed(5)}, {report.gps.lng.toFixed(5)}</p>
            )}
            <p><strong>Description:</strong> {report.description}</p>
            <p><strong>Reported:</strong> {new Date(report.createdAt).toLocaleString('en-ZA')}</p>
            {report.photos?.length > 0 && (
              <div className="photo-preview-grid mt-4">
                {report.photos.map((p, i) => (
                  <img key={i} src={p.data} alt={`Evidence ${i + 1}`} />
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="mb-4 flex items-center gap-2"><Clock size={20} /> Status Timeline</h3>
            <ul className="timeline">
              {report.updates.map((u, i) => (
                <li key={i} className="timeline-item">
                  <div className="timeline-dot" />
                  <div>
                    <StatusBadge status={u.status} />
                    <p style={{ margin: '0.5rem 0 0' }}>{u.message}</p>
                    <small style={{ color: 'var(--text-muted)' }}>{new Date(u.date).toLocaleString('en-ZA')}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
