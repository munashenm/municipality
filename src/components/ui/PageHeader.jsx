import { Link } from 'react-router-dom';

export default function PageHeader({ title, subtitle, backTo, action }) {
  return (
    <div className="page-header flex justify-between items-center mb-8">
      <div>
        {backTo && (
          <Link to={backTo} className="back-link">&larr; Back</Link>
        )}
        <h2 style={{ marginBottom: subtitle ? '0.25rem' : 0 }}>{title}</h2>
        {subtitle && <p style={{ color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
