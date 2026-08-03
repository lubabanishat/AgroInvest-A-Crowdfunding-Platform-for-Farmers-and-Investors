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

const projects = [
  {
    id: 1,
    title: "Rice Farming Project",
    image: rice,
    location: "Jessore, Bangladesh",
    funded: 64,
  },

  {
    id: 2,
    title: "Mango Orchard Project",
    image: mango,
    location: "Khulna, Bangladesh",
    funded: 62,
  },

  {
    id: 3,
    title: "Organic Vegetable Farming",
    image: vegetable,
    location: "Rajshahi, Bangladesh",
    funded: 64,
  },

  {
    id: 4,
    title: "Boro Rice Cultivation",
    image: boroRice,
    location: "Gazipur, Bangladesh",
    funded: 80,
  },

  {
    id: 5,
    title: "Green Chilli Cultivation",
    image: chilli,
    location: "Kishoreganj, Bangladesh",
    funded: 50,
  },

  {
    id: 6,
    title: "Tomato Farming Project",
    image: tomato,
    location: "Narsingdi, Bangladesh",
    funded: 60,
  },
];

function Projects() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}

      <section
  className="projects-hero"
  style={{ backgroundImage: `url(${heroBg})` }}
  aria-labelledby="projects-page-title"
>
  <div className="projects-hero-overlay" />

  <div className="projects-hero-content">
    <h1 id="projects-page-title">All Projects</h1>

    <p>
      Explore verified agricultural projects and invest in a better
      future.
    </p>
  </div>
</section>

      {/* Filter Section */}

      <section className="projects-filter">
  <div className="projects-filter-container">

    <div className="projects-search">
      <input
        type="text"
        placeholder="Search projects by crop, location..."
      />

      <img src={searchIcon} alt="Search" />
    </div>

    <select>
      <option>All Categories</option>
      <option>Rice</option>
      <option>Vegetable</option>
      <option>Fruit</option>
    </select>

    <select>
      <option>All Location</option>
      <option>Dhaka</option>
      <option>Rajshahi</option>
      <option>Khulna</option>
      <option>Gazipur</option>
    </select>

    <select>
      <option>All Status</option>
      <option>Open</option>
      <option>Funded</option>
      <option>Completed</option>
    </select>

    <button className="projects-filter-btn">
      <img src={filterIcon} alt="" />
      Filter
    </button>

  </div>
</section>

      {/* Cards */}

      <section className="projects-list">
  <div className="projects-grid">
    {projects.map((project) => (
      <article className="project-card" key={project.id}>
        <div className="project-card-top">
          <img
            src={project.image}
            alt={project.title}
            className="project-card-image"
          />

          <div className="project-card-content">
            <h2>{project.title}</h2>

            <p className="project-location">
              <img
                src={locationIcon}
                alt=""
                aria-hidden="true"
              />
              {project.location}
            </p>

            <div
              className="project-progress"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={project.funded}
              aria-label={`${project.title} funding progress`}
            >
              <div
                className="project-progress-value"
                style={{ width: `${project.funded}%` }}
              />
            </div>

            <p className="project-funded">
              {project.funded}% Funded
            </p>
          </div>
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="project-details-btn"
        >
          View Details
        </Link>
      </article>
    ))}
  </div>
  
   {/* Pagination */}
  <div className="projects-pagination">
    <button>&lt;</button>

    <button className="active">1</button>
    <button>2</button>
    <button>3</button>

    <button>&gt;</button>
  </div>

</section>

      <Footer />
    </>
  );
}

export default Projects;