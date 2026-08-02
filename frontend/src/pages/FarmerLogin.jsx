import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa";

import logo from "../assets/images/logo.png";
import farmerBg from "../assets/farmer-login/farmer-bg.png";
import farmerUser from "../assets/farmer-login/farmer-user.png";
import createProjectsIcon from "../assets/farmer-login/create-projects.png";
import trackFundingIcon from "../assets/farmer-login/track-funding.png";
import growTogetherIcon from "../assets/farmer-login/grow-together.png";

import "./FarmerLogin.css";

function FarmerLogin() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const loginData = {
      role: "farmer",
      emailOrPhone,
      password,
      rememberMe,
    };

    console.log("Farmer login data:", loginData);
  };

  return (
    <main className="farmer-login-page">
      <div className="farmer-login-container">
        <section className="farmer-login-content">
          {/* Left side */}
          <div className="farmer-left-panel">
            <img
              src={farmerBg}
              alt="Farmer working in an agricultural field"
              className="farmer-main-image"
            />

            <div className="farmer-image-overlay" />

            <Link to="/" className="farmer-login-brand">
              <img
                src={logo}
                alt="AgroInvest Logo"
                className="farmer-login-logo"
              />

              <div className="farmer-brand-text">
                <h2>
                  <span className="farmer-agro-text">Agro</span>
                  <span className="farmer-invest-text">Invest</span>
                </h2>

                <p>Invest. Grow. Impact.</p>
              </div>
            </Link>

            <div className="farmer-welcome-text">
              <h1>Welcome Back,</h1>
              <h2>Farmer</h2>

              <p>
                Manage your projects and
                <br />
                grow together.
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="farmer-right-panel">
            <section className="farmer-login-card">
              <div className="farmer-profile-icon">
                <img
                  src={farmerUser}
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <h2 className="farmer-login-title">
                Farmer Login
              </h2>

              <p className="farmer-login-subtitle">
                Access your farmer dashboard
              </p>

              <form
                className="farmer-login-form"
                onSubmit={handleSubmit}
              >
                <div className="farmer-form-field">
                  <FaEnvelope className="farmer-field-icon" />

                  <input
                    type="text"
                    name="emailOrPhone"
                    placeholder="Email or Phone"
                    value={emailOrPhone}
                    onChange={(event) =>
                      setEmailOrPhone(event.target.value)
                    }
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="farmer-form-field">
                  <FaLock className="farmer-field-icon" />

                  <input
                    type={showPassword ? "text" : "password"}
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
                    className="farmer-eye-button"
                    onClick={() =>
                      setShowPassword((currentValue) => !currentValue)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="farmer-login-options">
                  <label className="farmer-remember-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                    />

                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="farmer-forgot-button"
                    onClick={() =>
                      window.alert(
                        "Password recovery feature will be added later."
                      )
                    }
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="farmer-login-button"
                >
                  Login as Farmer
                </button>

                <div className="farmer-or-divider">
                  <span />
                  <p>or</p>
                  <span />
                </div>

                <div className="farmer-signup-section">
                  <span>Don&apos;t have an account?</span>

                  <Link to="/register?role=farmer">
                    Sign Up as Farmer
                  </Link>
                </div>
              </form>
            </section>
          </div>
        </section>

        {/* Bottom benefits */}
        <section
          className="farmer-benefits-section"
          aria-label="Farmer benefits"
        >
          <article className="farmer-benefit">
            <img
              src={createProjectsIcon}
              alt=""
              aria-hidden="true"
            />

            <p>
              Create
              <br />
              Projects
            </p>
          </article>

          <article className="farmer-benefit">
            <img
              src={trackFundingIcon}
              alt=""
              aria-hidden="true"
            />

            <p>
              Track
              <br />
              Funding
            </p>
          </article>

          <article className="farmer-benefit">
            <img
              src={growTogetherIcon}
              alt=""
              aria-hidden="true"
            />

            <p>
              Grow
              <br />
              Together
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}

export default FarmerLogin;