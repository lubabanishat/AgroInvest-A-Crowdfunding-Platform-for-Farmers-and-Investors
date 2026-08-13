import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaThLarge,
  FaSeedling,
  FaWallet,
  FaChartLine,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import InvestorTopbar from "../components/investor/InvestorTopbar";

import logo from "../assets/images/logo.png";

import boroRice from "../assets/investor-dashboard/boro-rice.png";
import mango from "../assets/investor-dashboard/mango.png";
import tomato from "../assets/investor-dashboard/tomato.png";

import "./MyInvestment.css";

const API_URL = "https://agroinvest-backend-q6hl.onrender.com/api";
const BACKEND_URL = "https://agroinvest-backend-q6hl.onrender.com";

/* =========================
   GET TOKEN
========================= */

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

/* =========================
   PROJECT IMAGE
========================= */

const getProjectImage = (investment) => {
  if (investment?.land_image) {
    const normalizedPath =
      investment.land_image.replace(
        /\\/g,
        "/"
      );

    return `${BACKEND_URL}/${normalizedPath}`;
  }

  const text = `${
    investment?.title || ""
  } ${
    investment?.crop_type || ""
  }`.toLowerCase();

  if (text.includes("tomato")) {
    return tomato;
  }

  if (text.includes("mango")) {
    return mango;
  }

  return boroRice;
};

/* =========================
   FORMAT DATE
========================= */

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "N/A";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

/* =========================
   MY INVESTMENT
========================= */

function MyInvestment() {
  const navigate = useNavigate();

  const [investments, setInvestments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  /* =========================
     FETCH INVESTMENTS
  ========================= */

  useEffect(() => {
    const fetchInvestments = async () => {
      const token = getToken();

      if (!token) {
        setError(
          "Please login as an investor."
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/investments/my-investments`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load investments."
          );
        }

        const investmentList =
          Array.isArray(
            data.investments
          )
            ? data.investments
            : [];

        /*
          My Investment page-e
          successful/completed payment
          gula show korbo.
        */

        const completedOnly =
          investmentList.filter(
            (investment) =>
              investment.payment_status ===
              "completed"
          );

        setInvestments(completedOnly);
      } catch (err) {
        console.error(
          "My investment fetch error:",
          err
        );

        setError(
          err.message ||
            "Could not load investments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  /* =========================
     PREPARE DATA
  ========================= */

  const preparedInvestments =
    useMemo(() => {
      return investments.map(
        (investment) => {
          const targetAmount =
            Number(
              investment.target_amount
            ) || 0;

          const collectedAmount =
            Number(
              investment.collected_amount
            ) || 0;

          const progress =
            targetAmount > 0
              ? Math.min(
                  100,
                  Math.max(
                    0,
                    Math.round(
                      (collectedAmount /
                        targetAmount) *
                        100
                    )
                  )
                )
              : 0;

          const displayStatus =
            progress >= 100
              ? "Completed"
              : "Active";

          return {
            ...investment,
            progress,
            displayStatus,
          };
        }
      );
    }, [investments]);

  /* =========================
     FILTER
  ========================= */

  const filteredInvestments =
    useMemo(() => {
      if (
        statusFilter === "All"
      ) {
        return preparedInvestments;
      }

      return preparedInvestments.filter(
        (investment) =>
          investment.displayStatus ===
          statusFilter
      );
    }, [
      preparedInvestments,
      statusFilter,
    ]);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/");
  };

  return (
    <main className="my-investment-page">
      <div className="my-investment-container">

        {/* =====================
            SIDEBAR
        ===================== */}

        <aside className="my-investment-sidebar">
          <div>

            <div className="my-investment-logo">
              <img
                src={logo}
                alt="AgroInvest"
              />
            </div>

            <div className="investor-sidebar-label">
              <FaSeedling />

              <div>
                <strong>
                  Investor Dashboard
                </strong>

                <span>
                  Grow Together, Earn Together
                </span>
              </div>
            </div>

            <nav
              className="my-investment-menu"
              aria-label="Investor navigation"
            >
              <Link to="/investor/dashboard">
                <FaThLarge />
                <span>
                  Dashboard
                </span>
              </Link>

              <Link to="/projects">
                <FaSeedling />
                <span>
                  All Project
                </span>
              </Link>

              <Link
                to="/investor/my-investments"
                className="active"
              >
                <FaWallet />
                <span>
                  My Investment
                </span>
              </Link>

              <Link to="/investor/profit-report">
                <FaChartLine />
                <span>
                  Profit Report
                </span>
              </Link>

              <a href="#wallet">
                <FaWallet />
                <span>
                  Wallet
                </span>
              </a>

              <a href="#profile-settings">
                <FaUserCircle />
                <span>
                  Profile Setting
                </span>
              </a>

              <a href="#notifications">
                <FaBell />
                <span>
                  Notification
                </span>
              </a>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  border: "none",
                  background:
                    "transparent",
                  cursor: "pointer",
                }}
              >
                <FaSignOutAlt />

                <span>
                  Logout
                </span>
              </button>
            </nav>
          </div>

          <div className="investment-sidebar-card">
            <div className="investment-sidebar-icon">
              🌱
            </div>

            <h3>
              Invest in Agriculture
              <br />
              Secure Future
            </h3>

            <p>
              Your investment helps farmers
              grow and builds a better future.
            </p>
          </div>
        </aside>

        {/* =====================
            MAIN
        ===================== */}

        <section className="my-investment-main">

          <InvestorTopbar />

          <section className="my-investment-content">

            {/* =====================
                HEADER
            ===================== */}

            <div className="my-investment-header">
              <div>
                <h1>
                  My Investment
                </h1>

                <p>
                  Here you can see all
                  projects you have
                  invested in.
                </p>
              </div>

              <select
                aria-label="Filter investments by status"
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>

            {/* =====================
                LOADING
            ===================== */}

            {loading && (
              <div
                style={{
                  padding: "45px",
                  textAlign:
                    "center",
                }}
              >
                Loading your investments...
              </div>
            )}

            {/* =====================
                ERROR
            ===================== */}

            {!loading && error && (
              <div
                style={{
                  marginBottom:
                    "20px",
                  padding:
                    "16px",
                  color:
                    "#b42318",
                  backgroundColor:
                    "#fee4e2",
                  borderRadius:
                    "8px",
                }}
              >
                {error}
              </div>
            )}

            {/* =====================
                EMPTY STATE
            ===================== */}

            {!loading &&
              !error &&
              filteredInvestments.length ===
                0 && (
                <div
                  style={{
                    padding:
                      "50px 20px",
                    textAlign:
                      "center",
                  }}
                >
                  <h2>
                    No investments found.
                  </h2>

                  <p>
                    Your successful
                    investments will
                    appear here.
                  </p>

                  <Link
                    to="/projects"
                    className="my-investment-button"
                    style={{
                      display:
                        "inline-block",
                      marginTop:
                        "15px",
                    }}
                  >
                    Browse Projects
                  </Link>
                </div>
              )}

            {/* =====================
                INVESTMENT LIST
            ===================== */}

            {!loading &&
              !error &&
              filteredInvestments.length >
                0 && (
                <div className="my-investment-list">

                  {filteredInvestments.map(
                    (
                      investment
                    ) => (
                      <article
                        className="my-investment-card"
                        key={
                          investment.id
                        }
                      >

                        {/* IMAGE */}

                        <img
                          src={getProjectImage(
                            investment
                          )}
                          alt={
                            investment.title
                          }
                          className="my-investment-image"
                        />

                        {/* =====================
                            PROJECT INFO
                        ===================== */}

                        <div className="my-investment-project-info">

                          <h2>
                            {
                              investment.title
                            }
                          </h2>

                          <p>
                            <FaUserCircle />

                            Farmer:{" "}
                            {
                              investment.farmer_name
                            }
                          </p>

                          <p>
                            <FaMapMarkerAlt />

                            Bangladesh
                          </p>

                          <div className="my-investment-meta">

                            <div>
                              <span>
                                Invested Amount
                              </span>

                              <strong>
                                ৳{" "}
                                {Number(
                                  investment.amount
                                ).toLocaleString()}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Investment Date
                              </span>

                              <strong>
                                <FaCalendarAlt />

                                {formatDate(
                                  investment.created_at
                                )}
                              </strong>
                            </div>

                          </div>
                        </div>

                        {/* =====================
                            STATUS AREA
                        ===================== */}

                        <div className="my-investment-status-area">

                          <span className="status-title">
                            Status
                          </span>

                          <span
                            className={`investment-status-badge ${
                              investment.displayStatus ===
                              "Completed"
                                ? "completed"
                                : "active"
                            }`}
                          >
                            {
                              investment.displayStatus
                            }
                          </span>

                          <div className="my-investment-progress-header">

                            <span>
                              Funding progress
                            </span>

                            <strong>
                              {
                                investment.progress
                              }
                              %
                            </strong>

                          </div>

                          <div
                            className="my-investment-progress"
                            role="progressbar"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-valuenow={
                              investment.progress
                            }
                          >
                            <div
                              style={{
                                width:
                                  `${investment.progress}%`,
                              }}
                            />
                          </div>

                          {/* BUTTON */}

                          {investment.displayStatus ===
                          "Completed" ? (
                            <Link
                              to="/investor/profit-report"
                              className="my-investment-button"
                            >
                              View Profit
                            </Link>
                          ) : (
                            <Link
                              to={`/projects/${investment.project_id}`}
                              className="my-investment-button"
                            >
                              View Details
                            </Link>
                          )}

                        </div>
                      </article>
                    )
                  )}

                </div>
              )}

            {/* =====================
                NOTE
            ===================== */}

            <div className="my-investment-note">

              <FaInfoCircle />

              <div>
                <strong>
                  Note:
                </strong>

                <p>
                  You will be able to
                  see the profit once
                  the project is
                  completed.
                </p>
              </div>

            </div>

          </section>
        </section>
      </div>
    </main>
  );
}

export default MyInvestment;