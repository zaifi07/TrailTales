import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup({
        name: form.name.trim(),
        username: form.username.trim().toLowerCase(),
        password: form.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="form-card">
          <div className="eyebrow">Join the trail</div>
          <h2>Create your account</h2>
          <p className="sub">No email needed. Pick a name and a username — that's it.</p>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="form-row">
              <label>Display name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Amelia Simpson"
                required maxLength={60} autoFocus
              />
            </div>
            <div className="form-row">
              <label>Username</label>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="ameliawanders"
                pattern="[a-zA-Z0-9_]{3,24}"
                required
              />
            </div>
            <div className="form-row">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required minLength={6}
              />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 6 }} disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </button>
          </form>
          <p style={{ marginTop: 18, textAlign: 'center', fontSize: '0.9rem', color: 'var(--c-muted)' }}>
            Already have one? <Link to="/login" style={{ color: 'var(--c-accent)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
