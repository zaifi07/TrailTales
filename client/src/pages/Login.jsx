import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="form-card">
          <div className="eyebrow">Welcome back</div>
          <h2>Sign in</h2>
          <p className="sub">Continue your trail. Pick up where you left off.</p>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="form-row">
              <label>Username</label>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required autoFocus
              />
            </div>
            <div className="form-row">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 6 }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p style={{ marginTop: 18, textAlign: 'center', fontSize: '0.9rem', color: 'var(--c-muted)' }}>
            New here? <Link to="/signup" style={{ color: 'var(--c-accent)', fontWeight: 600 }}>Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
