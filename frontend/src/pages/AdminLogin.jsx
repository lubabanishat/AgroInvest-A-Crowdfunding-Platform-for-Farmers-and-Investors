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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      if (data.user.role !== "admin") {
        throw new Error(
          "This account is not an admin account."
        );
      }

      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>

              {/* Password */}
              <div className="input-box">
                <FaLock />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
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
                    setShowPassword(
                      !showPassword
                    )
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
                      setRememberMe(
                        event.target.checked
                      )
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

              {/* Error */}
              {error && (
                <div
                  style={{
                    marginBottom: "12px",
                    padding: "9px 12px",
                    color: "#b42318",
                    fontSize: "12px",
                    textAlign: "center",
                    backgroundColor: "#fee4e2",
                    borderRadius: "6px",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Login */}
              <button
                type="submit"
                className="admin-btn"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
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