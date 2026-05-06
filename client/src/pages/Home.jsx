import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import BlogCard from '../components/BlogCard.jsx';

const destinations = [
  {
    name: 'Tristique Magna',
    country: 'Norway',
    img: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?auto=format&fit=crop&w=500&q=65',
  },
  {
    name: 'Egestas Quis',
    country: 'Indonesia',
    img: 'https://images.unsplash.com/photo-1504457047772-27faf1c00561?auto=format&fit=crop&w=500&q=65',
  },
  {
    name: 'Ultricies Tristique',
    country: 'Ethiopia',
    img: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=500&q=65',
  },
  {
    name: 'Diam Maecenas',
    country: 'Laguna Beach',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=65',
  },
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/posts', { params: { limit: 4 } })
      .then((r) => setPosts(r.data.items || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.8)' }}>Where to go</div>
          <h1>Explore the world<br />with exciting people</h1>
          <p>
            TrailTales is a journal for the curious. Share where you've been, what
            moved you, and the strangers who turned into stories along the way.
          </p>
          <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
            <Link to="/blog" className="btn btn-primary">Start exploring</Link>
            <Link to="/signup" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>
              Join the community
            </Link>
          </div>

          <div className="hero-features">
            <div className="hero-feature">
              <div className="num">01</div>
              <h4>Choose the place &amp; time</h4>
              <p>Browse stories from real travellers. Find a destination that matches your mood and the weeks ahead.</p>
            </div>
            <div className="hero-feature">
              <div className="num">02</div>
              <h4>Compose your team</h4>
              <p>Connect with like-minded explorers and pick travel companions you actually want to share a sunrise with.</p>
            </div>
            <div className="hero-feature">
              <div className="num">03</div>
              <h4>Start exploring the world</h4>
              <p>Document each step. Your trail becomes a tale others can follow, remix and learn from.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Where to go</div>
            <h2>Popular Destinations</h2>
          </div>
          <div className="dest-grid">
            {destinations.map((d) => (
              <div key={d.name} className="dest-card">
                <img src={d.img} alt={d.name} loading="lazy" />
                <div className="dest-card-text">
                  <h3>{d.name}</h3>
                  <span>📍 {d.country}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story / featured */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="story-wrap">
            <div>
              <div className="eyebrow">A traveller's story</div>
              <h2>Walks taken and lessons learned along the way</h2>
              <p>
                Every trail leaves a mark. The best journeys aren't measured in
                kilometres but in the conversations, the missed buses, the meals
                eaten with strangers. Here's where you bottle that.
              </p>
              <Link to="/blog" className="btn btn-primary" style={{ marginTop: 8 }}>
                Read featured stories
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=65"
              alt="Hikers"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Trips gallery</div>
            <h2>Completed Journeys</h2>
          </div>
          {loading ? (
            <div className="center-msg">Loading stories…</div>
          ) : posts.length === 0 ? (
            <div className="center-msg">
              No stories yet. <Link to="/signup">Sign up</Link> and write the first one.
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((p) => (
                <BlogCard key={p._id} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
