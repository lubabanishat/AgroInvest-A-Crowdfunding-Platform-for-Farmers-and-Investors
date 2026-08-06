import { Link } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

import "./InvestorProfitReport.css";

function InvestorProfitReport() {
  return (
    <main className="profit-report-page">
      <div className="profit-report-wrapper">
        <Link
          to="/investor/dashboard"
          className="profit-report-back"
        >
          <FaArrowLeft />
          Back to Dashboard
        </Link>

        <section className="profit-report-box">
          <header className="profit-report-heading">
            <div className="profit-report-heading-icon">
              <FaClipboardList />
            </div>

            <div>
              <h1>Profit Report - Rice Farming Project</h1>
              <p>Report Published on: 25 July 2026</p>
            </div>
          </header>

          <div className="profit-report-details">
            <div className="profit-detail-row">
              <span>Invested Amount</span>
              <strong>৳ 5,000</strong>
            </div>

            <div className="profit-detail-row">
              <span>Investment Ratio</span>
              <strong>20%</strong>
            </div>

            <div className="profit-detail-row">
              <span>Profit Earned</span>
              <strong>৳ 780</strong>
            </div>

            <div className="profit-detail-row">
              <span>Total Returned</span>
              <strong>৳ 5,780</strong>
            </div>

            <div className="profit-detail-row">
              <span>Payment Status</span>
              <strong>Paid</strong>
            </div>
          </div>

          <div className="profit-report-message">
            <FaCheckCircle />

            <p>
              Your share has been calculated and paid according to the
              profit sharing ratio.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default InvestorProfitReport;