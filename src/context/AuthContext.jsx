import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { seedData, seedAuthData, seedPresentationData } from '../services/seed';
import { getCurrentUser, logout as authLogout } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const refreshUser = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    async function init() {
      seedData();
      await seedAuthData();
      seedPresentationData();
      setUser(getCurrentUser());
      setReady(true);
    }
    init();
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, refreshUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
