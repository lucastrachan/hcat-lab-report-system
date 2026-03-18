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
 * Auth provider — currently uses mock auth for development.
 * Will be wired to Cognito when AWS is configured.
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem('hcat_admin_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const signIn = async (username, password) => {
    // TODO: Replace with Cognito signIn
    if (!username || !password) {
      throw new Error('Username and password are required');
    }
    const mockUser = { username, email: `${username}@hcat.com` };
    setUser(mockUser);
    sessionStorage.setItem('hcat_admin_user', JSON.stringify(mockUser));
  };

  const signOut = async () => {
    // TODO: Replace with Cognito signOut
    setUser(null);
    sessionStorage.removeItem('hcat_admin_user');
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
