import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import BlogCard from '../components/BlogCard.jsx';

export default function BlogList() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setLoading(true);
    api
      .get('/posts', { params: { q, limit: 24 } })
      .then((r) => setItems(r.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [q]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) setParams({ q: search.trim() });
    else setParams({});
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="eyebrow">Stories from the trail</div>
            <h2>The Blog</h2>
          </div>
          <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
            <input
              type="search"
              placeholder="Search stories, places, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: 280 }}
            />
            <button className="btn btn-primary btn-sm" type="submit">Search</button>
          </form>
        </div>

        {loading ? (
          <div className="center-msg">Loading…</div>
        ) : items.length === 0 ? (
          <div className="center-msg">
            No posts found. <Link to="/create">Write the first one →</Link>
          </div>
        ) : (
          <div className="blog-grid">
            {items.map((p) => (
              <BlogCard key={p._id} post={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
