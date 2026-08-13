import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import "./Projects.css";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import heroBg from "../assets/projects/hero-bg.png";

import rice from "../assets/projects/rice.png";
import mango from "../assets/projects/mango.png";
import vegetable from "../assets/projects/vegetable.png";
import chilli from "../assets/projects/chilli.png";
import tomato from "../assets/projects/tomato.png";
import boroRice from "../assets/projects/boro-rice.png";

import searchIcon from "../assets/projects/search-icon.png";
import filterIcon from "../assets/projects/filter-icon.png";
import locationIcon from "../assets/projects/location-icon.png";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Location");
  const [status, setStatus] = useState("All Status");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     PROJECT IMAGE
  ========================= */

  const getProjectImage = (project) => {
    const text = `${project.title || ""} ${
      project.crop_type || ""
    }`.toLowerCase();

    if (text.includes("boro")) return boroRice;
    if (text.includes("mango")) return mango;
    if (text.includes("tomato")) return tomato;

    if (
      text.includes("chilli") ||
      text.includes("chili")
    ) {
      return chilli;
    }

    if (text.includes("vegetable")) {
      return vegetable;
    }

    if (text.includes("rice")) {
      return rice;
    }

    return vegetable;
  };

  /* =========================
     FETCH PROJECTS +
     FUNDING SUMMARY
  ========================= */

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError("");

      try {
        // Get approved/completed projects
        const response = await fetch(
          "https://agroinvest-backend-q6hl.onrender.com/api/projects"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load projects."
          );
        }

        const projectList = Array.isArray(data.projects)
          ? data.projects
          : [];

        // Get funding summary for every project
        const projectsWithFunding = await Promise.all(
          projectList.map(async (project) => {
            try {
              const summaryResponse = await fetch(
                `https://agroinvest-backend-q6hl.onrender.com/api/investments/summary/${project.id}`
              );

              const summaryData =
                await summaryResponse.json();

              if (
                summaryResponse.ok &&
                summaryData.summary
              ) {
                return {
                  ...project,

                  raised_amount:
                    Number(
                      summaryData.summary.collected_amount
                    ) || 0,

                  remaining_amount:
                    Number(
                      summaryData.summary.remaining_amount
                    ) || 0,

                  funding_progress:
                    Number(
                      summaryData.summary.funding_progress
                    ) || 0,

                  total_investments:
                    Number(
                      summaryData.summary.total_investments
                    ) || 0,

                  total_investors:
                    Number(
                      summaryData.summary.total_investors
                    ) || 0,
                };
              }

              return {
                ...project,
                raised_amount: 0,
                remaining_amount: 0,
                funding_progress: 0,
                total_investments: 0,
                total_investors: 0,
              };
            } catch (summaryError) {
              console.error(
                `Funding summary error for project ${project.id}:`,
                summaryError
              );

              return {
                ...project,
                raised_amount: 0,
                remaining_amount: 0,
                funding_progress: 0,
                total_investments: 0,
                total_investors: 0,
              };
            }
          })
        );

        setProjects(projectsWithFunding);
      } catch (error) {
        console.error(
          "Fetch projects error:",
          error
        );

        setError(
          error.message || "Could not load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* =========================
     FUNDING PERCENTAGE
  ========================= */

  const getFundingPercentage = (project) => {
    if (
      project.funding_progress !== undefined &&
      project.funding_progress !== null
    ) {
      return Math.min(
        100,
        Math.max(
          0,
          Math.round(
            Number(project.funding_progress) || 0
          )
        )
      );
    }

    const targetAmount =
      Number(project.target_amount) || 0;

    const raisedAmount =
      Number(project.raised_amount) || 0;

    if (targetAmount <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(
        0,
        Math.round(
          (raisedAmount / targetAmount) * 100
        )
      )
    );
  };

  /* =========================
     FILTER PROJECTS
  ========================= */

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const title =
        project.title?.toLowerCase() || "";

      const cropType =
        project.crop_type?.toLowerCase() || "";

      const projectLocation = (
        project.location ||
        project.farmer_location ||
        ""
      ).toLowerCase();

      const projectStatus =
        project.status?.toLowerCase() || "";

      const search =
        searchText.toLowerCase().trim();

      const matchesSearch =
        !search ||
        title.includes(search) ||
        cropType.includes(search) ||
        projectLocation.includes(search);

      const matchesCategory =
        category === "All Categories" ||
        title.includes(category.toLowerCase()) ||
        cropType.includes(category.toLowerCase());

      const matchesLocation =
        location === "All Location" ||
        projectLocation.includes(
          location.toLowerCase()
        );

      const matchesStatus =
        status === "All Status" ||
        projectStatus === status.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesStatus
      );
    });
  }, [
    projects,
    searchText,
    category,
    location,
    status,
  ]);

  return (
    <>
      <Navbar />

      {/* =========================
          HERO SECTION
      ========================= */}

      <section
        className="projects-hero"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
        aria-labelledby="projects-page-title"
      >
        <div className="projects-hero-overlay" />

        <div className="projects-hero-content">
          <h1 id="projects-page-title">
            Explore Farming Projects
          </h1>

          <p>
            Explore verified agricultural projects and
            invest in a better future.
          </p>
        </div>
      </section>

      {/* =========================
          FILTER SECTION
      ========================= */}

      <section className="projects-filter">
        <div className="projects-filter-container">

          <div className="projects-search">
            <input
              type="text"
              placeholder="Search projects by crop, location..."
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
            />

            <img
              src={searchIcon}
              alt="Search"
            />
          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            <option>All Categories</option>
            <option>Rice</option>
            <option>Vegetable</option>
            <option>Mango</option>
            <option>Tomato</option>
            <option>Chilli</option>
          </select>

          <select
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
          >
            <option>All Location</option>
            <option>Dhaka</option>
            <option>Rajshahi</option>
            <option>Khulna</option>
            <option>Gazipur</option>
            <option>Jessore</option>
            <option>Narsingdi</option>
            <option>Kishoreganj</option>
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option>All Status</option>

            <option value="approved">
              Approved
            </option>

            <option value="open">
              Open
            </option>

            <option value="funded">
              Funded
            </option>

            <option value="completed">
              Completed
            </option>
          </select>

          <button
            type="button"
            className="projects-filter-btn"
          >
            <img
              src={filterIcon}
              alt=""
              aria-hidden="true"
            />

            Filter
          </button>
        </div>
      </section>

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Loading projects...
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (
        <div
          style={{
            maxWidth: "800px",
            margin: "35px auto",
            padding: "14px",
            color: "#b42318",
            textAlign: "center",
            fontFamily: "Poppins, sans-serif",
            backgroundColor: "#fee4e2",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {/* =========================
          PROJECT LIST
      ========================= */}

      {!loading && !error && (
        <section className="projects-list">

          {filteredProjects.length > 0 ? (
            <div className="projects-grid">

              {filteredProjects.map((project) => {
                const funded =
                  getFundingPercentage(project);

                const projectLocation =
                  project.location ||
                  project.farmer_location ||
                  "Bangladesh";

                const isCompleted =
                  project.status?.toLowerCase() ===
                  "completed";

                return (
                  <article
                    className={`project-card ${
                      isCompleted
                        ? "project-card-completed"
                        : ""
                    }`}
                    key={project.id}
                  >
                    <div className="project-card-top">

                      <img
                        src={getProjectImage(project)}
                        alt={project.title}
                        className="project-card-image"
                      />

                      <div className="project-card-content">

                        <div className="project-title-row">
                          <h2>
                            {project.title}
                          </h2>

                          {isCompleted && (
                            <span className="project-completed-badge">
                              Completed
                            </span>
                          )}
                        </div>

                        <p className="project-location">
                          <img
                            src={locationIcon}
                            alt=""
                            aria-hidden="true"
                          />

                          {projectLocation}
                        </p>

                        {/* Progress Bar */}

                        <div
                          className="project-progress"
                          role="progressbar"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow={funded}
                          aria-label={`${project.title} funding progress`}
                        >
                          <div
                            className="project-progress-value"
                            style={{
                              width: `${funded}%`,
                            }}
                          />
                        </div>

                        <div className="project-funded-status">

                          <p className="project-funded">
                            {funded}% Funded
                          </p>

                          {isCompleted && (
                            <span className="project-status-text">
                              Project Completed
                            </span>
                          )}

                        </div>

                      </div>
                    </div>

                    <Link
                      to={`/projects/${project.id}`}
                      className="project-details-btn"
                    >
                      View Details
                    </Link>

                  </article>
                );
              })}

            </div>
          ) : (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                fontFamily:
                  "Poppins, sans-serif",
              }}
            >
              <h3>
                No projects found.
              </h3>

              <p>
                New projects will appear here after
                admin approval.
              </p>
            </div>
          )}

        </section>
      )}

      {/* =========================
          PAGINATION
      ========================= */}

      {!loading &&
        !error &&
        filteredProjects.length > 0 && (
          <div className="projects-pagination">

            <button className="active">
              1
            </button>

            <button>2</button>

            <button>3</button>

            <button>&gt;</button>

          </div>
        )}

      <Footer />
    </>
  );
}

export default Projects;