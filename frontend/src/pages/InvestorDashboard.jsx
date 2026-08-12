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
  FaEnvelope,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaChartBar,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLeaf,
  FaTruck,
  FaClock,
  FaArrowRight,
  FaFileInvoiceDollar,
  FaComments,
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
import chilli from "../assets/investor-dashboard/chilli.png";

import "./InvestorDashboard.css";

const API_URL = "http://localhost:5000/api";

/* =========================
   STATIC PROJECT UPDATES
   We will connect milestones later.
========================= */

const projectUpdates = [
  {
    id: 1,
    title: "Boro Rice Cultivation",
    description: "Land preparation completed",
    time: "2 days ago",
    icon: <FaCheckCircle />,
    color: "green",
  },
  {
    id: 2,
    title: "Mango Orchard",
    description: "Flowering stage started",
    time: "5 days ago",
    icon: <FaLeaf />,
    color: "blue",
  },
  {
    id: 3,
    title: "Tomato Farming",
    description: "First harvest completed",
    time: "1 week ago",
    icon: <FaTruck />,
    color: "purple",
  },
  {
    id: 4,
    title: "Green Chilli Cultivation",
    description: "Project is under review",
    time: "1 week ago",
    icon: <FaClock />,
    color: "orange",
  },
];

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
   GET USER
========================= */

const getStoredUser = () => {
  const savedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error(
      "Stored user parse error:",
      error
    );

    return null;
  }
};

/* =========================
   PROJECT IMAGE
========================= */

const getProjectImage = (investment) => {
  const text = `${
    investment.title || ""
  } ${
    investment.crop_type || ""
  }`.toLowerCase();

  if (text.includes("mango")) {
    return mango;
  }

  if (text.includes("tomato")) {
    return tomato;
  }

  if (
    text.includes("chilli") ||
    text.includes("chili")
  ) {
    return chilli;
  }

  return boroRice;
};

/* =========================
   DATE FORMAT
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
      month: "short",
      year: "numeric",
    }
  );
};

/* =========================
   INVESTOR DASHBOARD
========================= */

function InvestorDashboard() {
  const navigate = useNavigate();

  const [investments, setInvestments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const user = getStoredUser();

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

        /* =====================
           MY INVESTMENTS
        ===================== */

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

        /* =====================
           GET PROJECT FUNDING
           PROGRESS
        ===================== */

        const investmentsWithProgress =
          await Promise.all(
            investmentList.map(
              async (investment) => {
                try {
                  const summaryResponse =
                    await fetch(
                      `${API_URL}/investments/summary/${investment.project_id}`
                    );

                  const summaryData =
                    await summaryResponse.json();

                  return {
                    ...investment,

                    funding_progress:
                      summaryResponse.ok
                        ? Number(
                            summaryData
                              .summary
                              ?.funding_progress
                          ) || 0
                        : 0,
                  };
                } catch (
                  summaryError
                ) {
                  console.error(
                    "Funding summary error:",
                    summaryError
                  );

                  return {
                    ...investment,
                    funding_progress: 0,
                  };
                }
              }
            )
          );

        setInvestments(
          investmentsWithProgress
        );
      } catch (err) {
        console.error(
          "Investor dashboard error:",
          err
        );

        setError(
          err.message ||
            "Could not load investor dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

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

  /* =========================
     COMPLETED INVESTMENTS
  ========================= */

  const completedInvestments =
    useMemo(() => {
      return investments.filter(
        (investment) =>
          investment.payment_status ===
          "completed"
      );
    }, [investments]);

  /* =========================
     TOTAL INVESTMENT
  ========================= */

  const totalInvestment =
    useMemo(() => {
      return completedInvestments.reduce(
        (total, investment) =>
          total +
          (Number(
            investment.amount
          ) || 0),
        0
      );
    }, [completedInvestments]);

  /* =========================
     DISTINCT PROJECTS
  ========================= */

  const investedProjectCount =
    useMemo(() => {
      return new Set(
        completedInvestments.map(
          (investment) =>
            investment.project_id
        )
      ).size;
    }, [completedInvestments]);

  /* =========================
     ACTIVE PROJECTS
  ========================= */

  const activeProjectCount =
    useMemo(() => {
      return new Set(
        completedInvestments
          .filter(
            (investment) =>
              Number(
                investment
                  .funding_progress
              ) < 100
          )
          .map(
            (investment) =>
              investment.project_id
          )
      ).size;
    }, [completedInvestments]);

  /* =========================
     FULLY FUNDED PROJECTS
  ========================= */

  const completedProjectCount =
    useMemo(() => {
      return new Set(
        completedInvestments
          .filter(
            (investment) =>
              Number(
                investment
                  .funding_progress
              ) >= 100
          )
          .map(
            (investment) =>
              investment.project_id
          )
      ).size;
    }, [completedInvestments]);

  /* =========================
     ESTIMATED PROFIT

     Current project UI uses 15%
     expected profit. Later this
     can come from database.
  ========================= */

  const estimatedProfit =
    totalInvestment * 0.15;

  /* =========================
     RECENT INVESTMENTS
  ========================= */

  const recentInvestments =
    investments.slice(0, 4);

  return (
    <main className="investor-dashboard-page">
      <div className="dashboard-container">

        {/* =====================
            SIDEBAR
        ===================== */}

        <aside className="dashboard-sidebar">
          <div>
            <div className="sidebar-logo">
              <img
                src={logo}
                alt="AgroInvest"
              />
            </div>

            <nav
              className="sidebar-menu"
              aria-label="Investor navigation"
            >
              <Link
                to="/investor/dashboard"
                className="active"
              >
                <FaThLarge />

                <span>
                  Dashboard
                </span>
              </Link>

              <Link to="/projects">
                <FaSeedling />

                <span>
                  Browse Projects
                </span>
              </Link>

              <Link to="/investor/my-investments">
                <FaWallet />

                <span>
                  My Investments
                </span>
              </Link>

              <Link to="/investor/profit-report">
                <FaChartLine />

                <span>
                  Profit Report
                </span>
              </Link>

              <a href="#notifications">
                <FaBell />

                <span>
                  Notifications
                </span>
              </a>

              <a href="#messages">
                <FaEnvelope />

                <span>
                  Messages
                </span>
              </a>

              <a href="#profile">
                <FaUser />

                <span>
                  Profile
                </span>
              </a>

              <a href="#settings">
                <FaCog />

                <span>
                  Settings
                </span>
              </a>

              <a href="#help-support">
                <FaQuestionCircle />

                <span>
                  Help & Support
                </span>
              </a>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                style={{
                  width: "100%",
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

          <div className="sidebar-grow-card">
            <div
              className="grow-icon"
              aria-hidden="true"
            >
              🌱
            </div>

            <h4>
              Grow Agriculture
            </h4>

            <p>
              Grow Bangladesh with smart
              agricultural investment.
            </p>
          </div>
        </aside>

        {/* =====================
            MAIN CONTENT
        ===================== */}

        <section className="dashboard-main">

          <InvestorTopbar />

          <section className="dashboard-welcome">
            <h1>
              Welcome back,{" "}
              {user?.full_name ||
                "Investor"}
            </h1>

            <p>
              Here&apos;s what&apos;s
              happening with your
              projects today.
            </p>
          </section>

          {/* =====================
              ERROR
          ===================== */}

          {error && (
            <div
              style={{
                marginBottom:
                  "18px",
                padding:
                  "12px 15px",
                color:
                  "#b42318",
                background:
                  "#fee4e2",
                borderRadius:
                  "8px",
              }}
            >
              {error}
            </div>
          )}

          {/* =====================
              SUMMARY
          ===================== */}

          <section className="dashboard-summary">

            <article className="summary-card">
              <div className="summary-icon investment">
                <FaWallet />
              </div>

              <h3>
                Total Investment
              </h3>

              <h2>
                ৳{" "}
                {totalInvestment.toLocaleString()}
              </h2>

              <p>
                In{" "}
                {investedProjectCount}{" "}
                {investedProjectCount ===
                1
                  ? "Project"
                  : "Projects"}
              </p>
            </article>

            <article className="summary-card">
              <div className="summary-icon active">
                <FaClipboardList />
              </div>

              <h3>
                Active Projects
              </h3>

              <h2>
                {activeProjectCount}
              </h2>

              <p>
                Ongoing Investment
              </p>
            </article>

            <article className="summary-card">
              <div className="summary-icon profit">
                <FaChartBar />
              </div>

              <h3>
                Estimated Profit
              </h3>

              <h2>
                ৳{" "}
                {estimatedProfit.toLocaleString()}
              </h2>

              <p>
                From Completed Payments
              </p>
            </article>

            <article className="summary-card">
              <div className="summary-icon completed">
                <FaCheckCircle />
              </div>

              <h3>
                Fully Funded Projects
              </h3>

              <h2>
                {completedProjectCount}
              </h2>

              <p>
                Funding Goal Reached
              </p>
            </article>
          </section>

          {/* =====================
              RECENT INVESTMENTS
          ===================== */}

          <section
            id="my-investments"
            className="dashboard-card recent-investments"
          >
            <div className="recent-header">
              <h2>
                Recent Investment
              </h2>

              <Link to="/investor/my-investments">
                View All →
              </Link>
            </div>

            {loading ? (
              <div
                style={{
                  padding:
                    "35px 20px",
                  textAlign:
                    "center",
                }}
              >
                Loading investments...
              </div>
            ) : recentInvestments.length >
              0 ? (
              <div className="investment-list">

                {recentInvestments.map(
                  (investment) => {
                    const progress =
                      Math.min(
                        100,
                        Math.max(
                          0,
                          Math.round(
                            Number(
                              investment
                                .funding_progress
                            ) || 0
                          )
                        )
                      );

                    const amount =
                      Number(
                        investment.amount
                      ) || 0;

                    const isCompleted =
                      investment.payment_status ===
                      "completed";

                    const statusLabel =
                      isCompleted
                        ? "Paid"
                        : investment.payment_status ===
                            "failed"
                          ? "Failed"
                          : "Pending";

                    return (
                      <article
                        className="investment-row"
                        key={
                          investment.id
                        }
                      >
                        <img
                          src={getProjectImage(
                            investment
                          )}
                          alt={
                            investment.title
                          }
                          className="investment-project-image"
                        />

                        <div className="investment-info">
                          <h3>
                            {
                              investment.title
                            }
                          </h3>

                          <p>
                            <FaMapMarkerAlt />
                            Bangladesh
                          </p>

                          <span>
                            <FaCalendarAlt />
                            Invested:{" "}
                            {formatDate(
                              investment.created_at
                            )}
                          </span>
                        </div>

                        <div className="investment-amount">
                          <small>
                            Invested
                          </small>

                          <strong>
                            ৳{" "}
                            {amount.toLocaleString()}
                          </strong>
                        </div>

                        <div className="investment-progress">
                          <div className="investment-progress-heading">
                            <small>
                              Project Funding
                            </small>

                            <span>
                              {progress}%
                            </span>
                          </div>

                          <div
                            className="progress-bar"
                            role="progressbar"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-valuenow={
                              progress
                            }
                          >
                            <div
                              className="progress-fill"
                              style={{
                                width:
                                  `${progress}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="investment-status">
                          <span
                            className="active-status"
                            style={{
                              color:
                                isCompleted
                                  ? undefined
                                  : investment
                                        .payment_status ===
                                      "failed"
                                    ? "#d92d20"
                                    : "#b7791f",
                            }}
                          >
                            {statusLabel}
                          </span>

                          <Link
                            to={`/projects/${investment.project_id}`}
                            className="investment-details-button"
                          >
                            View Details
                          </Link>
                        </div>
                      </article>
                    );
                  }
                )}

              </div>
            ) : (
              <div
                style={{
                  padding:
                    "40px 20px",
                  textAlign:
                    "center",
                }}
              >
                <p>
                  No investments found.
                </p>

                <Link to="/projects">
                  Browse Projects
                </Link>
              </div>
            )}
          </section>

          {/* =====================
              PROJECT UPDATES
              STILL STATIC
          ===================== */}

          <section className="dashboard-card updates-card">

            <div className="updates-header">
              <h2>
                Project Updates
              </h2>

              <a href="#project-updates">
                View All →
              </a>
            </div>

            <div
              className="updates-grid"
              id="project-updates"
            >
              {projectUpdates.map(
                (update) => (
                  <article
                    className="update-item"
                    key={update.id}
                  >
                    <div
                      className={`update-icon ${update.color}`}
                    >
                      {update.icon}
                    </div>

                    <div>
                      <h4>
                        {update.title}
                      </h4>

                      <p>
                        {
                          update.description
                        }
                      </p>

                      <span>
                        {update.time}
                      </span>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>

          {/* =====================
              BOTTOM SECTION
          ===================== */}

          <div className="dashboard-bottom">

            {/* PROFIT SUMMARY */}

            <section
              id="profit-report"
              className="dashboard-card profit-summary-card"
            >
              <div className="bottom-card-header">
                <h2>
                  Profit Summary
                </h2>

                <select aria-label="Profit report period">
                  <option>
                    This Month
                  </option>

                  <option>
                    Last Month
                  </option>

                  <option>
                    This Year
                  </option>
                </select>
              </div>

              <div className="profit-summary-content">

                <div className="profit-estimate-box">
                  <span>
                    Estimated Profit
                  </span>

                  <strong>
                    ৳{" "}
                    {estimatedProfit.toLocaleString()}
                  </strong>

                  <p>
                    Based on current
                    investments
                  </p>
                </div>

                <div className="profit-chart-area">

                  <div
                    className="profit-donut"
                    role="img"
                    aria-label="Estimated profit chart"
                  >
                    <div className="profit-donut-center">
                      <strong>
                        ৳{" "}
                        {estimatedProfit.toLocaleString()}
                      </strong>

                      <span>
                        Total
                      </span>
                    </div>
                  </div>

                  <div className="profit-legend">

                    <div>
                      <span className="legend-color boro" />

                      <p>
                        <strong>
                          Current
                          Investments
                        </strong>

                        <small>
                          {investedProjectCount}{" "}
                          Projects
                        </small>
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* =====================
                QUICK ACTIONS
            ===================== */}

            <section className="dashboard-card quick-actions-card">

              <div className="bottom-card-header">
                <h2>
                  Quick Actions
                </h2>
              </div>

              <div className="quick-actions-grid">

                <Link
                  to="/projects"
                  className="quick-action browse"
                >
                  <div className="quick-action-icon">
                    <FaSeedling />
                  </div>

                  <div>
                    <strong>
                      Browse Projects
                    </strong>

                    <span>
                      Find new projects
                      to invest
                    </span>
                  </div>

                  <FaArrowRight className="quick-action-arrow" />
                </Link>

                <Link
                  to="/investor/my-investments"
                  className="quick-action investments"
                >
                  <div className="quick-action-icon">
                    <FaWallet />
                  </div>

                  <div>
                    <strong>
                      My Investments
                    </strong>

                    <span>
                      View your
                      investments
                    </span>
                  </div>

                  <FaArrowRight className="quick-action-arrow" />
                </Link>

                <Link
                  to="/investor/profit-report"
                  className="quick-action reports"
                >
                  <div className="quick-action-icon">
                    <FaFileInvoiceDollar />
                  </div>

                  <div>
                    <strong>
                      Investment Reports
                    </strong>

                    <span>
                      See profit and
                      performance
                    </span>
                  </div>

                  <FaArrowRight className="quick-action-arrow" />
                </Link>

                <a
                  id="messages"
                  href="#messages"
                  className="quick-action messages"
                >
                  <div className="quick-action-icon">
                    <FaComments />
                  </div>

                  <div>
                    <strong>
                      Messages
                    </strong>

                    <span>
                      Contact the support
                      team
                    </span>
                  </div>

                  <FaArrowRight className="quick-action-arrow" />
                </a>

              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default InvestorDashboard;