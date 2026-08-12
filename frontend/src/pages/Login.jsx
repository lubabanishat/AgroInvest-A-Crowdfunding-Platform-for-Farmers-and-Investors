import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa";

import logo from "../assets/images/logo.png";
import investorBg from "../assets/login/investor-bg.jpeg";
import shieldIcon from "../assets/login/shield.png";
import verifiedIcon from "../assets/login/verified.png";
import progressIcon from "../assets/login/progress.png";
import userIcon from "../assets/login/user.png";

import "./Login.css";

function Login() {
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
          data.message || "Login failed. Please try again."
        );
      }

      if (data.user.role !== "investor") {
        throw new Error(
          "This account is not registered as an investor."
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

      navigate("/investor/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="investor-login-page">
      <div className="investor-login-container">
        <section className="investor-login-content">
          {/* Left image section */}
          <div className="investor-left-panel">
            <img
              src={investorBg}
              alt="Agricultural investment"
              className="investor-main-image"
            />

            <div className="investor-image-overlay" />

            <Link to="/" className="investor-login-brand">
              <img
                src={logo}
                alt="AgroInvest Logo"
                className="investor-login-logo"
              />

              <div className="investor-brand-text">
                <h2>
                  <span className="agro-text">
                    Agro
                  </span>

                  <span className="invest-text">
                    Invest
                  </span>
                </h2>

                <p>
                  Invest. Grow. Impact.
                </p>
              </div>
            </Link>

            <div className="investor-welcome-text">
              <h1>
                Welcome Back,
              </h1>

              <h2>
                Investor
              </h2>

              <p>
                Invest in agriculture and
                <br />
                build a better future.
              </p>
            </div>
          </div>

          {/* Right login section */}
          <div className="investor-right-panel">
            <section className="investor-login-card">
              <div className="investor-profile-icon">
                <img
                  src={userIcon}
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <h2 className="investor-login-title">
                Investor Login
              </h2>

              <p className="investor-login-subtitle">
                Access your investment dashboard
              </p>

              <form
                className="investor-login-form"
                onSubmit={handleSubmit}
              >
                {/* Email */}
                <div className="investor-form-field">
                  <FaEnvelope className="investor-field-icon" />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Password */}
                <div className="investor-form-field">
                  <FaLock className="investor-field-icon" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="investor-eye-button"
                    onClick={() =>
                      setShowPassword(
                        (currentValue) =>
                          !currentValue
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

                {/* Remember + Forgot */}
                <div className="investor-login-options">
                  <label className="investor-remember-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(
                          event.target.checked
                        )
                      }
                    />

                    <span>
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    className="investor-forgot-button"
                    onClick={() =>
                      window.alert(
                        "Password recovery feature will be added later."
                      )
                    }
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Error Message */}
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

                {/* Login Button */}
                <button
                  type="submit"
                  className="investor-login-button"
                  disabled={loading}
                >
                  {loading
                    ? "Logging in..."
                    : "Login as Investor"}
                </button>

                <div className="investor-or-divider">
                  <span />
                  <p>or</p>
                  <span />
                </div>

                <div className="investor-signup-section">
                  <span>
                    Don&apos;t have an account?
                  </span>

                  <Link to="/register?role=investor">
                    Sign Up as Investor
                  </Link>
                </div>
              </form>
            </section>
          </div>
        </section>

        {/* Bottom benefits */}
        <section
          className="investor-benefits-section"
          aria-label="Investor benefits"
        >
          <article className="investor-benefit">
            <img
              src={shieldIcon}
              alt=""
              aria-hidden="true"
            />

            <p>
              Secure
              <br />
              Investments
            </p>
          </article>

          <article className="investor-benefit">
            <img
              src={verifiedIcon}
              alt=""
              aria-hidden="true"
            />

            <p>
              Verified
              <br />
              Farmers
            </p>
          </article>

          <article className="investor-benefit">
            <img
              src={progressIcon}
              alt=""
              aria-hidden="true"
            />

            <p>
              Track
              <br />
              Progress
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}

export default Login;