import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";

import registerBg from "../assets/register/register-bg.png";
import secureIcon from "../assets/register/secure.png";
import verifiedIcon from "../assets/register/verified.png";
import growthIcon from "../assets/register/growth.png";
import farmerIcon from "../assets/register/farmer-user.png";
import investorIcon from "../assets/register/investor-user.png";

import "./Register.css";

function Register() {
  const [searchParams] = useSearchParams();

  const roleFromUrl = searchParams.get("role");

  const [selectedRole, setSelectedRole] = useState(
    roleFromUrl === "farmer" ? "farmer" : "investor"
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  useEffect(() => {
    if (roleFromUrl === "farmer" || roleFromUrl === "investor") {
      setSelectedRole(roleFromUrl);
    }
  }, [roleFromUrl]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      window.alert("Password and confirm password do not match.");
      return;
    }

    const registrationData = {
      role: selectedRole,
      ...formData,
    };

    console.log("Registration data:", registrationData);
  };

  const benefits = [
    {
      id: 1,
      icon: secureIcon,
      title: "Secure & Reliable",
      description:
        "Your data is protected and transactions are 100% secure.",
    },
    {
      id: 2,
      icon: verifiedIcon,
      title: "Verified & Trusted",
      description:
        "All farmers are verified and projects are monitored by our team.",
    },
    {
      id: 3,
      icon: growthIcon,
      title: "Grow Together",
      description:
        "Invest, support and grow a sustainable agriculture future together.",
    },
  ];

  return (
    <main className="register-page">
      <Navbar />

      <section className="register-main">
        <aside className="register-left-panel">
          <div className="register-left-content">
            <h1>
              Join <span>AgroInvest</span>
              <br />
              and build a better future.
            </h1>

            <p className="register-intro">
              Create your account as a farmer or investor and be a
              part of our trusted agricultural investment platform.
            </p>

            <div className="register-benefits-list">
              {benefits.map((benefit) => (
                <article
                  className="register-benefit-item"
                  key={benefit.id}
                >
                  <div className="register-benefit-icon">
                    <img
                      src={benefit.icon}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2>{benefit.title}</h2>
                    <p>{benefit.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="register-image-area">
            <img
              src={registerBg}
              alt="Young plant growing in an agricultural field"
            />

            <div className="register-security-message">
              <FaLock aria-hidden="true" />

              <div>
                <strong>Your data is safe with us.</strong>

                <p>
                  We never share your information with anyone.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section
          className="register-form-panel"
          aria-labelledby="register-heading"
        >
          <div className="register-form-header">
            <h2 id="register-heading">Create Your Account</h2>

            <p>
              Sign up as a farmer or investor to get started
            </p>
          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <fieldset className="register-role-fieldset">
              <legend>I want to join as</legend>

              <div className="register-role-options">
                <button
                  type="button"
                  className={`register-role-card ${
                    selectedRole === "farmer" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedRole("farmer")}
                  aria-pressed={selectedRole === "farmer"}
                >
                  <img
                    src={farmerIcon}
                    alt=""
                    aria-hidden="true"
                  />

                  <strong>Farmer</strong>

                  <span>
                    I want to raise funds
                    <br />
                    for my farming projects
                  </span>
                </button>

                <button
                  type="button"
                  className={`register-role-card ${
                    selectedRole === "investor" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedRole("investor")}
                  aria-pressed={selectedRole === "investor"}
                >
                  <img
                    src={investorIcon}
                    alt=""
                    aria-hidden="true"
                  />

                  <strong>Investor</strong>

                  <span>
                    I want to invest in
                    <br />
                    agricultural projects
                  </span>
                </button>
              </div>
            </fieldset>
                        <label className="register-label">
              Full Name
            </label>

            <div className="register-input">
              <FaUser className="register-input-icon" />

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="register-two-column">

              <div>
                <label className="register-label">
                  Email Address
                </label>

                <div className="register-input">
                  <FaEnvelope className="register-input-icon" />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="register-label">
                  Phone Number
                </label>

                <div className="register-input">
                  <FaPhoneAlt className="register-input-icon" />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

            </div>

            <div className="register-two-column">

              <div>
                <label className="register-label">
                  Password
                </label>

                <div className="register-input">
                  <FaLock className="register-input-icon" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-eye-btn"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="register-label">
                  Confirm Password
                </label>

                <div className="register-input">
                  <FaLock className="register-input-icon" />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-eye-btn"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </div>

            </div>

            <label className="register-label">
              Location
            </label>

            <div className="register-input">
              <FaMapMarkerAlt className="register-input-icon" />

              <input
                type="text"
                name="location"
                placeholder="Select your location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <label className="register-checkbox">

              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleInputChange}
                required
              />

              <span>
                I agree to the{" "}
                <Link to="#">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="#">
                  Privacy Policy
                </Link>
              </span>

            </label>

            <button
              type="submit"
              className="register-submit-btn"
            >
              Create Account
            </button>

            <p className="register-login-link">
              Already have an account?{" "}
              <Link
                to={
                  selectedRole === "farmer"
                    ? "/farmer/login"
                    : "/login?role=investor"
                }
              >
                Login
              </Link>
            </p>

          </form>

        </section>

      </section>

    </main>
  );
}

export default Register;