import { useState } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button type="button" className="toast-close" onClick={onClose} aria-label="Close">&times;</button>
      )}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };
  return { toast, show, clear: () => setToast(null) };
}
