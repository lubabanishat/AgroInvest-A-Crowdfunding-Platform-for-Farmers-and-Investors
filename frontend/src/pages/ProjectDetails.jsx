import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaCheck,
  FaCheckCircle,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import farmer from "../assets/project-details/farmer.png";
import location from "../assets/project-details/location.png";
import descriptionIcon from "../assets/project-details/description.png";
import landSize from "../assets/project-details/land-size.png";
import duration from "../assets/project-details/duration.png";
import harvest from "../assets/project-details/harvest.png";
import method from "../assets/project-details/method.png";
import timeline from "../assets/project-details/timeline.png";
import landDocument from "../assets/project-details/land document.png";
import nid from "../assets/project-details/NID.png";

import "./ProjectDetails.css";

const API_URL = "https://agroinvest-backend-q6hl.onrender.com/api";
const BACKEND_URL = "https://agroinvest-backend-q6hl.onrender.com";

/* =========================
   STATIC UI INFORMATION
========================= */

const projectFacts = [
  {
    id: 1,
    icon: landSize,
    label: "Land Size",
    value: "5 Acres",
  },
  {
    id: 2,
    icon: duration,
    label: "Cultivation Duration",
    value: "4 Months",
  },
  {
    id: 3,
    icon: harvest,
    label: "Expected Harvest",
    value: "After Project Completion",
  },
  {
    id: 4,
    icon: method,
    label: "Farming Method",
    value: "Traditional",
  },
];

/* =========================
   PROJECT IMAGE
========================= */

const getProjectImageUrl = (project) => {
  if (!project?.land_image) {
    return "";
  }

  const normalizedPath =
    project.land_image.replace(/\\/g, "/");

  return `${BACKEND_URL}/${normalizedPath}`;
};

/* =========================
   PROJECT DETAILS
========================= */

function ProjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [fundingSummary, setFundingSummary] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH PROJECT + SUMMARY
  ========================= */

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError("");

        const projectResponse = await fetch(
          `${API_URL}/projects/${id}`
        );

        const projectData =
          await projectResponse.json();

        if (!projectResponse.ok) {
          throw new Error(
            projectData.message ||
              "Failed to load project."
          );
        }

        setProject(projectData.project);

        const summaryResponse = await fetch(
          `${API_URL}/investments/summary/${id}`
        );

        const summaryData =
          await summaryResponse.json();

        if (summaryResponse.ok) {
          setFundingSummary(
            summaryData.summary
          );
        } else {
          console.error(
            "Funding summary error:",
            summaryData
          );

          setFundingSummary(null);
        }
      } catch (err) {
        console.error(
          "Project details fetch error:",
          err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  /* =========================
     INVEST
  ========================= */

  const handleInvest = () => {
    if (!project) return;

    if (project.status === "completed") {
      return;
    }

    navigate(`/payment/${project.id}`);
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="details-page">
          <div className="details-container">
            <Link
              to="/projects"
              className="details-back-link"
            >
              ← Back to All Projects
            </Link>

            <div
              style={{
                padding: "80px 20px",
                textAlign: "center",
              }}
            >
              Loading project details...
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error || !project) {
    return (
      <>
        <Navbar />

        <main className="details-page">
          <div className="details-container">
            <Link
              to="/projects"
              className="details-back-link"
            >
              ← Back to All Projects
            </Link>

            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                color: "#b42318",
                textAlign: "center",
                backgroundColor: "#fee4e2",
                borderRadius: "8px",
              }}
            >
              {error || "Project not found."}
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* =========================
     PROJECT STATUS
  ========================= */

  const isCompleted =
    project.status === "completed";

  /* =========================
     FUNDING VALUES
  ========================= */

  const fundingGoal =
    Number(
      fundingSummary?.target_amount ??
        project.target_amount
    ) || 0;

  const raisedAmount =
    Number(
      fundingSummary?.collected_amount
    ) || 0;

  const remainingAmount =
    fundingSummary
      ? Math.max(
          Number(
            fundingSummary.remaining_amount
          ) || 0,
          0
        )
      : Math.max(
          fundingGoal - raisedAmount,
          0
        );

  const fundingPercentage =
    fundingSummary
      ? Math.min(
          Number(
            fundingSummary.funding_progress
          ) || 0,
          100
        )
      : fundingGoal > 0
        ? Math.min(
            Math.round(
              (raisedAmount / fundingGoal) *
                100
            ),
            100
          )
        : 0;

  /* =========================
     DAYS LEFT
  ========================= */

  const calculateDaysLeft = () => {
    if (!project.deadline) {
      return 0;
    }

    const today = new Date();
    const deadline =
      new Date(project.deadline);

    const difference =
      deadline.getTime() -
      today.getTime();

    const days = Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );

    return Math.max(days, 0);
  };

  const daysLeft = calculateDaysLeft();

  const projectImageUrl =
    getProjectImageUrl(project);

  /* =========================
     DYNAMIC TIMELINE
  ========================= */

  const timelineItems = [
    {
      id: 1,
      title: "Project Created",
      date: "Project submitted by farmer",
      completed: true,
    },
    {
      id: 2,
      title: "Admin Verification",
      date: "Project approved by admin",
      completed: true,
    },
    {
      id: 3,
      title: "Funding",
      date: isCompleted
        ? `${fundingPercentage}% funding collected`
        : "Investment collection in progress",
      completed:
        isCompleted ||
        fundingPercentage >= 70,
    },
    {
      id: 4,
      title: "Cultivation",
      date: isCompleted
        ? "Cultivation completed"
        : fundingPercentage >= 70
          ? "Cultivation can begin"
          : "Starts after minimum 70% funding",
      completed: isCompleted,
    },
    {
      id: 5,
      title: "Harvest & Profit",
      date: isCompleted
        ? "Project completed and profit calculated"
        : "After cultivation is completed",
      completed: isCompleted,
    },
  ];

  return (
    <>
      <Navbar />

      <main className="details-page">
        <div className="details-container">

          <Link
            to="/projects"
            className="details-back-link"
          >
            ← Back to All Projects
          </Link>

          <div className="details-main-layout">

            {/* =====================
                LEFT COLUMN
            ===================== */}

            <div className="details-left-column">

              {/* PROJECT OVERVIEW */}

              <section className="details-overview-card">

                {projectImageUrl ? (
                  <img
                    src={projectImageUrl}
                    alt={project.title}
                    className="details-project-image"
                  />
                ) : (
                  <div
                    className="details-project-image"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#eef5ee",
                      color: "#777777",
                    }}
                  >
                    No Project Image
                  </div>
                )}

                <div className="details-project-info">

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <h1>{project.title}</h1>

                    {isCompleted && (
                      <span
                        style={{
                          backgroundColor: "#dcfce7",
                          color: "#15803d",
                          border:
                            "1px solid #86efac",
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        ✓ Completed
                      </span>
                    )}
                  </div>

                  <div className="details-location">
                    <img
                      src={location}
                      alt=""
                      aria-hidden="true"
                    />

                    <span>Bangladesh</span>
                  </div>

                  <div
                    className="details-tags"
                    aria-label="Project categories"
                  >
                    <span>
                      {project.crop_type}
                    </span>

                    <span>
                      Crop Farming
                    </span>

                    <span>
                      Outdoor
                    </span>
                  </div>

                  <article className="details-farmer-card">

                    <img
                      src={farmer}
                      alt={project.farmer_name}
                      className="details-farmer-image"
                    />

                    <div>
                      <p>Verified Farmer</p>

                      <h2>
                        {project.farmer_name}
                      </h2>

                      <div className="details-rating">
                        <span>
                          ★ Verified
                        </span>
                      </div>
                    </div>

                    <FaCheckCircle
                      className="details-verified-icon"
                      aria-label="Verified farmer"
                    />
                  </article>
                </div>
              </section>

              {/* DESCRIPTION */}

              <section className="details-card details-description-card">

                <div className="details-section-title">
                  <img
                    src={descriptionIcon}
                    alt=""
                    aria-hidden="true"
                  />

                  <h2>
                    Project Description
                  </h2>
                </div>

                <p className="details-description">
                  {project.description ||
                    "No project description available."}
                </p>

                <div className="details-facts-grid">
                  {projectFacts.map(
                    (fact) => (
                      <article
                        className="details-fact-card"
                        key={fact.id}
                      >
                        <img
                          src={fact.icon}
                          alt=""
                          aria-hidden="true"
                        />

                        <span>
                          {fact.label}
                        </span>

                        <strong>
                          {fact.value}
                        </strong>
                      </article>
                    )
                  )}
                </div>
              </section>

              {/* TIMELINE */}

              <section className="details-card details-timeline-card">

                <div className="details-section-title">
                  <img
                    src={timeline}
                    alt=""
                    aria-hidden="true"
                  />

                  <h2>
                    Project Timeline
                  </h2>
                </div>

                <ol className="details-timeline">
                  {timelineItems.map(
                    (item) => (
                      <li
                        key={item.id}
                        className={
                          item.completed
                            ? "completed"
                            : ""
                        }
                      >
                        <div className="details-timeline-dot">
                          {item.completed && (
                            <FaCheck
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        <div className="details-timeline-text">
                          <strong>
                            {item.title}
                          </strong>

                          <span>
                            {item.date}
                          </span>
                        </div>
                      </li>
                    )
                  )}
                </ol>
              </section>

              {/* DOCUMENTS */}

              <section className="details-card details-documents-card">

                <h2>
                  Documents{" "}
                  <span>
                    (Verified by Admin)
                  </span>
                </h2>

                <article className="details-document-row">
                  <div>
                    <img
                      src={nid}
                      alt=""
                      aria-hidden="true"
                    />

                    <span>
                      NID Verified
                    </span>
                  </div>

                  <span className="details-document-status">
                    <FaCheckCircle />
                    Verified
                  </span>
                </article>

                <article className="details-document-row">
                  <div>
                    <img
                      src={landDocument}
                      alt=""
                      aria-hidden="true"
                    />

                    <span>
                      Land Document Verified
                    </span>
                  </div>

                  <span className="details-document-status">
                    <FaCheckCircle />
                    Verified
                  </span>
                </article>

              </section>
            </div>

            {/* =====================
                RIGHT COLUMN
            ===================== */}

            <aside className="details-right-column">

              {/* FUNDING */}

              <section className="details-card details-funding-card">

                <h2>Funding Progress</h2>

                <div className="details-info-row">
                  <span>Funding Goal</span>

                  <strong>
                    ৳ {fundingGoal.toLocaleString()}
                  </strong>
                </div>

                <div className="details-info-row">
                  <span>Raised Amount</span>

                  <strong>
                    ৳ {raisedAmount.toLocaleString()}
                  </strong>
                </div>

                <div className="details-info-row">

                  <span>
                    {isCompleted
                      ? "Project Status"
                      : "Remaining Amount"}
                  </span>

                  <strong
                    style={
                      isCompleted
                        ? {
                            color: "#169447",
                          }
                        : {}
                    }
                  >
                    {isCompleted
                      ? "Completed"
                      : `৳ ${remainingAmount.toLocaleString()}`}
                  </strong>

                </div>

                <div
                  className="details-progress"
                  role="progressbar"
                  aria-label="Funding progress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={
                    fundingPercentage
                  }
                >
                  <div
                    className="details-progress-value"
                    style={{
                      width: `${fundingPercentage}%`,
                    }}
                  />
                </div>

                <div className="details-progress-footer">

                  <span
                    style={
                      isCompleted
                        ? {
                            color: "#169447",
                            fontWeight: "600",
                          }
                        : {}
                    }
                  >
                    {isCompleted
                      ? "Project Completed"
                      : `${daysLeft} Days Left`}
                  </span>

                  <strong>
                    {fundingPercentage}%
                  </strong>

                </div>

              </section>

              {/* =====================
                  INVESTMENT INFORMATION
                  ONLY ACTIVE PROJECT
              ===================== */}

              {!isCompleted && (
                <section className="details-card details-investment-card">

                  <h2>
                    Investment Information
                  </h2>

                  <div className="details-info-row">
                    <span>
                      Expected Profit
                    </span>

                    <strong>15%</strong>
                  </div>

                  <div className="details-info-row">
                    <span>
                      Minimum Investment
                    </span>

                    <strong>
                      ৳ 1,000
                    </strong>
                  </div>

                  <div className="details-info-row">
                    <span>
                      Maximum Investment
                    </span>

                    <strong>
                      ৳ {remainingAmount.toLocaleString()}
                    </strong>
                  </div>

                </section>
              )}

              {/* COMPLETED PROJECT INFORMATION */}

              {isCompleted && (
                <section
                  className="details-card details-investment-card"
                  style={{
                    backgroundColor:
                      "#effaf2",
                  }}
                >
                  <h2>
                    Project Completed
                  </h2>

                  <div className="details-info-row">
                    <span>
                      Final Funding
                    </span>

                    <strong>
                      {fundingPercentage}%
                    </strong>
                  </div>

                  <div className="details-info-row">
                    <span>
                      Total Raised
                    </span>

                    <strong>
                      ৳ {raisedAmount.toLocaleString()}
                    </strong>
                  </div>

                  <div className="details-info-row">
                    <span>
                      Investment Status
                    </span>

                    <strong
                      style={{
                        color: "#169447",
                      }}
                    >
                      Closed
                    </strong>
                  </div>
                </section>
              )}

              {/* BENEFITS */}

              <section className="details-card details-benefits-card">

                <h2>
                  {isCompleted
                    ? "Project Highlights"
                    : "Why Invest in This Project?"}
                </h2>

                <ul>
                  <li>
                    Verified farmer and land
                  </li>

                  <li>
                    Verified project
                  </li>

                  <li>
                    Transparent funding
                  </li>

                  <li>
                    Investment tracking
                  </li>
                </ul>

              </section>

              {/* SHARE */}

              <section className="details-card details-share-card">

                <h2>Share Project</h2>

                <div className="details-share-icons">

                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebookF />
                  </a>

                  <a
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedinIn />
                  </a>

                  <a
                    href="https://www.whatsapp.com/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp />
                  </a>

                </div>

              </section>
            </aside>
          </div>

          {/* =====================
              BOTTOM CTA
          ===================== */}

          {isCompleted ? (
            <section
              className="details-investment-cta"
              style={{
                backgroundColor: "#effaf2",
              }}
            >
              <div>
                <strong>
                  ✓ Project Completed
                </strong>

                <p>
                  This project has been completed
                  successfully and is no longer
                  accepting new investments.
                </p>
              </div>

              <button
                type="button"
                disabled
                style={{
                  cursor: "not-allowed",
                  opacity: "0.6",
                }}
              >
                Investment Closed
              </button>
            </section>
          ) : (
            <section className="details-investment-cta">

              <div>
                <strong>
                  Interested in this Project?
                </strong>

                <p>
                  Invest now and be a part of this
                  successful farming journey.
                </p>
              </div>

              <button
                type="button"
                onClick={handleInvest}
              >
                Invest Now →
              </button>

            </section>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProjectDetails;