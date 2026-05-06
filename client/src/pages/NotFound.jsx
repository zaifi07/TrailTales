import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="center-msg" style={{ padding: '120px 20px' }}>
          <div className="eyebrow">404</div>
          <h2 style={{ marginTop: 8 }}>This trail doesn't lead anywhere.</h2>
          <p>The page you're looking for has wandered off.</p>
          <Link to="/" className="btn btn-primary">Back home</Link>
        </div>
      </div>
    </section>
  );
}
