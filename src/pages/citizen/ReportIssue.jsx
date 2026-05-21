import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, Loader2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Toast, { useToast } from '../../components/ui/Toast';
import { useRefresh } from '../../context/AppContext';
import { createReport, ISSUE_TYPES } from '../../services/reports';

export default function ReportIssue() {
  const navigate = useNavigate();
  const refresh = useRefresh();
  const { toast, show, clear } = useToast();
  const [loading, setLoading] = useState(false);
  const [gps, setGps] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({
    type: ISSUE_TYPES[0],
    description: '',
    location: '',
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
  });

  const handleGps = () => {
    if (!navigator.geolocation) {
      show('GPS not supported on this device', 'error');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
        show('Location captured');
      },
      () => {
        setGpsLoading(false);
        show('Could not get location. Enter address manually.', 'error');
      },
      { enableHighAccuracy: true }
    );
  };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((prev) => [...prev, { name: file.name, data: reader.result }].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.location || !form.reporterName || !form.reporterPhone) {
      show('Please fill in all required fields', 'error');
      return;
    }
    setLoading(true);
    const report = createReport({ ...form, gps, photos });
    refresh();
    setLoading(false);
    show(`Report submitted! Ticket: ${report.ticketNumber}`);
    setTimeout(() => navigate(`/track?ticket=${encodeURIComponent(report.ticketNumber)}`), 1500);
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader title="Report a Service Issue" subtitle="Water leaks, potholes, outages, illegal dumping, sewer issues & broken street lights" backTo="/" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form className="card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Type *</label>
            <select className="form-control" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {ISSUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-control" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail..." />
          </div>

          <div className="form-group">
            <label className="form-label">Location / Address *</label>
            <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Street, ward, or landmark" />
          </div>

          <div className="form-group">
            <label className="form-label">GPS Location</label>
            <button type="button" className="btn btn-secondary w-full" onClick={handleGps} disabled={gpsLoading}>
              {gpsLoading ? <Loader2 size={18} className="spin" /> : <MapPin size={18} />}
              {gps ? `Captured: ${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}` : 'Use My Location'}
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Photos (max 3)</label>
            <label className="file-upload-btn">
              <Camera size={18} /> Choose Photos
              <input type="file" accept="image/*" multiple hidden onChange={handlePhotos} />
            </label>
            {photos.length > 0 && (
              <div className="photo-preview-grid">
                {photos.map((p, i) => (
                  <img key={i} src={p.data} alt={p.name} />
                ))}
              </div>
            )}
          </div>

          <hr className="form-divider" />

          <div className="form-group">
            <label className="form-label">Your Name *</label>
            <input className="form-control" value={form.reporterName} onChange={(e) => setForm({ ...form, reporterName: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input className="form-control" type="tel" value={form.reporterPhone} onChange={(e) => setForm({ ...form, reporterPhone: e.target.value })} placeholder="082 123 4567" />
          </div>
          <div className="form-group">
            <label className="form-label">Email (optional)</label>
            <input className="form-control" type="email" value={form.reporterEmail} onChange={(e) => setForm({ ...form, reporterEmail: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>

        <div className="card info-panel">
          <h3>What happens next?</h3>
          <ol className="steps-list">
            <li>You receive a unique ticket number</li>
            <li>Your report is routed to the correct department</li>
            <li>Track status updates in real time</li>
            <li>Get notified when the issue is resolved</li>
          </ol>
          <h4 className="mt-4">Issue types we handle</h4>
          <ul className="issue-types-list">
            {ISSUE_TYPES.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
