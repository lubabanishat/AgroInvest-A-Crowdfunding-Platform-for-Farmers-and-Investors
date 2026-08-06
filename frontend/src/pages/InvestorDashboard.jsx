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

import { Link } from "react-router-dom";
import InvestorTopbar from "../components/investor/InvestorTopbar";

import logo from "../assets/images/logo.png";

import boroRice from "../assets/investor-dashboard/boro-rice.png";
import mango from "../assets/investor-dashboard/mango.png";
import tomato from "../assets/investor-dashboard/tomato.png";
import chilli from "../assets/investor-dashboard/chilli.png";

import "./InvestorDashboard.css";

const recentInvestments = [
  {
    id: 1,
    image: boroRice,
    name: "Boro Rice Cultivation",
    location: "Gazipur, Bangladesh",
    duration: "Jan 2026 – Jun 2026",
    amount: "৳ 30,000",
    progress: 80,
    status: "Active",
  },
  {
    id: 2,
    image: mango,
    name: "Mango Orchard",
    location: "Rajshahi, Bangladesh",
    duration: "Dec 2025 – Nov 2026",
    amount: "৳ 25,000",
    progress: 65,
    status: "Active",
  },
  {
    id: 3,
    image: tomato,
    name: "Tomato Farming Project",
    location: "Narsingdi, Bangladesh",
    duration: "Feb 2026 – Jun 2026",
    amount: "৳ 20,000",
    progress: 40,
    status: "Active",
  },
  {
    id: 4,
    image: chilli,
    name: "Green Chilli Cultivation",
    location: "Kishoreganj, Bangladesh",
    duration: "Mar 2026 – Aug 2026",
    amount: "৳ 15,000",
    progress: 20,
    status: "Active",
  },
];

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

function InvestorDashboard() {
  return (
    <main className="investor-dashboard-page">
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div>
            <div className="sidebar-logo">
              <img src={logo} alt="AgroInvest" />
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
                <span>Dashboard</span>
              </Link>

              <Link to="/projects">
                <FaSeedling />
                <span>Browse Projects</span>
              </Link>

              <Link to="/investor/my-investments">
  <FaWallet />
  <span>My Investments</span>
</Link>

              <Link to="/investor/profit-report">
                <FaChartLine />
                <span>Profit Report</span>
              </Link>

              <a href="#notifications">
                <FaBell />
                <span>Notifications</span>
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

              <a href="#help-support">
                <FaQuestionCircle />
                <span>Help & Support</span>
              </a>

              <Link to="/">
                <FaSignOutAlt />
                <span>Logout</span>
              </Link>
            </nav>
          </div>

          <div className="sidebar-grow-card">
            <div className="grow-icon" aria-hidden="true">
              🌱
            </div>

            <h4>Grow Agriculture</h4>

            <p>
              Grow Bangladesh with smart agricultural investment.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <section className="dashboard-main">
          <InvestorTopbar />

          <section className="dashboard-welcome">
            <h1>Welcome back, Investor</h1>

            <p>
              Here&apos;s what&apos;s happening with your projects
              today.
            </p>
          </section>

          {/* Summary */}
          <section className="dashboard-summary">
            <article className="summary-card">
              <div className="summary-icon investment">
                <FaWallet />
              </div>

              <h3>Total Investment</h3>
              <h2>৳ 15,000</h2>
              <p>In 5 Projects</p>
            </article>

            <article className="summary-card">
              <div className="summary-icon active">
                <FaClipboardList />
              </div>

              <h3>Active Projects</h3>
              <h2>4</h2>
              <p>Ongoing Investment</p>
            </article>

            <article className="summary-card">
              <div className="summary-icon profit">
                <FaChartBar />
              </div>

              <h3>Estimated Profit</h3>
              <h2>৳ 18,750</h2>
              <p>From All Projects</p>
            </article>

            <article className="summary-card">
              <div className="summary-icon completed">
                <FaCheckCircle />
              </div>

              <h3>Completed Projects</h3>
              <h2>1</h2>
              <p>View History</p>
            </article>
          </section>

          {/* Recent investments */}
          <section
            id="my-investments"
            className="dashboard-card recent-investments"
          >
            <div className="recent-header">
              <h2>Recent Investment</h2>

              <a href="#my-investments">View All →</a>
            </div>

            <div className="investment-list">
              {recentInvestments.map((investment) => (
                <article
                  className="investment-row"
                  key={investment.id}
                >
                  <img
                    src={investment.image}
                    alt={investment.name}
                    className="investment-project-image"
                  />

                  <div className="investment-info">
                    <h3>{investment.name}</h3>

                    <p>
                      <FaMapMarkerAlt />
                      {investment.location}
                    </p>

                    <span>
                      <FaCalendarAlt />
                      Duration: {investment.duration}
                    </span>
                  </div>

                  <div className="investment-amount">
                    <small>Invested</small>
                    <strong>{investment.amount}</strong>
                  </div>

                  <div className="investment-progress">
                    <div className="investment-progress-heading">
                      <small>Progress</small>
                      <span>{investment.progress}%</span>
                    </div>

                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={investment.progress}
                    >
                      <div
                        className="progress-fill"
                        style={{
                          width: `${investment.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="investment-status">
                    <span className="active-status">
                      {investment.status}
                    </span>

                    <Link
                      to={`/projects/${investment.id}`}
                      className="investment-details-button"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
                    {/* Project updates */}
          <section className="dashboard-card updates-card">
            <div className="updates-header">
              <h2>Project Updates</h2>

              <a href="#project-updates">View All →</a>
            </div>

            <div className="updates-grid" id="project-updates">
              {projectUpdates.map((update) => (
                <article className="update-item" key={update.id}>
                  <div className={`update-icon ${update.color}`}>
                    {update.icon}
                  </div>

                  <div>
                    <h4>{update.title}</h4>
                    <p>{update.description}</p>
                    <span>{update.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Bottom section */}
          <div className="dashboard-bottom">
            {/* Profit summary */}
            <section
              id="profit-report"
              className="dashboard-card profit-summary-card"
            >
              <div className="bottom-card-header">
                <h2>Profit Summary</h2>

                <select aria-label="Profit report period">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="profit-summary-content">
                <div className="profit-estimate-box">
                  <span>Estimated Profit</span>
                  <strong>৳ 4,250</strong>
                  <p>This Month</p>
                </div>

                <div className="profit-chart-area">
                  <div
                    className="profit-donut"
                    role="img"
                    aria-label="Profit distribution chart"
                  >
                    <div className="profit-donut-center">
                      <strong>৳ 4,250</strong>
                      <span>Total</span>
                    </div>
                  </div>

                  <div className="profit-legend">
                    <div>
                      <span className="legend-color boro" />

                      <p>
                        <strong>Boro Rice</strong>
                        <small>৳ 1,800</small>
                      </p>
                    </div>

                    <div>
                      <span className="legend-color mango" />

                      <p>
                        <strong>Mango Orchard</strong>
                        <small>৳ 1,400</small>
                      </p>
                    </div>

                    <div>
                      <span className="legend-color tomato" />

                      <p>
                        <strong>Tomato Farming</strong>
                        <small>৳ 750</small>
                      </p>
                    </div>

                    <div>
                      <span className="legend-color chilli" />

                      <p>
                        <strong>Green Chilli</strong>
                        <small>৳ 300</small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick actions */}
            <section className="dashboard-card quick-actions-card">
              <div className="bottom-card-header">
                <h2>Quick Actions</h2>
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
                    <strong>Browse Projects</strong>
                    <span>Find new projects to invest</span>
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
                    <strong>My Investments</strong>
                    <span>View your investments</span>
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
                    <strong>Investment Reports</strong>
                    <span>See profit and performance</span>
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
                    <strong>Messages</strong>
                    <span>Contact the support team</span>
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