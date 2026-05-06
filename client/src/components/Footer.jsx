import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h5>TrailTales</h5>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Stories, photos and tips from travellers exploring every corner
            of the world. Pack your bags — we'll bring the words.
          </p>
        </div>
        <div>
          <h5>Explore</h5>
          <Link to="/">Home</Link>
          <Link to="/blog">All stories</Link>
          <Link to="/signup">Join community</Link>
        </div>
        <div>
          <h5>Write</h5>
          <Link to="/create">New post</Link>
          <Link to="/dashboard">My dashboard</Link>
        </div>
        <div>
          <h5>Contact</h5>
          <a href="mailto:hello@trailtales.app">hello@trailtales.app</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Twitter</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} TrailTales. All journeys reserved.
      </div>
    </footer>
  );
}
