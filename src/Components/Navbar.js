import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';

const HeaderNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">
        Ashesi Career Services
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarText">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item active">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/About" className="nav-link">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/review" className="nav-link">
              Send For Review
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/admin" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/adminpage" className="nav-link">
              Admin
            </Link>
          </li>
        </ul>

        <form className="form-inline my-2 my-lg-0">
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="/register">
                <span className="glyphicon glyphicon-user"></span> Sign Up
              </Link>
            </li>
            <li>
              <Link to="/login">
                <span className="glyphicon glyphicon-log-in"></span> Login
              </Link>
            </li>
          </ul>
        </form>
      </div>
    </nav>
  );
}

export default HeaderNavbar;
