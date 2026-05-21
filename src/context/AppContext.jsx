import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { seedData } from '../services/seed';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    seedData();
  }, []);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <AppContext.Provider value={{ refreshKey, refresh }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useRefresh() {
  return useApp().refresh;
}
