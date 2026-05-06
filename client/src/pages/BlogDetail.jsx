import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/posts/${id}`)
      .then((r) => setPost(r.data.post))
      .catch(() => setError('Post not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this post permanently?')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/blog');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="page-loading">Loading…</div>;
  if (error) return <div className="center-msg">{error}</div>;
  if (!post) return null;

  const isAuthor = user && post.author?._id === user.id;
  const cover =
    post.coverImage ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=80';

  return (
    <>
      <div className="post-hero" style={{ backgroundImage: `url(${cover})` }}>
        <div className="post-hero-inner">
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {post.location || 'Somewhere on the trail'}
          </div>
          <h1>{post.title}</h1>
          <div className="meta">
            By {post.author?.name || 'unknown'} ·{' '}
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          </div>
        </div>
      </div>

      <article className="post-body">
        {post.tags?.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            {post.tags.map((t) => (
              <span key={t} className="tag-pill">#{t}</span>
            ))}
          </div>
        )}
        <p>{post.content}</p>

        <div style={{ marginTop: 40, display: 'flex', gap: 10 }}>
          <Link to="/blog" className="btn btn-outline btn-sm">← All stories</Link>
          {isAuthor && (
            <>
              <Link to={`/edit/${post._id}`} className="btn btn-primary btn-sm">Edit</Link>
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </article>
    </>
  );
}
