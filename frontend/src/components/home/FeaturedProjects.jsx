import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import vegetableImg from "../../assets/home-page/vegetable.png";
import mangoImg from "../../assets/home-page/mango.png";
import riceImg from "../../assets/home-page/rice.png";

import "./FeaturedProjects.css";

const API_URL =
  "http://localhost:5000/api";

const BACKEND_URL =
  "http://localhost:5000";


/* =========================
   FALLBACK IMAGE
========================= */

const getFallbackImage = (project) => {
  const text = `${project.title || ""} ${
    project.crop_type || ""
  }`.toLowerCase();

  if (text.includes("mango")) {
    return mangoImg;
  }

  if (text.includes("rice")) {
    return riceImg;
  }

  return vegetableImg;
};


/* =========================
   REAL PROJECT IMAGE
========================= */

const getProjectImage = (project) => {
  if (!project.land_image) {
    return getFallbackImage(project);
  }

  const normalizedPath =
    project.land_image.replace(/\\/g, "/");

  return `${BACKEND_URL}/${normalizedPath}`;
};


/* =========================
   FEATURED PROJECTS
========================= */

function FeaturedProjects() {
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
     FETCH REAL PROJECTS
  ========================= */

  useEffect(() => {
    const fetchFeaturedProjects =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_URL}/projects`
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to load projects."
            );
          }

          const allProjects =
            Array.isArray(
              data.projects
            )
              ? data.projects
              : [];

          /* =========================
             ONLY ACTIVE / APPROVED
          ========================= */

          const approvedProjects =
            allProjects
              .filter(
                (project) =>
                  project.status ===
                  "approved"
              )
              .slice(0, 3);


          /* =========================
             GET FUNDING SUMMARY
          ========================= */

          const projectsWithFunding =
            await Promise.all(
              approvedProjects.map(
                async (project) => {
                  try {
                    const summaryResponse =
                      await fetch(
                        `${API_URL}/investments/summary/${project.id}`
                      );

                    const summaryData =
                      await summaryResponse.json();

                    if (
                      summaryResponse.ok &&
                      summaryData.summary
                    ) {
                      return {
                        ...project,

                        funded:
                          Math.min(
                            100,
                            Math.max(
                              0,
                              Math.round(
                                Number(
                                  summaryData
                                    .summary
                                    .funding_progress
                                ) || 0
                              )
                            )
                          ),
                      };
                    }

                    return {
                      ...project,
                      funded: 0,
                    };
                  } catch (
                    summaryError
                  ) {
                    console.error(
                      `Funding summary error for project ${project.id}:`,
                      summaryError
                    );

                    return {
                      ...project,
                      funded: 0,
                    };
                  }
                }
              )
            );

          setProjects(
            projectsWithFunding
          );
        } catch (err) {
          console.error(
            "Featured projects error:",
            err
          );

          setError(
            err.message ||
              "Could not load featured projects."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchFeaturedProjects();
  }, []);


  return (
    <section
      id="projects"
      className="featured-projects-section"
      aria-labelledby="featured-projects-heading"
    >
      <div className="featured-projects-container">

        {/* =========================
            HEADING
        ========================= */}

        <div className="featured-projects-heading">

          <h2 id="featured-projects-heading">
            Featured Farming Projects
          </h2>

          <p>
            Explore our latest verified farming
            projects and choose one to invest in.
          </p>

        </div>


        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
            }}
          >
            Loading featured projects...
          </div>
        )}


        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (
          <div
            style={{
              padding: "14px 16px",
              margin: "20px auto",
              maxWidth: "700px",
              color: "#b42318",
              backgroundColor: "#fee4e2",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}


        {/* =========================
            PROJECTS
        ========================= */}

        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="featured-projects-grid">

              {projects.map(
                (project) => (
                  <article
                    key={project.id}
                    className="project-card"
                  >

                    <div className="project-card-top">

                      <div className="project-image-wrapper">

                        <img
                          src={
                            getProjectImage(
                              project
                            )
                          }
                          alt={
                            project.title
                          }
                          className="project-image"
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              getFallbackImage(
                                project
                              );
                          }}
                        />

                      </div>


                      <div className="project-information">

                        <h3>
                          {project.title}
                        </h3>


                        <p className="project-location">

                          <span className="location-dot" />

                          Bangladesh

                        </p>


                        <div
                          className="project-progress"
                          role="progressbar"
                          aria-label={`${project.title} funding progress`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow={
                            project.funded
                          }
                        >

                          <div
                            className="project-progress-fill"
                            style={{
                              width:
                                `${project.funded}%`,
                            }}
                          />

                        </div>


                        <p className="project-funded">
                          {project.funded}% Funded
                        </p>

                      </div>

                    </div>


                    <Link
                      to={`/projects/${project.id}`}
                      className="view-btn"
                    >
                      View Details
                    </Link>

                  </article>
                )
              )}

            </div>
          )}


        {/* =========================
            NO PROJECTS
        ========================= */}

        {!loading &&
          !error &&
          projects.length === 0 && (
            <div
              style={{
                padding: "45px 20px",
                textAlign: "center",
              }}
            >
              <h3>
                No active projects available.
              </h3>

              <p>
                New verified projects will appear
                here after admin approval.
              </p>
            </div>
          )}


        {/* =========================
            SEE ALL
        ========================= */}

        {!loading &&
          !error &&
          projects.length > 0 && (
            <div
              style={{
                marginTop: "30px",
                textAlign: "center",
              }}
            >
              <Link
                to="/projects"
                style={{
                  color: "#159447",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                View All Projects →
              </Link>
            </div>
          )}

      </div>
    </section>
  );
}


export default FeaturedProjects;