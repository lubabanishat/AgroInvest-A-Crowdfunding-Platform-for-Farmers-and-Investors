import { Link, useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaCheckCircle,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import riceProject from "../assets/project-details/rice-project.png";
import farmer from "../assets/project-details/farmer.png";
import location from "../assets/project-details/location.png";
import description from "../assets/project-details/description.png";
import landSize from "../assets/project-details/land-size.png";
import duration from "../assets/project-details/duration.png";
import harvest from "../assets/project-details/harvest.png";
import method from "../assets/project-details/method.png";
import timeline from "../assets/project-details/timeline.png";
import landDocument from "../assets/project-details/land document.png";
import nid from "../assets/project-details/NID.png";

import "./ProjectDetails.css";

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
    value: "15 Nov 2026",
  },
  {
    id: 4,
    icon: method,
    label: "Farming Method",
    value: "Traditional",
  },
];

const timelineItems = [
  {
    id: 1,
    title: "Project Created",
    date: "01 May 2026",
    completed: true,
  },
  {
    id: 2,
    title: "Funding Started",
    date: "10 May 2026",
    completed: true,
  },
  {
    id: 3,
    title: "Cultivation",
    date: "01 Jun 2026 – 15 Sep 2026",
    completed: true,
  },
  {
    id: 4,
    title: "Harvest",
    date: "16 Sep 2026 – 15 Nov 2026",
    completed: false,
  },
  {
    id: 5,
    title: "Profit Calculation",
    date: "16 Nov 2026 – 30 Nov 2026",
    completed: false,
  },
];

function ProjectDetails() {
  const navigate = useNavigate();

  const handleInvest = () => {
    navigate("/payment/1");
  };

  return (
    <>
      <Navbar />

      <main className="details-page">
        <div className="details-container">
          <Link to="/projects" className="details-back-link">
            ← Back to All Projects
          </Link>

          <div className="details-main-layout">
            {/* Left column */}
            <div className="details-left-column">
              <section className="details-overview-card">
                <img
                  src={riceProject}
                  alt="Rice farming field"
                  className="details-project-image"
                />

                <div className="details-project-info">
                  <h1>Rice Farming Project</h1>

                  <div className="details-location">
                    <img src={location} alt="" aria-hidden="true" />
                    <span>Jessore, Bangladesh</span>
                  </div>

                  <div
                    className="details-tags"
                    aria-label="Project categories"
                  >
                    <span>Rice</span>
                    <span>Crop Farming</span>
                    <span>Outdoor</span>
                  </div>

                  <article className="details-farmer-card">
                    <img
                      src={farmer}
                      alt="Farmer Md. Rahim Uddin"
                      className="details-farmer-image"
                    />

                    <div>
                      <p>Verified Farmer</p>
                      <h2>Md. Rahim Uddin</h2>

                      <div className="details-rating">
                        <span>★ 4.8</span>
                        <span>(28 Reviews)</span>
                      </div>
                    </div>

                    <FaCheckCircle
                      className="details-verified-icon"
                      aria-label="Verified farmer"
                    />
                  </article>
                </div>
              </section>

              <section className="details-card details-description-card">
                <div className="details-section-title">
                  <img src={description} alt="" aria-hidden="true" />
                  <h2>Project Description</h2>
                </div>

                <p className="details-description">
                  This project aims to cultivate high-quality Aus rice
                  on 5 acres of fertile land. The farmer has years of
                  experience in rice cultivation and expects a good
                  yield this season.
                </p>

                <div className="details-facts-grid">
                  {projectFacts.map((fact) => (
                    <article
                      className="details-fact-card"
                      key={fact.id}
                    >
                      <img
                        src={fact.icon}
                        alt=""
                        aria-hidden="true"
                      />
                      <span>{fact.label}</span>
                      <strong>{fact.value}</strong>
                    </article>
                  ))}
                </div>
              </section>

              <section className="details-card details-timeline-card">
                <div className="details-section-title">
                  <img src={timeline} alt="" aria-hidden="true" />
                  <h2>Project Timeline</h2>
                </div>

                <ol className="details-timeline">
                  {timelineItems.map((item) => (
                    <li
                      key={item.id}
                      className={item.completed ? "completed" : ""}
                    >
                      <div className="details-timeline-dot">
                        {item.completed && (
                          <FaCheck aria-hidden="true" />
                        )}
                      </div>

                      <div className="details-timeline-text">
                        <strong>{item.title}</strong>
                        <span>{item.date}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="details-card details-documents-card">
                <h2>
                  Documents <span>(Verified by Admin)</span>
                </h2>

                <article className="details-document-row">
                  <div>
                    <img src={nid} alt="" aria-hidden="true" />
                    <span>NID Verified</span>
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
                    <span>Land Document Verified</span>
                  </div>

                  <span className="details-document-status">
                    <FaCheckCircle />
                    Verified
                  </span>
                </article>
              </section>
            </div>

            {/* Right column */}
            <aside className="details-right-column">
              <section className="details-card details-funding-card">
                <h2>Funding Progress</h2>

                <div className="details-info-row">
                  <span>Funding Goal</span>
                  <strong>৳ 25,000</strong>
                </div>

                <div className="details-info-row">
                  <span>Raised Amount</span>
                  <strong>৳ 16,000</strong>
                </div>

                <div className="details-info-row">
                  <span>Remaining Amount</span>
                  <strong>৳ 9,000</strong>
                </div>

                <div
                  className="details-progress"
                  role="progressbar"
                  aria-label="Funding progress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow="64"
                >
                  <div
                    className="details-progress-value"
                    style={{ width: "64%" }}
                  />
                </div>

                <div className="details-progress-footer">
                  <span>87 Days Left</span>
                  <strong>64%</strong>
                </div>
              </section>

              <section className="details-card details-investment-card">
                <h2>Investment Information</h2>

                <div className="details-info-row">
                  <span>Expected Profit</span>
                  <strong>15%</strong>
                </div>

                <div className="details-info-row">
                  <span>Minimum Investment</span>
                  <strong>৳ 1,000</strong>
                </div>

                <div className="details-info-row">
                  <span>Maximum Investment</span>
                  <strong>৳ 50,000</strong>
                </div>
              </section>

              <section className="details-card details-benefits-card">
                <h2>Why Invest in This Project?</h2>

                <ul>
                  <li>Verified farmer and land</li>
                  <li>High demand for rice</li>
                  <li>Experienced farmer</li>
                  <li>Transparent tracking</li>
                </ul>
              </section>

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

          <section className="details-investment-cta">
            <div>
              <strong>Interested in this Project?</strong>

              <p>
                Invest now and be a part of this successful farming
                journey.
              </p>
            </div>

            <button type="button" onClick={handleInvest}>
              Invest Now →
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProjectDetails;