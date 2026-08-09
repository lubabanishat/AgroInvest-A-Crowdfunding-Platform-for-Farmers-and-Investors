import { Link } from "react-router-dom";

import vegetableImg from "../../assets/home-page/vegetable.png";
import mangoImg from "../../assets/home-page/mango.png";
import riceImg from "../../assets/home-page/rice.png";

import "./FeaturedProjects.css";

const projects = [
  {
    id: 1,
    title: "Organic Vegetable Farming",
    location: "Rajshahi, Bangladesh",
    funded: 64,
    image: vegetableImg,
  },
  {
    id: 2,
    title: "Mango Orchard Project",
    location: "Khulna, Bangladesh",
    funded: 62,
    image: mangoImg,
  },
  {
    id: 3,
    title: "Rice Farming Project",
    location: "Jessore, Bangladesh",
    funded: 64,
    image: riceImg,
  },
];

function FeaturedProjects() {
  return (
    <section
      id="projects"
      className="featured-projects-section"
      aria-labelledby="featured-projects-heading"
    >
      <div className="featured-projects-container">
        <div className="featured-projects-heading">
          <h2 id="featured-projects-heading">
            Featured Farming Projects
          </h2>

          <p>
            Explore verified projects and invest in a better tomorrow.
          </p>
        </div>

        <div className="featured-projects-grid">
          {projects.map((project) => (
            <article
              key={project.id}
              className="project-card"
            >
              <div className="project-card-top">
                <div className="project-image-wrapper">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-image"
                  />
                </div>

                <div className="project-information">
                  <h3>{project.title}</h3>

                  <p className="project-location">
                    <span className="location-dot" />
                    {project.location}
                  </p>

                  <div
                    className="project-progress"
                    role="progressbar"
                    aria-label={`${project.title} funding progress`}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={project.funded}
                  >
                    <div
                      className="project-progress-fill"
                      style={{
                        width: `${project.funded}%`,
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
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;