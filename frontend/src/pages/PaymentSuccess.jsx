import { useMemo } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

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
  const [searchParams] = useSearchParams();

  const transactionId =
    searchParams.get("transactionId") ||
    "N/A";

  const projectId =
    searchParams.get("projectId") ||
    "";

  const amount =
    Number(
      searchParams.get("amount")
    ) || 0;

  const paymentMethod =
    searchParams.get("paymentMethod") ||
    "SSLCommerz";

  const paymentDateRaw =
    searchParams.get("paymentDate");

  const investorId =
    searchParams.get("investorId") ||
    "";

  /* =========================
     GET SAVED PAYMENT INFO
  ========================= */

  const pendingInvestment = useMemo(() => {
    try {
      const saved =
        sessionStorage.getItem(
          "pendingInvestment"
        );

      return saved
        ? JSON.parse(saved)
        : null;
    } catch (error) {
      console.error(
        "Pending investment parse error:",
        error
      );

      return null;
    }
  }, []);

  const projectName =
    pendingInvestment?.projectName ||
    (projectId
      ? `Project #${projectId}`
      : "Project");

  const investorName =
    pendingInvestment?.investorName ||
    (investorId
      ? `Investor #${investorId}`
      : "Investor");

  /* =========================
     FORMAT PAYMENT DATE
  ========================= */

  const formattedPaymentDate =
    useMemo(() => {
      if (!paymentDateRaw) {
        return new Date().toLocaleString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        );
      }

      const date =
        new Date(paymentDateRaw);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return paymentDateRaw;
      }

      return date.toLocaleString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    }, [paymentDateRaw]);

  /* =========================
     COPY TRANSACTION ID
  ========================= */

  const handleCopy = async () => {
    if (
      !transactionId ||
      transactionId === "N/A"
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        transactionId
      );

      window.alert(
        "Transaction ID copied."
      );
    } catch {
      window.alert(
        "Could not copy the transaction ID."
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="success-page">
        <div className="success-container">

          {/* =========================
              HEADER
          ========================= */}

          <section className="success-header">
            <div className="success-icon">
              <FaCheck
                aria-hidden="true"
              />
            </div>

            <h1>
              Payment Successful!
            </h1>

            <p>
              Your investment has been successfully completed.
            </p>
          </section>

          {/* =========================
              PAYMENT DETAILS
          ========================= */}

          <section className="success-card">
            <h2>
              Payment Details
            </h2>

            <div className="success-details-row">
              <span>
                Project Name
              </span>

              <strong className="success-project-name">
                {projectName}
              </strong>
            </div>

            <div className="success-details-row">
              <span>
                Investor Name
              </span>

              <strong>
                {investorName}
              </strong>
            </div>

            <div className="success-details-row">
              <span>
                Amount Invested
              </span>

              <strong>
                ৳{" "}
                {amount.toLocaleString()}
              </strong>
            </div>

            <div className="success-details-row">
              <span>
                Transaction ID
              </span>

              <div className="success-transaction">
                <strong>
                  {transactionId}
                </strong>

                <button
                  type="button"
                  onClick={
                    handleCopy
                  }
                  aria-label="Copy transaction ID"
                >
                  <FaCopy />
                </button>
              </div>
            </div>

            <div className="success-details-row">
              <span>
                Payment Method
              </span>

              <strong>
                {paymentMethod}
              </strong>
            </div>

            <div className="success-details-row">
              <span>
                Payment Date &amp; Time
              </span>

              <strong>
                {formattedPaymentDate}
              </strong>
            </div>
          </section>

          {/* =========================
              MESSAGE
          ========================= */}

          <section className="success-message">
            <strong>
              Thank you for supporting agriculture!
            </strong>

            <p>
              You will start earning returns once the project is
              completed. You can track your investment from your
              dashboard.
            </p>
          </section>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="success-actions">
            <Link
              to="/investor/dashboard"
              className="success-primary-btn"
            >
              Go to Investment
              <FaArrowRight />
            </Link>

            <Link
              to="/"
              className="success-secondary-btn"
            >
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