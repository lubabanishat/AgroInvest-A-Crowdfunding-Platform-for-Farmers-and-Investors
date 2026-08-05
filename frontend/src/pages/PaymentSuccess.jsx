import { Link } from "react-router-dom";
import {
  FaCheck,
  FaCopy,
  FaHome,
  FaArrowRight,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import "./PaymentSuccess.css";

function PaymentSuccess() {
  const transactionId = "TRX20260524123456";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transactionId);
      window.alert("Transaction ID copied.");
    } catch {
      window.alert("Could not copy the transaction ID.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="success-page">
        <div className="success-container">
          <section className="success-header">
            <div className="success-icon">
              <FaCheck aria-hidden="true" />
            </div>

            <h1>Payment Successful!</h1>

            <p>
              Your investment has been successfully completed.
            </p>
          </section>

          <section className="success-card">
            <h2>Payment Details</h2>

            <div className="success-details-row">
              <span>Project Name</span>
              <strong className="success-project-name">
                Rice Farming Project
              </strong>
            </div>

            <div className="success-details-row">
              <span>Investor Name</span>
              <strong>Akash</strong>
            </div>

            <div className="success-details-row">
              <span>Amount Invested</span>
              <strong>৳ 5,000</strong>
            </div>

            <div className="success-details-row">
              <span>Transaction ID</span>

              <div className="success-transaction">
                <strong>{transactionId}</strong>

                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy transaction ID"
                >
                  <FaCopy />
                </button>
              </div>
            </div>

            <div className="success-details-row">
              <span>Payment Method</span>
              <strong>SSLCommerz</strong>
            </div>

            <div className="success-details-row">
              <span>Payment Date &amp; Time</span>
              <strong>24 May 2026, 12:34 PM</strong>
            </div>
          </section>

          <section className="success-message">
            <strong>Thank you for supporting agriculture!</strong>

            <p>
              You will start earning returns once the project is
              completed. You can track your investment from your
              dashboard.
            </p>
          </section>

          <div className="success-actions">
            <Link
              to="/investor/dashboard"
              className="success-primary-btn"
            >
              Go to Investment
              <FaArrowRight />
            </Link>

            <Link to="/" className="success-secondary-btn">
              Back to Home
              <FaHome />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default PaymentSuccess;