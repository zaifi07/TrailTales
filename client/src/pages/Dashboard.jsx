import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    if (!user) return;
    setLoading(true);
    api
      .get('/posts', { params: { author: user.id, limit: 50 } })
      .then((r) => setItems(r.data.items || []))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this story?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setItems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div
          className="section-head"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}
        >
          <div>
            <div className="eyebrow">Your trail</div>
            <h2>Dashboard</h2>
            <p style={{ marginTop: 6 }}>
              Hello, {user?.name}. {items.length} {items.length === 1 ? 'story' : 'stories'} so far.
            </p>
          </div>
          <Link to="/create" className="btn btn-primary">+ New story</Link>
        </div>

        {loading ? (
          <div className="center-msg">Loading…</div>
        ) : items.length === 0 ? (
          <div className="center-msg">
            You haven't written anything yet. <Link to="/create">Start your first story →</Link>
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id}>
                  <td><Link to={`/blog/${p._id}`}>{p.title}</Link></td>
                  <td>{p.location || '—'}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/edit/${p._id}`} className="btn btn-outline btn-sm">Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
