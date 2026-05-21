import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Toast, { useToast } from '../../components/ui/Toast';
import { useRefresh } from '../../context/AppContext';
import { getJob, submitApplication } from '../../services/jobs';

export default function JobApply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const refresh = useRefresh();
  const { toast, show, clear } = useToast();
  const job = getJob(id);
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState({ companyName: '', contactName: '', email: '', phone: '', coverLetter: '' });

  if (!job) {
    return (
      <div className="container app-main">
        <div className="card text-center">Job not found. <a href="/jobs">Back to listings</a></div>
      </div>
    );
  }

  const handleDocs = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setDocs((prev) => [...prev, { name: file.name, data: reader.result }]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.companyName || !form.contactName || !form.email || !form.phone) {
      show('Please fill in all required fields', 'error');
      return;
    }
    const result = submitApplication(id, { ...form, documents: docs });
    refresh();
    show(`Application submitted! Tracking ref: ${result.trackingRef}`);
    setTimeout(() => navigate(`/jobs/track?ref=${result.trackingRef}`), 1500);
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader title={`Apply: ${job.title}`} subtitle={`${job.type} — ${job.department}`} backTo="/jobs" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form className="card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Company / Applicant Name *</label>
            <input className="form-control" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Person *</label>
            <input className="form-control" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input className="form-control" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Cover Letter / Proposal</label>
            <textarea className="form-control" rows={5} value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Upload Documents</label>
            <label className="file-upload-btn">
              <Upload size={18} /> CV, CSD, Tax Clearance, B-BBEE
              <input type="file" multiple hidden onChange={handleDocs} />
            </label>
            {docs.length > 0 && (
              <ul className="doc-list">{docs.map((d, i) => <li key={i}>{d.name}</li>)}</ul>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-full">Submit Application</button>
        </form>

        <div className="card info-panel">
          <h3>Requirements</h3>
          <p>{job.requirements}</p>
          <p><strong>Closing date:</strong> {new Date(job.closingDate).toLocaleDateString('en-ZA')}</p>
          {job.reference && <p><strong>Reference:</strong> {job.reference}</p>}
        </div>
      </div>
    </div>
  );
}
