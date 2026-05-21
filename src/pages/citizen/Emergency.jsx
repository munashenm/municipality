import { Phone, Shield, Heart, Flame, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { EMERGENCY_SERVICES, MUNICIPAL_CONTACTS } from '../../services/emergency';

const ICONS = { shield: Shield, heart: Heart, flame: Flame, alert: AlertTriangle };

export default function Emergency() {
  const call = (number) => {
    window.location.href = `tel:${number.replace(/\s/g, '')}`;
  };

  return (
    <div className="container app-main animate-fade-in">
      <PageHeader title="Emergency Services" subtitle="Quick access to SAPS, ambulance, fire department, and disaster management" backTo="/" />

      <div className="emergency-banner card mb-8">
        <AlertTriangle size={32} />
        <div>
          <h3 style={{ margin: 0, color: 'white' }}>In a life-threatening emergency, call 112</h3>
          <p style={{ margin: 0, color: '#fca5a5' }}>Available 24/7 nationwide</p>
        </div>
        <button type="button" className="btn btn-danger" onClick={() => call('112')}>
          <Phone size={18} /> Call 112
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {EMERGENCY_SERVICES.map((svc) => {
          const Icon = ICONS[svc.icon] || AlertTriangle;
          return (
            <div key={svc.id} className="card emergency-card" style={{ borderLeft: `4px solid ${svc.color}` }}>
              <div className="flex items-center gap-3 mb-3">
                <Icon size={28} color={svc.color} />
                <h3 style={{ margin: 0 }}>{svc.name}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{svc.description}</p>
              <div className="flex gap-2 mt-4 flex-wrap">
                <button type="button" className="btn btn-danger" onClick={() => call(svc.number)}>
                  <Phone size={16} /> {svc.number}
                </button>
                {svc.altNumber && (
                  <button type="button" className="btn btn-secondary" onClick={() => call(svc.altNumber)}>
                    Alt: {svc.altNumber}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3 className="mb-4">Municipal Service Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MUNICIPAL_CONTACTS.map((c) => (
            <div key={c.name} className="contact-row flex justify-between items-center">
              <span>{c.name}</span>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }} onClick={() => call(c.number)}>
                <Phone size={14} /> {c.number}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
