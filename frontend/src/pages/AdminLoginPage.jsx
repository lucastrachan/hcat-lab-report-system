import { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import { useAuth } from '../auth/AuthProvider';
import '../styles/AdminLoginPage.css';

export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(username, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <div className="login-page">
        <div className="login-card">
          <h1>Admin Login</h1>
          <p className="login-subtitle">Sign in to manage water analysis reports.</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <Input
              label="Username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
            <div className="login-spacer" />
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <div className="login-spacer-lg" />
            <Button type="submit" size="large" disabled={loading} className="login-btn">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="login-hint">
            Dev mode: enter any username/password to sign in.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
