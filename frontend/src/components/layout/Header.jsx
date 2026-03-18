import { Link, useLocation } from 'react-router-dom';
import '../../styles/Header.css';

export default function Header() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="header-brand">
          <span className="header-logo">HCAT</span>
          <span className="header-title">High Country Aqua Tech</span>
        </Link>
        <nav className="header-nav">
          <Link
            to="/submit"
            className={location.pathname === '/submit' ? 'active' : ''}
          >
            Submit Sample
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={location.pathname === '/admin' ? 'active' : ''}
            >
              Dashboard
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
