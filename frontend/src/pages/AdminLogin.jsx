import "./AdminLogin.css";

import logo from "../assets/images/logo.png";
import bg from "../assets/admin-login/admin-bg.png";
import adminUser from "../assets/admin-login/admin-user.png";

import {
  FaEnvelope,
  FaLock,
  FaEye,
} from "react-icons/fa";

function AdminLogin() {
  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* Left Side */}
        <div
          className="admin-left"
          style={{
            backgroundImage: `url(${bg})`,
          }}
        >
          <img
            src={logo}
            alt="AgroInvest"
            className="admin-logo"
          />
        </div>

        {/* Right Side */}
        <div className="admin-right">

          <div className="admin-card">

            <div className="admin-user-circle">
              <img
                src={adminUser}
                alt=""
              />
            </div>

            <h2>Admin Login</h2>

            <p>
              Access the admin panel to manage the platform
            </p>

            <div className="input-box">
              <FaEnvelope />
              <input
                type="text"
                placeholder="Email or Phone"
              />
            </div>

            <div className="input-box">
              <FaLock />
              <input
                type="password"
                placeholder="Password"
              />
              <FaEye className="eye" />
            </div>

            <div className="admin-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <a href="#">
                Forgot Password?
              </a>
            </div>

            <button className="admin-btn">
              Login
            </button>

          </div>

        </div>

      </div>

      <footer>
        © 2026 AgroInvest. All rights reserved.
      </footer>
    </div>
  );
}

export default AdminLogin;