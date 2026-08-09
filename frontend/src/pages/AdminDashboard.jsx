import {
  FaTachometerAlt,
  FaUserCheck,
  FaClipboardCheck,
  FaChartBar,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaCheck,
  FaTimes,
  FaEye,
  FaArrowRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import adminLogo from "../assets/admin-dashboard/logo.png";
import riceImg from "../assets/admin-dashboard/rice.png";
import vegetableImg from "../assets/admin-dashboard/vegetable.png";
import maizeImg from "../assets/admin-dashboard/maize.png";

import "./AdminDashboard.css";

const farmers = [
  {
    id: 1,
    name: "Rahim Ahmed",
    location: "Gazipur, Bangladesh",
    documents: "3 Documents",
    submitted: "20 May 2026",
  },
  {
    id: 2,
    name: "Karim Uddin",
    location: "Narsingdi, Bangladesh",
    documents: "3 Documents",
    submitted: "18 May 2026",
  },
  {
    id: 3,
    name: "Mizan Hossain",
    location: "Rajshahi, Bangladesh",
    documents: "3 Documents",
    submitted: "15 May 2026",
  },
];

const pendingProjects = [
  {
    id: 1,
    image: riceImg,
    project: "Rice Farming",
    farmer: "Rahim Ahmed",
    goal: "৳ 100,000",
  },
  {
    id: 2,
    image: vegetableImg,
    project: "Vegetable Farming",
    farmer: "Karim Uddin",
    goal: "৳ 80,000",
  },
  {
    id: 3,
    image: maizeImg,
    project: "Maize Cultivation",
    farmer: "Mizan Hossain",
    goal: "৳ 65,000",
  },
];

const reports = [
  {
    id: 1,
    image: riceImg,
    project: "Rice Farming",
    profit: "৳ 20,000",
    date: "21 May 2026",
  },
  {
    id: 2,
    image: vegetableImg,
    project: "Vegetable Farming",
    profit: "৳ 15,000",
    date: "20 May 2026",
  },
  {
    id: 3,
    image: maizeImg,
    project: "Maize Cultivation",
    profit: "৳ 12,500",
    date: "18 May 2026",
  },
];

function AdminDashboard() {
  return (
    <main className="ag-admin-page">
      <div className="ag-admin-shell">
        {/* SIDEBAR */}
        <aside className="ag-admin-sidebar">
          <Link to="/" className="ag-admin-brand">
            <img
              src={adminLogo}
              alt="AgroInvest"
              className="ag-admin-brand-logo"
            />

            <div className="ag-admin-brand-text">
              <h2>
                Agro<span>Invest</span>
              </h2>

              <p>Invest. Grow. Impact.</p>
            </div>
          </Link>

          <nav
            className="ag-admin-nav"
            aria-label="Admin navigation"
          >
            <Link
              className="active"
              to="/admin/dashboard"
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </Link>

            <a href="#verify-farmers">
              <FaUserCheck />
              <span>Verify Farmers</span>
            </a>

            <a href="#approve-projects">
              <FaClipboardCheck />
              <span>Approve Projects</span>
            </a>

            <a href="#reports">
              <FaChartBar />
              <span>Reports</span>
            </a>

            <a href="#manage-users">
              <FaUsers />
              <span>Manage Users</span>
            </a>

            <a href="#settings">
              <FaCog />
              <span>Settings</span>
            </a>

            <div className="ag-admin-nav-divider" />

            <Link to="/">
              <FaSignOutAlt />
              <span>Logout</span>
            </Link>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <section className="ag-admin-content">
          <header className="ag-admin-heading">
            <h1>Admin Dashboard</h1>

            <p>
              Welcome back, Admin! Here&apos;s what&apos;s happening
              on AgroInvest.
            </p>
          </header>

          {/* SUMMARY */}
          <section className="ag-admin-stats">
            <article>
              <div className="ag-stat-icon green">
                <FaUsers />
              </div>

              <div>
                <span>Total Farmers</span>
                <strong>135</strong>
                <small>8 this month</small>
              </div>
            </article>

            <article>
              <div className="ag-stat-icon blue">
                <FaUsers />
              </div>

              <div>
                <span>Total Investors</span>
                <strong>842</strong>
                <small>32 this month</small>
              </div>
            </article>

            <article>
              <div className="ag-stat-icon purple">
                <FaClipboardCheck />
              </div>

              <div>
                <span>Active Projects</span>
                <strong>17</strong>
                <small>3 this month</small>
              </div>
            </article>

            <article>
              <div className="ag-stat-icon yellow">
                ৳
              </div>

              <div>
                <span>Total Investment</span>
                <strong>৳ 2,45,000</strong>
                <small>৳20K this month</small>
              </div>
            </article>
          </section>

          {/* FARMER VERIFICATION */}
          <section
            id="verify-farmers"
            className="ag-admin-panel"
          >
            <div className="ag-panel-title">
              <h2>Pending Farmer Verifications</h2>

              <button type="button">
                View All
              </button>
            </div>

            <div className="ag-table ag-farmer-table">
              <div className="ag-table-head">
                <span>Farmer</span>
                <span>Documents</span>
                <span>Submitted On</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {farmers.map((farmer) => (
                <div
                  className="ag-table-row"
                  key={farmer.id}
                >
                  <div className="ag-farmer-cell">
                    <div className="ag-avatar">
                      <FaUsers />
                    </div>

                    <div>
                      <strong>{farmer.name}</strong>
                      <small>{farmer.location}</small>
                    </div>
                  </div>

                  <span>{farmer.documents}</span>

                  <span>{farmer.submitted}</span>

                  <span className="ag-pending">
                    Pending
                  </span>

                  <div className="ag-row-actions">
                    <button
                      className="accept"
                      type="button"
                      aria-label="Approve farmer"
                    >
                      <FaCheck />
                    </button>

                    <button
                      className="reject"
                      type="button"
                      aria-label="Reject farmer"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="ag-panel-link"
              type="button"
            >
              <span>
                Review and verify farmer documents
              </span>

              <FaArrowRight />
            </button>
          </section>

          {/* PROJECT VERIFICATION */}
          <section
            id="approve-projects"
            className="ag-admin-panel"
          >
            <div className="ag-panel-title">
              <h2>Pending Project Verifications</h2>

              <button type="button">
                View All
              </button>
            </div>

            <div className="ag-table ag-project-table">
              <div className="ag-table-head">
                <span>Project</span>
                <span>Farmer</span>
                <span>Goal Amount</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {pendingProjects.map((item) => (
                <div
                  className="ag-table-row"
                  key={item.id}
                >
                  <div className="ag-project-cell">
                    <img
                      src={item.image}
                      alt={item.project}
                    />

                    <strong>
                      {item.project}
                    </strong>
                  </div>

                  <span>{item.farmer}</span>

                  <span>{item.goal}</span>

                  <span className="ag-pending">
                    Pending
                  </span>

                  <div className="ag-row-actions">
                    <button
                      className="accept"
                      type="button"
                      aria-label="Approve project"
                    >
                      <FaCheck />
                    </button>

                    <button
                      className="reject"
                      type="button"
                      aria-label="Reject project"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="ag-panel-link"
              type="button"
            >
              <span>
                Approve or reject new project request
              </span>

              <FaArrowRight />
            </button>
          </section>

          {/* OVERVIEW */}
          <section className="ag-overview-grid">
            <article className="ag-admin-panel ag-overview-card">
              <div className="ag-panel-title">
                <h2>Project Funding Overview</h2>

                <select defaultValue="This Month">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="ag-funding-wrap">
                <div className="ag-donut">
                  <div>
                    <strong>42</strong>
                    <span>Projects</span>
                  </div>
                </div>

                <div className="ag-donut-legend">
                  <p>
                    <i className="blue-dot" />
                    <span>Fully Funded</span>
                    <strong>17 (40%)</strong>
                  </p>

                  <p>
                    <i className="green-dot" />
                    <span>In Progress</span>
                    <strong>15 (36%)</strong>
                  </p>

                  <p>
                    <i className="yellow-dot" />
                    <span>Not Funded</span>
                    <strong>10 (24%)</strong>
                  </p>
                </div>
              </div>
            </article>

            <article className="ag-admin-panel ag-overview-card">
              <div className="ag-panel-title">
                <h2>Investment Overview</h2>

                <select defaultValue="This Month">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="ag-invest-total">
                <span>Total Investment</span>

                <strong>৳ 2,45,000</strong>

                <small>
                  ↑ 12.5% from last month
                </small>
              </div>

              <div className="ag-line-chart">
                <svg viewBox="0 0 500 130">
                  <polyline
                    points="5,100 75,72 145,83 215,48 285,61 355,25 425,43 495,15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="ag-invest-mini">
                <div>
                  <span>
                    Successful Transactions
                  </span>

                  <strong>320</strong>

                  <small>
                    18 this month
                  </small>
                </div>

                <div>
                  <span>
                    Pending Transactions
                  </span>

                  <strong>18</strong>

                  <small>
                    5 this month
                  </small>
                </div>
              </div>
            </article>
          </section>

          {/* REPORTS */}
          <section
            id="reports"
            className="ag-admin-panel ag-report-panel"
          >
            <div className="ag-panel-title">
              <h2>Recent Profit Reports</h2>

              <button type="button">
                View All
              </button>
            </div>

            <div className="ag-table ag-report-table">
              <div className="ag-table-head">
                <span>Project</span>
                <span>Total Profit</span>
                <span>Reported On</span>
                <span>Action</span>
              </div>

              {reports.map((report) => (
                <div
                  className="ag-table-row"
                  key={report.id}
                >
                  <div className="ag-project-cell">
                    <img
                      src={report.image}
                      alt={report.project}
                    />

                    <strong>
                      {report.project}
                    </strong>
                  </div>

                  <span>{report.profit}</span>

                  <span>{report.date}</span>

                  <button
                    className="ag-view-report"
                    type="button"
                    aria-label="View report"
                  >
                    <FaEye />
                  </button>
                </div>
              ))}
            </div>

            <button
              className="ag-panel-link"
              type="button"
            >
              <span>
                View all profit and distribution reports
              </span>

              <FaArrowRight />
            </button>
          </section>

          <footer className="ag-admin-footer">
            © 2026 AgroInvest. All rights reserved.
          </footer>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;