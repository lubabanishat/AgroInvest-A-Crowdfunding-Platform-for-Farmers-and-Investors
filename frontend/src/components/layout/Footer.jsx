import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer
      style={{
        background: "#2E7D32",
        color: "white",
        padding: "55px 0 25px",
        marginTop: "70px",
      }}
    >
      <div className="container">
        <div className="row">

          {/* Logo */}
          <div className="col-lg-4 mb-4">
            <h2
              style={{
                fontWeight: 700,
                color: "#34C759",
              }}
            >
              AgroInvest
            </h2>

            <p
              style={{
                color: "#f4f4f4",
                marginTop: "18px",
                lineHeight: "28px",
              }}
            >
              Empowering farmers through crowdfunding and creating sustainable
              investment opportunities for everyone.
            </p>

            <div className="d-flex gap-3 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "white",
                  fontSize: "22px",
                }}
              >
                <FaFacebookF />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "white",
                  fontSize: "22px",
                }}
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>

            <div className="d-flex flex-column gap-2">
              <Link to="/" className="text-white text-decoration-none">
                Home
              </Link>

              <Link
                to="/projects"
                className="text-white text-decoration-none"
              >
                Projects
              </Link>

              <Link
                to="/about"
                className="text-white text-decoration-none"
              >
                About Us
              </Link>

              <Link
                to="/contact"
                className="text-white text-decoration-none"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="col-lg-2 mb-4">
            <h5 className="fw-bold mb-3">Support</h5>

            <div className="d-flex flex-column gap-2">
              <a href="#" className="text-white text-decoration-none">
                FAQs
              </a>

              <a href="#" className="text-white text-decoration-none">
                Privacy Policy
              </a>

              <a href="#" className="text-white text-decoration-none">
                Terms & Conditions
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="col-lg-3">
            <h5 className="fw-bold mb-3">Contact</h5>

            <p>
              <FaEnvelope className="me-2" />
              info@agroinvest.com
            </p>

            <p>
              <FaPhone className="me-2" />
              +880 1234-567890
            </p>

            <p>
              <FaMapMarkerAlt className="me-2" />
              Dhaka, Bangladesh
            </p>
          </div>
        </div>

        <hr className="border-light my-4" />

        <div className="text-center">
          © 2026 AgroInvest. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;