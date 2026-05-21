import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import { useApp } from '../../context/AppContext';
import { getApplicationByRef } from '../../services/jobs';

export default function JobTrack() {
  useApp();
  const [searchParams] = useSearchParams();
  const [ref, setRef] = useState(searchParams.get('ref') || '');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const r = searchParams.get('ref');
    if (r) {
      setRef(r);
      setResult(getApplicationByRef(r));
      setSearched(true);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setResult(getApplicationByRef(ref.trim()));
    setSearched(true);
  };

  return (
    <div className="container app-main animate-fade-in">
      <PageHeader title="Track Application" subtitle="Enter your tracking reference to view application status" backTo="/jobs" />

      <form className="card search-card mb-8" onSubmit={handleSearch}>
        <div className="flex gap-4">
          <input className="form-control" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. APP-XXXX" />
          <button type="submit" className="btn btn-primary"><Search size={18} /> Track</button>
        </div>
      </form>

      {searched && !result && (
        <div className="card text-center empty-state">
          <p>No application found for <strong>{ref}</strong>.</p>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3>{result.job.title}</h3>
            <p><strong>Reference:</strong> {result.application.id}</p>
            <p><strong>Applicant:</strong> {result.application.companyName}</p>
            <p><strong>Submitted:</strong> {new Date(result.application.submittedAt).toLocaleString('en-ZA')}</p>
            <StatusBadge status={result.application.status} />
          </div>
          <div className="card">
            <h3 className="mb-4 flex items-center gap-2"><Clock size={20} /> Status Timeline</h3>
            <ul className="timeline">
              {result.application.updates.map((u, i) => (
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
