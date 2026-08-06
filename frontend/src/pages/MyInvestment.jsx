import {
  FaThLarge,
  FaSeedling,
  FaWallet,
  FaChartLine,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import InvestorTopbar from "../components/investor/InvestorTopbar";

import logo from "../assets/images/logo.png";

import boroRice from "../assets/investor-dashboard/boro-rice.png";
import mango from "../assets/investor-dashboard/mango.png";
import tomato from "../assets/investor-dashboard/tomato.png";

import "./MyInvestment.css";

const investments = [
  {
    id: 1,
    image: boroRice,
    title: "Rice Farming Project",
    farmer: "Rahim Uddin",
    location: "Gazipur, Bangladesh",
    amount: "৳ 5,000",
    date: "16 July 2026",
    status: "Active",
    progress: 80,
  },
  {
    id: 2,
    image: mango,
    title: "Mango Orchard Project",
    farmer: "Karim Uddin",
    location: "Rajshahi, Bangladesh",
    amount: "৳ 10,000",
    date: "20 July 2026",
    status: "Completed",
    progress: 100,
  },
  {
    id: 3,
    image: tomato,
    title: "Tomato Farming Project",
    farmer: "Salam Begum",
    location: "Jessore, Bangladesh",
    amount: "৳ 7,500",
    date: "10 August 2026",
    status: "Active",
    progress: 45,
  },
];

function MyInvestment() {
  return (
    <main className="my-investment-page">
      <div className="my-investment-container">
        {/* Sidebar */}
        <aside className="my-investment-sidebar">
          <div>
            <div className="my-investment-logo">
              <img src={logo} alt="AgroInvest" />
            </div>

            <div className="investor-sidebar-label">
              <FaSeedling />

              <div>
                <strong>Investor Dashboard</strong>
                <span>Grow Together, Earn Together</span>
              </div>
            </div>

            <nav
              className="my-investment-menu"
              aria-label="Investor navigation"
            >
              <Link to="/investor/dashboard">
                <FaThLarge />
                <span>Dashboard</span>
              </Link>

              <Link to="/projects">
                <FaSeedling />
                <span>All Project</span>
              </Link>

              <Link
                to="/investor/my-investments"
                className="active"
              >
                <FaWallet />
                <span>My Investment</span>
              </Link>

              <Link to="/investor/profit-report">
                <FaChartLine />
                <span>Profit Report</span>
              </Link>

              <a href="#wallet">
                <FaWallet />
                <span>Wallet</span>
              </a>

              <a href="#profile-settings">
                <FaUserCircle />
                <span>Profile Setting</span>
              </a>

              <a href="#notifications">
                <FaBell />
                <span>Notification</span>
              </a>

              <Link to="/">
                <FaSignOutAlt />
                <span>Logout</span>
              </Link>
            </nav>
          </div>

          <div className="investment-sidebar-card">
            <div className="investment-sidebar-icon">
              🌱
            </div>

            <h3>
              Invest in Agriculture
              <br />
              Secure Future
            </h3>

            <p>
              Your investment helps farmers grow and builds a better
              future.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <section className="my-investment-main">
          <InvestorTopbar />

          <section className="my-investment-content">
            <div className="my-investment-header">
              <div>
                <h1>My Investment</h1>

                <p>
                  Here you can see all projects you have invested in.
                </p>
              </div>

              <select aria-label="Filter investments by status">
                <option>All Status</option>
                <option>Active</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="my-investment-list">
              {investments.map((investment) => (
                <article
                  className="my-investment-card"
                  key={investment.id}
                >
                  <img
                    src={investment.image}
                    alt={investment.title}
                    className="my-investment-image"
                  />

                  <div className="my-investment-project-info">
                    <h2>{investment.title}</h2>

                    <p>
                      <FaUserCircle />
                      Farmer: {investment.farmer}
                    </p>

                    <p>
                      <FaMapMarkerAlt />
                      {investment.location}
                    </p>

                    <div className="my-investment-meta">
                      <div>
                        <span>Invested Amount</span>
                        <strong>{investment.amount}</strong>
                      </div>

                      <div>
                        <span>Investment Date</span>
                        <strong>
                          <FaCalendarAlt />
                          {investment.date}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="my-investment-status-area">
                    <span className="status-title">Status</span>

                    <span
                      className={`investment-status-badge ${
                        investment.status === "Completed"
                          ? "completed"
                          : "active"
                      }`}
                    >
                      {investment.status}
                    </span>

                    <div className="my-investment-progress-header">
                      <span>Funding progress</span>
                      <strong>{investment.progress}%</strong>
                    </div>

                    <div
                      className="my-investment-progress"
                      role="progressbar"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={investment.progress}
                    >
                      <div
                        style={{
                          width: `${investment.progress}%`,
                        }}
                      />
                    </div>

                    {investment.status === "Completed" ? (
                      <Link
                        to="/investor/profit-report"
                        className="my-investment-button"
                      >
                        View Profit
                      </Link>
                    ) : (
                      <Link
                        to={`/projects/${investment.id}`}
                        className="my-investment-button"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="my-investment-note">
              <FaInfoCircle />

              <div>
                <strong>Note:</strong>

                <p>
                  You will be able to see the profit once the project
                  is completed.
                </p>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default MyInvestment;