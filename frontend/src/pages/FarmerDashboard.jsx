import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaThLarge,
  FaClipboardList,
  FaPlusCircle,
  FaFileAlt,
  FaChartLine,
  FaUsers,
  FaFolderOpen,
  FaEnvelope,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaSeedling,
  FaClock,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import FarmerTopbar from "../components/farmer/FarmerTopbar";

import logo from "../assets/images/logo.png";

import boroRice from "../assets/farmer-dashboard/boro-rice.png";
import tomato from "../assets/farmer-dashboard/tomato.png";
import chilli from "../assets/farmer-dashboard/chilli.png";

import "./FarmerDashboard.css";

const API_URL =
  "http://localhost:5000/api";

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
   MONEY FORMAT
========================= */

const formatMoney = (amount) => {
  return `৳ ${Number(
    amount || 0
  ).toLocaleString()}`;
};

/* =========================
   DATE FORMAT
========================= */

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "N/A";
  }

  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
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
   PROJECT IMAGE FALLBACK
========================= */

const getFallbackImage = (
  project
) => {
  const text = `${project.title || ""} ${
    project.crop_type || ""
  }`.toLowerCase();

  if (
    text.includes("tomato")
  ) {
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
   PROJECT STATUS
========================= */

const getProjectStatusLabel = (
  status
) => {
  if (status === "completed") {
    return "Completed";
  }

  if (status === "approved") {
    return "Active";
  }

  if (status === "pending") {
    return "Pending Review";
  }

  if (status === "rejected") {
    return "Rejected";
  }

  return status || "Unknown";
};

/* =========================
   FARMER DASHBOARD
========================= */

function FarmerDashboard() {
  const navigate =
    useNavigate();

  const [
    farmer,
    setFarmer,
  ] = useState(null);

  const [
    summary,
    setSummary,
  ] = useState({
    total_projects: 0,
    active_projects: 0,
    completed_projects: 0,
    pending_projects: 0,
    total_investors: 0,
    total_raised: 0,
    total_profit_share: 0,
  });

  const [
    projects,
    setProjects,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* =========================
     FETCH FARMER DASHBOARD
  ========================= */

  useEffect(() => {
    const fetchDashboard =
      async () => {
        try {
          setLoading(true);
          setError("");

          const token =
            getToken();

          if (!token) {
            throw new Error(
              "Please login as a farmer."
            );
          }

          const response =
            await fetch(
              `${API_URL}/farmer/dashboard`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response.json();

          if (
            response.status ===
              401 ||
            response.status ===
              403
          ) {
            throw new Error(
              data.message ||
                "Unauthorized access."
            );
          }

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to load farmer dashboard."
            );
          }

          setFarmer(
            data.farmer || null
          );

          setSummary(
            data.summary || {
              total_projects: 0,
              active_projects: 0,
              completed_projects: 0,
              pending_projects: 0,
              total_investors: 0,
              total_raised: 0,
              total_profit_share: 0,
            }
          );

          setProjects(
            Array.isArray(
              data.projects
            )
              ? data.projects
              : []
          );
        } catch (err) {
          console.error(
            "Farmer dashboard error:",
            err
          );

          setError(
            err.message ||
              "Could not load farmer dashboard."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboard();
  }, []);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    sessionStorage.removeItem(
      "token"
    );

    sessionStorage.removeItem(
      "user"
    );

    navigate("/");
  };

  /* =========================
     RECENT ACTIVITIES
     GENERATED FROM REAL PROJECTS
  ========================= */

  const activities =
    useMemo(() => {
      return projects
        .slice(0, 4)
        .map(
          (project, index) => {
            if (
              project.status ===
              "completed"
            ) {
              return {
                id: project.id,
                title:
                  "Project completed",
                description:
                  `${project.title} completed successfully`,
                time:
                  formatDate(
                    project.created_at
                  ),
                icon:
                  <FaCheckCircle />,
                color:
                  "purple",
              };
            }

            if (
              project.status ===
              "approved"
            ) {
              return {
                id: project.id,
                title:
                  "Project approved",
                description:
                  `${project.title} is live for investment`,
                time:
                  formatDate(
                    project.created_at
                  ),
                icon:
                  <FaClipboardList />,
                color:
                  "blue",
              };
            }

            if (
              project.status ===
              "pending"
            ) {
              return {
                id: project.id,
                title:
                  "Project under review",
                description:
                  `${project.title} is waiting for admin approval`,
                time:
                  formatDate(
                    project.created_at
                  ),
                icon:
                  <FaClock />,
                color:
                  "orange",
              };
            }

            return {
              id:
                `${project.id}-${index}`,
              title:
                "Project update",
              description:
                project.title,
              time:
                formatDate(
                  project.created_at
                ),
              icon:
                <FaFileAlt />,
              color:
                "green",
            };
          }
        );
    }, [projects]);

  /* =========================
     COMPLETED PROFIT
  ========================= */

  const completedProfit =
    useMemo(() => {
      return projects
        .filter(
          (project) =>
            project.status ===
            "completed"
        )
        .reduce(
          (
            total,
            project
          ) =>
            total +
            Number(
              project
                .farmer_profit_share
            ),
          0
        );
    }, [projects]);

  /* =========================
     PROJECT DISPLAY LIMIT
  ========================= */

  const visibleProjects =
    projects.slice(0, 4);

  return (
    <main className="farmer-dashboard-page">
      <div className="farmer-dashboard-container">

        {/* =========================
            SIDEBAR
        ========================= */}

        <aside className="farmer-dashboard-sidebar">

          <div>

            <div className="farmer-sidebar-logo">
              <img
                src={logo}
                alt="AgroInvest"
              />
            </div>

            <nav
              className="farmer-sidebar-menu"
              aria-label="Farmer navigation"
            >

              <Link
                to="/farmer/dashboard"
                className="active"
              >
                <FaThLarge />
                <span>
                  Dashboard
                </span>
              </Link>

              <a href="#my-projects">
                <FaClipboardList />
                <span>
                  My Projects
                </span>
              </a>

              <Link to="/farmer/create-project">
                <FaPlusCircle />
                <span>
                  Create New Projects
                </span>
              </Link>

              <a href="#applications">
                <FaFileAlt />
                <span>
                  Applications
                </span>
              </a>

              <Link to="/farmer/profit-report">
                <FaChartLine />
                <span>
                  Profit Reports
                </span>
              </Link>

              <a href="#investors">
                <FaUsers />
                <span>
                  Investors
                </span>
              </a>

              <a href="#documents">
                <FaFolderOpen />
                <span>
                  Documents
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

              <a href="#help">
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
                <FaQuestionCircle />
                <span>
                  Logout
                </span>
              </button>

            </nav>
          </div>

          <div className="farmer-help-card">
            <FaQuestionCircle />

            <h3>
              Need Help?
            </h3>

            <p>
              Our support team is here to help you.
            </p>

            <button type="button">
              Contact Support
            </button>
          </div>

        </aside>

        {/* =========================
            MAIN
        ========================= */}

        <section className="farmer-dashboard-main">

          <FarmerTopbar farmer={farmer} />

          {/* =========================
              WELCOME
          ========================= */}

          <section className="farmer-welcome">

            <h1>
              Welcome back, Farmer{" "}
              {farmer?.full_name ||
                "Farmer"}
              ! 🌱
            </h1>

            <p>
              Here&apos;s what&apos;s happening
              with your projects today.
            </p>

          </section>

          {/* =========================
              ERROR
          ========================= */}

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

          {/* =========================
              SUMMARY
          ========================= */}

          <section className="farmer-summary-grid">

            <article className="farmer-summary-card">

              <div className="farmer-summary-icon projects">
                <FaSeedling />
              </div>

              <h3>
                Total Projects
              </h3>

              <h2>
                {loading
                  ? "..."
                  : summary.total_projects}
              </h2>

              <p>
                {summary.active_projects} Active
                {" • "}
                {summary.completed_projects} Completed
              </p>

            </article>

            <article className="farmer-summary-card">

              <div className="farmer-summary-icon investors">
                <FaUsers />
              </div>

              <h3>
                Total Investors
              </h3>

              <h2>
                {loading
                  ? "..."
                  : summary.total_investors}
              </h2>

              <p>
                Across all projects
              </p>

            </article>

            <article className="farmer-summary-card">

              <div className="farmer-summary-icon raised">
                <FaMoneyBillWave />
              </div>

              <h3>
                Total Raised
              </h3>

              <h2>
                {loading
                  ? "..."
                  : formatMoney(
                      summary.total_raised
                    )}
              </h2>

              <p>
                From all projects
              </p>

            </article>

            <article className="farmer-summary-card">

              <div className="farmer-summary-icon profit">
                <FaChartLine />
              </div>

              <h3>
                Profit Share
              </h3>

              <h2>
                {loading
                  ? "..."
                  : formatMoney(
                      summary.total_profit_share
                    )}
              </h2>

              <p>
                From completed projects
              </p>

            </article>

          </section>

          <p className="farmer-summary-note">
            Note: Profit share is calculated after
            project completion and shown in reports.
          </p>

          {/* =========================
              MY PROJECTS
          ========================= */}

          <section
            id="my-projects"
            className="farmer-dashboard-card farmer-projects-card"
          >

            <div className="farmer-section-header">

              <h2>
                My Projects Overview
              </h2>

              <a href="#my-projects">
                View All Projects
                <FaArrowRight />
              </a>

            </div>

            {loading ? (
              <div
                style={{
                  padding:
                    "40px 20px",
                  textAlign:
                    "center",
                }}
              >
                Loading projects...
              </div>
            ) : visibleProjects.length >
              0 ? (
              <div className="farmer-project-list">

                {visibleProjects.map(
                  (project) => {
                    const progress =
                      Math.min(
                        100,
                        Math.max(
                          0,
                          Math.round(
                            Number(
                              project
                                .funding_progress
                            ) || 0
                          )
                        )
                      );

                    const statusLabel =
                      getProjectStatusLabel(
                        project.status
                      );

                    const image =
                      project.land_image_url ||
                      getFallbackImage(
                        project
                      );

                    return (
                      <article
                        className="farmer-project-row"
                        key={
                          project.id
                        }
                      >

                        <img
                          src={image}
                          alt={
                            project.title
                          }
                          className="farmer-project-image"
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              getFallbackImage(
                                project
                              );
                          }}
                        />

                        <div className="farmer-project-info">

                          <div className="farmer-project-title-row">

                            <h3>
                              {
                                project.title
                              }
                            </h3>

                            <span
                              className={`farmer-project-status ${
                                project.status ===
                                "pending"
                                  ? "pending"
                                  : "active"
                              }`}
                              style={
                                project.status ===
                                "completed"
                                  ? {
                                      background:
                                        "#dcfce7",
                                      color:
                                        "#15803d",
                                    }
                                  : project.status ===
                                      "rejected"
                                    ? {
                                        background:
                                          "#fee2e2",
                                        color:
                                          "#b42318",
                                      }
                                    : {}
                              }
                            >
                              {
                                statusLabel
                              }
                            </span>

                          </div>

                          <p>
                            <FaMapMarkerAlt />
                            Bangladesh
                          </p>

                          <span>
                            <FaCalendarAlt />

                            Created:{" "}
                            {formatDate(
                              project.created_at
                            )}

                            {" • "}

                            Deadline:{" "}
                            {formatDate(
                              project.deadline
                            )}
                          </span>

                        </div>

                        <div className="farmer-project-raised">

                          <small>
                            Raised
                          </small>

                          <strong>
                            {formatMoney(
                              project.total_raised
                            )}
                            {" / "}
                            {formatMoney(
                              project.target_amount
                            )}
                          </strong>

                          <div className="farmer-project-progress">
                            <div
                              style={{
                                width:
                                  `${progress}%`,
                              }}
                            />
                          </div>

                          <span>
                            {progress}%
                          </span>

                        </div>

                        <div className="farmer-project-investors">

                          <small>
                            Investors
                          </small>

                          <strong>
                            <FaUsers />

                            {
                              project.total_investors
                            }
                          </strong>

                          <Link
                            to={`/projects/${project.id}`}
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
                    "45px 20px",
                  textAlign:
                    "center",
                }}
              >
                <p>
                  No projects found.
                </p>

                <Link to="/farmer/create-project">
                  Create your first project
                </Link>
              </div>
            )}

          </section>

          {/* =========================
              RECENT ACTIVITIES
          ========================= */}

          <section className="farmer-dashboard-card farmer-activities-card">

            <div className="farmer-section-header">
              <h2>
                Recent Activities
              </h2>
            </div>

            {activities.length >
            0 ? (
              <div className="farmer-activities-grid">

                {activities.map(
                  (activity) => (
                    <article
                      className="farmer-activity-item"
                      key={
                        activity.id
                      }
                    >

                      <div
                        className={`farmer-activity-icon ${activity.color}`}
                      >
                        {
                          activity.icon
                        }
                      </div>

                      <div>

                        <h4>
                          {
                            activity.title
                          }
                        </h4>

                        <p>
                          {
                            activity.description
                          }
                        </p>

                        <span>
                          {
                            activity.time
                          }
                        </span>

                      </div>

                    </article>
                  )
                )}

              </div>
            ) : (
              <div
                style={{
                  padding:
                    "30px 20px",
                  textAlign:
                    "center",
                }}
              >
                No recent activities.
              </div>
            )}

          </section>

          {/* =========================
              BOTTOM
          ========================= */}

          <div className="farmer-bottom-grid">

            {/* PROFIT */}

            <section className="farmer-dashboard-card farmer-profit-card">

              <div className="farmer-section-header">

                <h2>
                  Profit Summary
                </h2>

                <select aria-label="Profit period">
                  <option>
                    All Projects
                  </option>
                </select>

              </div>

              <div className="farmer-profit-summary">

                <div>
                  <span>
                    Total Profit Share
                  </span>

                  <strong>
                    {formatMoney(
                      summary.total_profit_share
                    )}
                  </strong>

                  <small>
                    From Completed Projects
                  </small>
                </div>

                <div>
                  <span>
                    Completed Projects
                  </span>

                  <strong>
                    {
                      summary.completed_projects
                    }
                  </strong>

                  <small>
                    Profit reports available
                  </small>
                </div>

                <div>
                  <span>
                    Total Raised
                  </span>

                  <strong>
                    {formatMoney(
                      summary.total_raised
                    )}
                  </strong>

                  <small>
                    Across all projects
                  </small>
                </div>

              </div>

              <p className="farmer-profit-note">
                Actual farmer share is 70% of net
                profit after a project is completed.
              </p>

              {summary.completed_projects >
                0 && (
                <div
                  style={{
                    marginTop:
                      "14px",
                  }}
                >
                  <Link
                    to="/farmer/profit-report"
                    style={{
                      color:
                        "#159447",
                      fontWeight:
                        "600",
                    }}
                  >
                    View Profit Report →
                  </Link>
                </div>
              )}

            </section>

            {/* PROFILE */}

            <section className="farmer-dashboard-card farmer-profile-card">

              <h2>
                Farmer Account
              </h2>

              <p>
                Verification Status:
              </p>

              <strong
                style={{
                  display:
                    "block",
                  margin:
                    "10px 0 18px",
                  color:
                    farmer?.verification_status ===
                    "approved"
                      ? "#159447"
                      : "#b7791f",
                }}
              >
                {farmer?.verification_status
                  ? farmer.verification_status
                      .charAt(0)
                      .toUpperCase() +
                    farmer.verification_status.slice(
                      1
                    )
                  : "Unknown"}
              </strong>

              <div className="farmer-profile-progress">
                <div
                  style={{
                    width:
                      farmer?.verification_status ===
                      "approved"
                        ? "100%"
                        : "50%",
                  }}
                />
              </div>

              <span>
                {farmer?.verification_status ===
                "approved"
                  ? "100%"
                  : "50%"}
              </span>

            </section>

          </div>

        </section>
      </div>
    </main>
  );
}

export default FarmerDashboard;