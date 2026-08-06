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
} from "react-icons/fa";

import { Link } from "react-router-dom";

import FarmerTopbar from "../components/farmer/FarmerTopbar";

import logo from "../assets/images/logo.png";

import boroRice from "../assets/farmer-dashboard/boro-rice.png";
import tomato from "../assets/farmer-dashboard/tomato.png";
import chilli from "../assets/farmer-dashboard/chilli.png";

import "./FarmerDashboard.css";

const projects = [
  {
    id: 1,
    image: boroRice,
    title: "Boro Rice Cultivation",
    location: "Gazipur, Bangladesh",
    duration: "Jan 2026 – Jun 2026",
    status: "Active",
    raised: "৳ 50,000",
    goal: "৳ 70,000",
    progress: 80,
    investors: 68,
  },
  {
    id: 2,
    image: tomato,
    title: "Tomato Farming Project",
    location: "Narsingdi, Bangladesh",
    duration: "Feb 2026 – Jun 2026",
    status: "Active",
    raised: "৳ 30,000",
    goal: "৳ 50,000",
    progress: 60,
    investors: 34,
  },
  {
    id: 3,
    image: chilli,
    title: "Green Chilli Cultivation",
    location: "Kishoreganj, Bangladesh",
    duration: "Mar 2026 – Aug 2026",
    status: "Pending Review",
    raised: "৳ 40,000",
    goal: "৳ 80,000",
    progress: 50,
    investors: 26,
  },
];

const activities = [
  {
    id: 1,
    title: "New investment received",
    description: "৳ 5,000 in Boro Rice Cultivation",
    time: "2 hours ago",
    icon: <FaFileAlt />,
    color: "green",
  },
  {
    id: 2,
    title: "Project approved",
    description: "Tomato Farming Project is now live",
    time: "1 day ago",
    icon: <FaClipboardList />,
    color: "blue",
  },
  {
    id: 3,
    title: "Profit report generated",
    description: "April 2026 - Boro Rice Cultivation",
    time: "2 days ago",
    icon: <FaChartLine />,
    color: "purple",
  },
  {
    id: 4,
    title: "Project under review",
    description: "Green Chilli Cultivation is under admin review",
    time: "1 day ago",
    icon: <FaClock />,
    color: "orange",
  },
];

function FarmerDashboard() {
  return (
    <main className="farmer-dashboard-page">
      <div className="farmer-dashboard-container">
        <aside className="farmer-dashboard-sidebar">
          <div>
            <div className="farmer-sidebar-logo">
              <img src={logo} alt="AgroInvest" />
            </div>

            <nav
              className="farmer-sidebar-menu"
              aria-label="Farmer navigation"
            >
              <Link to="/farmer/dashboard" className="active">
                <FaThLarge />
                <span>Dashboard</span>
              </Link>

              <a href="#my-projects">
                <FaClipboardList />
                <span>My Projects</span>
              </a>

              <Link to="/farmer/create-project">
                <FaPlusCircle />
                <span>Create New Projects</span>
              </Link>

              <a href="#applications">
                <FaFileAlt />
                <span>Applications</span>
              </a>

              <Link to="/farmer/profit-report">
                <FaChartLine />
                <span>Profit Reports</span>
              </Link>

              <a href="#investors">
                <FaUsers />
                <span>Investors</span>
              </a>

              <a href="#documents">
                <FaFolderOpen />
                <span>Documents</span>
              </a>

              <a href="#messages">
                <FaEnvelope />
                <span>Messages</span>
              </a>

              <a href="#profile">
                <FaUser />
                <span>Profile</span>
              </a>

              <a href="#settings">
                <FaCog />
                <span>Settings</span>
              </a>

              <a href="#help">
                <FaQuestionCircle />
                <span>Help & Support</span>
              </a>
            </nav>
          </div>

          <div className="farmer-help-card">
            <FaQuestionCircle />
            <h3>Need Help?</h3>
            <p>Our support team is here to help you.</p>
            <button type="button">Contact Support</button>
          </div>
        </aside>

        <section className="farmer-dashboard-main">
          <FarmerTopbar />

          <section className="farmer-welcome">
            <h1>Welcome back, Farmer Rahim! 🌱</h1>
            <p>
              Here&apos;s what&apos;s happening with your project today.
            </p>
          </section>

          <section className="farmer-summary-grid">
            <article className="farmer-summary-card">
              <div className="farmer-summary-icon projects">
                <FaSeedling />
              </div>
              <h3>Total Projects</h3>
              <h2>3</h2>
              <p>Active Projects</p>
            </article>

            <article className="farmer-summary-card">
              <div className="farmer-summary-icon investors">
                <FaUsers />
              </div>
              <h3>Total Investors</h3>
              <h2>128</h2>
              <p>Across all projects</p>
            </article>

            <article className="farmer-summary-card">
              <div className="farmer-summary-icon raised">
                <FaMoneyBillWave />
              </div>
              <h3>Total Raised</h3>
              <h2>৳ 246,500</h2>
              <p>From All Projects</p>
            </article>

            <article className="farmer-summary-card">
              <div className="farmer-summary-icon profit">
                <FaChartLine />
              </div>
              <h3>Estimated Profit Share</h3>
              <h2>৳ 18,650</h2>
              <p>From all calculation</p>
            </article>
          </section>

          <p className="farmer-summary-note">
            Note: Profit share will be calculated at the end of each
            project and shown in reports.
          </p>

          <section
            id="my-projects"
            className="farmer-dashboard-card farmer-projects-card"
          >
            <div className="farmer-section-header">
              <h2>My Projects Overview</h2>
              <a href="#my-projects">
                View All Projects <FaArrowRight />
              </a>
            </div>

            <div className="farmer-project-list">
              {projects.map((project) => (
                <article
                  className="farmer-project-row"
                  key={project.id}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="farmer-project-image"
                  />

                  <div className="farmer-project-info">
                    <div className="farmer-project-title-row">
                      <h3>{project.title}</h3>
                      <span
                        className={`farmer-project-status ${
                          project.status === "Pending Review"
                            ? "pending"
                            : "active"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <p>
                      <FaMapMarkerAlt />
                      {project.location}
                    </p>

                    <span>
                      <FaCalendarAlt />
                      Duration: {project.duration}
                    </span>
                  </div>

                  <div className="farmer-project-raised">
                    <small>Raised</small>
                    <strong>
                      {project.raised} / {project.goal}
                    </strong>

                    <div className="farmer-project-progress">
                      <div
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />
                    </div>

                    <span>{project.progress}%</span>
                  </div>

                  <div className="farmer-project-investors">
                    <small>Investors</small>
                    <strong>
                      <FaUsers />
                      {project.investors}
                    </strong>

                    <Link to={`/projects/${project.id}`}>
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="farmer-dashboard-card farmer-activities-card">
            <div className="farmer-section-header">
              <h2>Recent Activities</h2>
            </div>

            <div className="farmer-activities-grid">
              {activities.map((activity) => (
                <article
                  className="farmer-activity-item"
                  key={activity.id}
                >
                  <div
                    className={`farmer-activity-icon ${activity.color}`}
                  >
                    {activity.icon}
                  </div>

                  <div>
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <span>{activity.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="farmer-bottom-grid">
            <section className="farmer-dashboard-card farmer-profit-card">
              <div className="farmer-section-header">
                <h2>Profit Summary (Estimated)</h2>

                <select aria-label="Profit period">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="farmer-profit-summary">
                <div>
                  <span>Estimated Profit Share</span>
                  <strong>৳ 8,650</strong>
                  <small>From Completed Projects</small>
                </div>

                <div>
                  <span>Projected This Month</span>
                  <strong>৳ 0</strong>
                  <small>No Projects Completed Yet</small>
                </div>

                <div>
                  <span>Available at Completion</span>
                  <strong>৳ 8,650</strong>
                  <small>After project completion</small>
                </div>
              </div>

              <p className="farmer-profit-note">
                Actual profit share will be available when projects
                are completed.
              </p>
            </section>

            <section className="farmer-dashboard-card farmer-profile-card">
              <h2>Complete Your Profile</h2>
              <p>
                Complete your profile and documents to build trust and
                get more investors.
              </p>

              <div className="farmer-profile-progress">
                <div style={{ width: "80%" }} />
              </div>

              <span>80%</span>
              <button type="button">Upgrade Profile</button>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default FarmerDashboard;