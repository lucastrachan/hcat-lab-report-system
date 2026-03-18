import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Placeholder AuthProvider — will be wired to Cognito in Phase 5.
 * For now, provides a simple mock auth state for development.
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Check Cognito session on mount
    setLoading(false);
  }, []);

  const signIn = async (/* username, password */) => {
    // TODO: Cognito signIn
    setUser({ username: 'admin', email: 'admin@hcat.com' });
  };

  const signOut = async () => {
    // TODO: Cognito signOut
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
