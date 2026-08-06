import {
  FaArrowLeft,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "./FarmerProfitReport.css";

const reportRows = [
  {
    label: "Funding Goal",
    value: "৳ 25,000",
  },
  {
    label: "Total Investment",
    value: "৳ 25,000",
  },
  {
    label: "Total Revenue",
    value: "৳ 38,000",
  },
  {
    label: "Net Profit",
    value: "৳ 13,000",
  },
  {
    label: "Farmer Share (70%)",
    value: "৳ 9,100",
  },
  {
    label: "Investor Share (30%)",
    value: "৳ 3,900",
  },
];

function FarmerProfitReport() {
  return (
    <main className="farmer-profit-report-page">
      <div className="farmer-profit-report-wrapper">
        <Link
          to="/farmer/dashboard"
          className="farmer-profit-back-button"
        >
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </Link>

        <section className="farmer-profit-report-card">
          <header className="farmer-profit-report-header">
            <div className="farmer-profit-report-icon">
              <FaClipboardList />
            </div>

            <div>
              <h1>Profit Report - Rice Farming Project</h1>

              <p>Report Published on: 25 July 2026</p>
            </div>
          </header>

          <section
            className="farmer-profit-report-table"
            aria-label="Farmer profit report details"
          >
            {reportRows.map((row) => (
              <div
                className="farmer-profit-report-row"
                key={row.label}
              >
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </section>

          <div className="farmer-profit-success-message">
            <FaCheckCircle />

            <p>
              Profit has been distributed according to the profit
              sharing ratio.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default FarmerProfitReport;