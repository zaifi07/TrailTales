import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    location: '',
    coverImage: '',
    tags: '',
    excerpt: '',
    content: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
      };
      const res = await api.post('/posts', payload);
      navigate(`/blog/${res.data.post._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="form-card wide">
          <div className="eyebrow">New story</div>
          <h2>Tell a tale from the trail</h2>
          <p className="sub">Markdown is fine. Keep it honest, keep it yours.</p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-row">
              <label>Title</label>
              <input name="title" value={form.title} onChange={onChange} required maxLength={160} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-row">
                <label>Location</label>
                <input name="location" value={form.location} onChange={onChange} placeholder="e.g. Reykjavík, Iceland" />
              </div>
              <div className="form-row">
                <label>Tags (comma-separated)</label>
                <input name="tags" value={form.tags} onChange={onChange} placeholder="winter, hiking, solo" />
              </div>
            </div>
            <div className="form-row">
              <label>Cover image URL</label>
              <input name="coverImage" value={form.coverImage} onChange={onChange} placeholder="https://images.unsplash.com/…" />
            </div>
            <div className="form-row">
              <label>Excerpt (optional)</label>
              <input name="excerpt" value={form.excerpt} onChange={onChange} maxLength={280} />
            </div>
            <div className="form-row">
              <label>Story</label>
              <textarea name="content" value={form.content} onChange={onChange} required rows={14} />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Publishing…' : 'Publish story'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => history.back()}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
