import { useState } from 'react';
import { Search, MapPin, Phone, Globe, Clock, Store } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useApp } from '../../context/AppContext';
import { searchBusinesses, BUSINESS_CATEGORIES } from '../../services/businessDirectory';

export default function BusinessDirectory() {
  useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const businesses = searchBusinesses(query, category);

  return (
    <div className="container app-main animate-fade-in">
      <PageHeader
        title="Local Business Directory"
        subtitle="Discover trusted businesses in SmartCity — support local enterprise"
        backTo="/"
      />

      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group md:col-span-2" style={{ margin: 0 }}>
            <label className="form-label">Search</label>
            <div className="flex gap-2">
              <input
                className="form-control"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Business name, category, area..."
              />
              <button type="button" className="btn btn-primary" aria-label="Search">
                <Search size={18} />
              </button>
            </div>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              {BUSINESS_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
        {businesses.length} business{businesses.length !== 1 ? 'es' : ''} found
      </p>

      {businesses.length === 0 ? (
        <div className="card text-center empty-state">
          <Store size={48} color="var(--text-muted)" className="mb-4" />
          <p>No businesses match your search. Try a different category or keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businesses.map((b) => (
            <article key={b.id} className="card business-card">
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="badge badge-blue">{b.category}</span>
                {b.verified && <span className="badge badge-green">Verified</span>}
              </div>
              <h3 style={{ margin: '0.25rem 0 0.5rem' }}>{b.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{b.description}</p>
              <ul className="business-meta">
                <li><MapPin size={16} /> {b.address}{b.ward ? ` · ${b.ward}` : ''}</li>
                <li><Phone size={16} /> <a href={`tel:${b.phone.replace(/\s/g, '')}`}>{b.phone}</a></li>
                {b.hours && <li><Clock size={16} /> {b.hours}</li>}
                {b.website && (
                  <li>
                    <Globe size={16} />{' '}
                    <a href={b.website.startsWith('http') ? b.website : `https://${b.website}`} target="_blank" rel="noreferrer">
                      {b.website.replace(/^https?:\/\//, '')}
                    </a>
                  </li>
                )}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
