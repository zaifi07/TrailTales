import { Link } from 'react-router-dom';

const fallback =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=70';

export default function BlogCard({ post }) {
  const cover = post.coverImage || fallback;
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return (
    <Link to={`/blog/${post._id}`} className="blog-card">
      <div
        className="blog-card-cover"
        style={{ backgroundImage: `url(${cover})` }}
      >
        <span className="stars">★ ★ ★ ★ ★</span>
      </div>
      <div className="blog-card-body">
        <div className="meta">
          <span>{date}</span>
          {post.location && <span>• {post.location}</span>}
          {post.author?.name && <span>• by {post.author.name}</span>}
        </div>
        <h3>{post.title}</h3>
        <p>
          {post.excerpt ||
            (post.content ? post.content.slice(0, 140) + (post.content.length > 140 ? '…' : '') : '')}
        </p>
        <span className="read-more">Read more</span>
      </div>
    </Link>
  );
}
