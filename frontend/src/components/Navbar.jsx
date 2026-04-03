import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <nav className="navbar">
      <div className="navInner">
        <div className="navBrand">
          <Link className="navBrandLink" to="/">
            DigitalCourier
          </Link>
        </div>

        <div className="navLinks">
          <Link className="navLink" to="/">
            Track Parcel
          </Link>

          {!loading && !user ? (
            <>
              <Link className="navLink" to="/login">
                Login
              </Link>
              <Link className="navLink" to="/register">
                Register
              </Link>
            </>
          ) : null}

          {!loading && user ? (
            <>
              <Link className="navLink" to={dashboardPath}>
                Dashboard
              </Link>
              <button
                className="navButton"
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

