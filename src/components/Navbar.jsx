import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="logo-mz">MY</span>
          <span className="logo-lang">-Lang</span>
          <span className="logo-ide">IDE</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className={`navbar-link${path === '/' ? ' active' : ''}`}>
          ⌨ Editor
        </Link>
        <Link to="/docs" className={`navbar-link${path === '/docs' ? ' active' : ''}`}>
          📄 Docs
        </Link>
        <Link to="/tutorial" className={`navbar-link${path === '/tutorial' ? ' active' : ''}`}>
          🎓 Tutorial
        </Link>
      </div>

      <div className="navbar-status">
        <div className="status-dot" />
        <span>MY-Lang v1.0</span>
      </div>
    </nav>
  );
}
