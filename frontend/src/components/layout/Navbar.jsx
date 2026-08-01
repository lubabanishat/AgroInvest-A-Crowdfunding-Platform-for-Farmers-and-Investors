import { Link } from "react-router-dom";
import { FaUser, FaUserTie, FaSeedling } from "react-icons/fa";
import logo from "../../assets/images/logo.png";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg bg-white shadow-sm"
      style={{ borderBottom: "1px solid #e8eee8" }}
    >
      <div className="container py-2">
        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
        >
          <img
            src={logo}
            alt="AgroInvest Logo"
            width="42"
            height="42"
            style={{ objectFit: "contain" }}
          />

          <div>
            <div
              className="fw-bold"
              style={{
                color: "#1f8f4e",
                fontSize: "28px",
                lineHeight: "1",
              }}
            >
              AgroInvest
            </div>

            <small
              className="text-muted"
              style={{ fontSize: "10px" }}
            >
              Invest. Grow. Impact.
            </small>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#agroNavbar"
          aria-controls="agroNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="agroNavbar"
        >
          <ul className="navbar-nav mx-auto align-items-lg-center gap-lg-3">
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                style={{ color: "#168944" }}
                to="/"
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-dark" to="/projects">
                Projects
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link text-dark" href="#how-it-works">
                How It Works
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link text-dark" href="#about">
                About Us
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link text-dark" href="#contact">
                Contact
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <div className="dropdown">
              <button
                className="btn btn-outline-success btn-sm dropdown-toggle d-flex align-items-center gap-2 px-3 py-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUser size={13} />
                Login
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-2"
                    to="/login?role=investor"
                  >
                    <FaUserTie className="text-success" />
                    Investor
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-2"
                    to="/login?role=farmer"
                  >
                    <FaSeedling className="text-success" />
                    Farmer
                  </Link>
                </li>
              </ul>
            </div>

            <div className="dropdown">
              <button
                className="btn btn-success btn-sm dropdown-toggle d-flex align-items-center gap-2 px-3 py-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUser size={13} />
                Sign Up
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-2"
                    to="/register?role=investor"
                  >
                    <FaUserTie className="text-success" />
                    Investor
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-2"
                    to="/register?role=farmer"
                  >
                    <FaSeedling className="text-success" />
                    Farmer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;