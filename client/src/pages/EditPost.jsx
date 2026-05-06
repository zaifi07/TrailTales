import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`).then((r) => {
      const p = r.data.post;
      if (user && p.author?._id !== user.id) {
        setError('You can only edit your own posts.');
        return;
      }
      setForm({
        title: p.title || '',
        location: p.location || '',
        coverImage: p.coverImage || '',
        tags: (p.tags || []).join(', '),
        excerpt: p.excerpt || '',
        content: p.content || '',
      });
    }).catch(() => setError('Post not found.'));
  }, [id, user]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.put(`/posts/${id}`, {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      });
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (error) return <div className="center-msg">{error}</div>;
  if (!form) return <div className="page-loading">Loading…</div>;

  return (
    <section className="section">
      <div className="container">
        <div className="form-card wide">
          <div className="eyebrow">Edit story</div>
          <h2>Refine your tale</h2>
          <form onSubmit={onSubmit}>
            <div className="form-row">
              <label>Title</label>
              <input name="title" value={form.title} onChange={onChange} required maxLength={160} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-row">
                <label>Location</label>
                <input name="location" value={form.location} onChange={onChange} />
              </div>
              <div className="form-row">
                <label>Tags</label>
                <input name="tags" value={form.tags} onChange={onChange} />
              </div>
            </div>
            <div className="form-row">
              <label>Cover image URL</label>
              <input name="coverImage" value={form.coverImage} onChange={onChange} />
            </div>
            <div className="form-row">
              <label>Excerpt</label>
              <input name="excerpt" value={form.excerpt} onChange={onChange} maxLength={280} />
            </div>
            <div className="form-row">
              <label>Story</label>
              <textarea name="content" value={form.content} onChange={onChange} required rows={14} />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
