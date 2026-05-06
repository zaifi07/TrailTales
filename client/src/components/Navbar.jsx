import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="logo-dot" />
          TrailTales
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          {user && <NavLink to="/create">Write</NavLink>}
        </nav>

        <div className="nav-cta">
          {user ? (
            <>
              <span style={{ fontSize: '0.88rem', color: 'var(--c-ink-soft)' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Join</Link>
            </>
          )}
          <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
