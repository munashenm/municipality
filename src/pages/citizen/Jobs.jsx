import { Link } from 'react-router-dom';
import { Briefcase, Calendar, FileText } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import { useApp } from '../../context/AppContext';
import { getOpenJobs } from '../../services/jobs';

export default function Jobs() {
  useApp();
  const jobs = getOpenJobs();

  return (
    <div className="container app-main animate-fade-in">
      <PageHeader
        title="Local Jobs & Tenders"
        subtitle="Vacancies, tenders, RFQs, and quotations — apply directly and track your status"
        backTo="/"
        action={<Link to="/jobs/track" className="btn btn-secondary">Track Application</Link>}
      />

      <div className="grid grid-cols-1 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="card job-card">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <span className="badge badge-blue mb-2">{job.type}</span>
                <h3 style={{ margin: '0.25rem 0' }}>{job.title}</h3>
                {job.reference && <p style={{ color: 'var(--text-muted)', margin: 0 }}>Ref: {job.reference}</p>}
              </div>
              <StatusBadge status={job.status} />
            </div>
            <p style={{ margin: '1rem 0' }}>{job.description}</p>
            <div className="flex gap-6 flex-wrap" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span className="flex items-center gap-1"><Briefcase size={16} /> {job.department}</span>
              <span className="flex items-center gap-1"><Calendar size={16} /> Closes: {new Date(job.closingDate).toLocaleDateString('en-ZA')}</span>
              <span className="flex items-center gap-1"><FileText size={16} /> {job.requirements?.slice(0, 60)}...</span>
            </div>
            <Link to={`/jobs/${job.id}`} className="btn btn-primary mt-4">Apply Now</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
