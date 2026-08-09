import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminLogin.css";

import logo from "../assets/images/logo.png";
import bg from "../assets/admin-login/admin-bg.png";
import adminUser from "../assets/admin-login/admin-user.png";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function AdminLogin() {
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Temporary frontend login
    // Later backend authentication can be added here.
    navigate("/admin/dashboard");
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-wrapper">

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
                alt="Admin"
              />
            </div>

            <h2>Admin Login</h2>

            <p>
              Access the admin panel to manage the platform
            </p>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="input-box">
                <FaEnvelope />

                <input
                  type="text"
                  placeholder="Email or Phone"
                  value={emailOrPhone}
                  onChange={(event) =>
                    setEmailOrPhone(event.target.value)
                  }
                  required
                />
              </div>

              {/* Password */}
              <div className="input-box">
                <FaLock />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              {/* Options */}
              <div className="admin-options">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                  />

                  Remember me
                </label>

                <button
                  type="button"
                  className="admin-forgot-link"
                  onClick={() =>
                    alert(
                      "Password recovery feature will be added later."
                    )
                  }
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login */}
              <button
                type="submit"
                className="admin-btn"
              >
                Login
              </button>

            </form>
          </div>
        </div>
      </div>

      <footer>
        © 2026 AgroInvest. All rights reserved.
      </footer>
    </main>
  );
}

export default AdminLogin;