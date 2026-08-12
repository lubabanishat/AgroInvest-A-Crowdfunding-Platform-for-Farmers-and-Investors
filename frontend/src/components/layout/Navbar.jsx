import {
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaUser,
  FaUserTie,
  FaSeedling,
  FaUserShield,
} from "react-icons/fa";

import logo from "../../assets/images/logo.png";

import "./Navbar.css";


function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `nav-link agro-nav-link ${
      isActive ? "active" : ""
    }`;


  /* =========================
     CONTACT SCROLL
  ========================= */

  const handleContactClick = (event) => {
    event.preventDefault();

    // If already on homepage
    if (location.pathname === "/") {
      const contactSection =
        document.getElementById("contact");

      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    // If user is on another page,
    // go to homepage first
    navigate("/#contact");

    setTimeout(() => {
      const contactSection =
        document.getElementById("contact");

      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);
  };


  return (
    <nav className="navbar navbar-expand-lg bg-white agro-navbar">
      <div className="container py-2">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
        >
          <img
            src={logo}
            alt="AgroInvest Logo"
            className="agro-logo"
          />

          <div>
            <div className="agro-brand-name">
              AgroInvest
            </div>

            <small className="agro-brand-tagline">
              Invest. Grow. Impact.
            </small>
          </div>
        </Link>


        {/* =========================
            MOBILE TOGGLE
        ========================= */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#agroNavbar"
          aria-controls="agroNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>


        <div
          className="collapse navbar-collapse"
          id="agroNavbar"
        >

          {/* =========================
              NAVIGATION
          ========================= */}

          <ul className="navbar-nav mx-auto align-items-lg-center gap-lg-2">

            {/* HOME */}

            <li className="nav-item">
              <NavLink
                className={navLinkClass}
                to="/"
                end
              >
                Home
              </NavLink>
            </li>


            {/* PROJECTS */}

            <li className="nav-item">
              <NavLink
                className={navLinkClass}
                to="/projects"
              >
                Projects
              </NavLink>
            </li>


            {/* HOW IT WORKS */}

            <li className="nav-item">
              <a
                className="nav-link agro-nav-link"
                href="/#how-it-works"
              >
                How It Works
              </a>
            </li>


            {/* CONTACT */}

            <li className="nav-item">
              <a
                href="#contact"
                className="nav-link agro-nav-link"
                onClick={handleContactClick}
              >
                Contact
              </a>
            </li>

          </ul>


          {/* =========================
              LOGIN & SIGNUP
          ========================= */}

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">

            {/* LOGIN */}

            <div className="dropdown">

              <button
                className="btn btn-outline-success dropdown-toggle agro-login-btn"
                type="button"
                data-bs-toggle="dropdown"
              >
                <FaUser size={13} />

                <span>
                  Login
                </span>
              </button>


              <ul className="dropdown-menu dropdown-menu-end agro-dropdown-menu">

                <li>
                  <Link
                    className="dropdown-item agro-dropdown-item"
                    to="/login?role=investor"
                  >
                    <FaUserTie className="text-success" />

                    Investor Login
                  </Link>
                </li>


                <li>
                  <Link
                    className="dropdown-item agro-dropdown-item"
                    to="/farmer/login"
                  >
                    <FaSeedling className="text-success" />

                    Farmer Login
                  </Link>
                </li>


                <li>
                  <Link
                    className="dropdown-item agro-dropdown-item"
                    to="/admin/login"
                  >
                    <FaUserShield className="text-success" />

                    Admin Login
                  </Link>
                </li>

              </ul>

            </div>


            {/* SIGN UP */}

            <div className="dropdown">

              <button
                className="btn btn-success dropdown-toggle agro-signup-btn"
                type="button"
                data-bs-toggle="dropdown"
              >
                <FaUser size={13} />

                <span>
                  Sign Up
                </span>
              </button>


              <ul className="dropdown-menu dropdown-menu-end agro-dropdown-menu">

                <li>
                  <Link
                    className="dropdown-item agro-dropdown-item"
                    to="/register?role=investor"
                  >
                    <FaUserTie className="text-success" />

                    Investor Registration
                  </Link>
                </li>


                <li>
                  <Link
                    className="dropdown-item agro-dropdown-item"
                    to="/register?role=farmer"
                  >
                    <FaSeedling className="text-success" />

                    Farmer Registration
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