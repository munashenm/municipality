import { useState } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Toast, { useToast } from '../../components/ui/Toast';
import { useApp, useRefresh } from '../../context/AppContext';
import { getDepartments, createBooking, getBooking } from '../../services/queue';

export default function QueueBooking() {
  useApp();
  const refresh = useRefresh();
  const { toast, show, clear } = useToast();
  const departments = getDepartments();
  const [selectedDept, setSelectedDept] = useState(departments[0]?.id || '');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [trackRef, setTrackRef] = useState('');
  const [form, setForm] = useState({ citizenName: '', citizenPhone: '', citizenId: '', purpose: '' });

  const dept = departments.find((d) => d.id === selectedDept);
  const availableSlots = dept?.slots.filter((s) => s.available) || [];

  const handleBook = (e) => {
    e.preventDefault();
    if (!selectedSlot || !form.citizenName || !form.citizenPhone || !form.citizenId) {
      show('Please complete all fields and select a slot', 'error');
      return;
    }
    const result = createBooking({ departmentId: selectedDept, slotId: selectedSlot, ...form });
    refresh();
    if (result.success) {
      setConfirmed(result.booking);
      show(`Booking confirmed! Reference: ${result.booking.reference}`);
    } else {
      show(result.error, 'error');
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    const booking = getBooking(trackRef.trim());
    if (booking) setConfirmed(booking);
    else show('Booking not found', 'error');
  };

  if (confirmed) {
    return (
      <div className="container app-main animate-fade-in">
        <div className="card text-center confirmation-card">
          <CheckCircle size={64} color="var(--secondary)" className="mb-4" />
          <h2>Booking Confirmed</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{confirmed.reference}</p>
          <p><strong>{confirmed.departmentName}</strong></p>
          <p>{confirmed.date} at {confirmed.time}</p>
          <p style={{ color: 'var(--text-muted)' }}>Arrive 10 minutes early with your ID.</p>
          <button type="button" className="btn btn-primary mt-4" onClick={() => setConfirmed(null)}>Book Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader title="Smart Queue Booking" subtitle="Book appointments for IDs, licensing, billing, housing & building plans" backTo="/" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <form className="card" onSubmit={handleBook}>
          <div className="form-group">
            <label className="form-label">Department *</label>
            <select className="form-control" value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); setSelectedSlot(''); }}>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Available Slot *</label>
            <div className="slot-grid">
              {availableSlots.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No slots available. Try another department.</p>
              ) : (
                availableSlots.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`slot-btn ${selectedSlot === s.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(s.id)}
                  >
                    <Calendar size={14} /> {s.date}<br />
                    <Clock size={14} /> {s.time}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-control" value={form.citizenName} onChange={(e) => setForm({ ...form, citizenName: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">ID Number *</label>
            <input className="form-control" value={form.citizenId} onChange={(e) => setForm({ ...form, citizenId: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input className="form-control" type="tel" value={form.citizenPhone} onChange={(e) => setForm({ ...form, citizenPhone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Purpose of Visit</label>
            <input className="form-control" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. New ID application" />
          </div>

          <button type="submit" className="btn btn-primary w-full">Confirm Booking</button>
        </form>

        <div>
          <div className="card mb-8">
            <h3 className="mb-4">Departments</h3>
            <ul className="dept-list">
              {departments.map((d) => (
                <li key={d.id}>
                  <strong>{d.name}</strong>
                  <span>{d.slots.filter((s) => s.available).length} slots available</span>
                </li>
              ))}
            </ul>
          </div>

          <form className="card" onSubmit={handleTrack}>
            <h3 className="mb-4">Track Booking</h3>
            <div className="flex gap-2">
              <input className="form-control" value={trackRef} onChange={(e) => setTrackRef(e.target.value)} placeholder="Q-XXXX" />
              <button type="submit" className="btn btn-secondary">Track</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
