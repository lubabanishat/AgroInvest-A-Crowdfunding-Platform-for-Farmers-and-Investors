import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

const API_URL =
  "https://agroinvest-backend-q6hl.onrender.com/api";

function PaymentSuccess() {
  const [searchParams] =
    useSearchParams();

  // ==========================================
  // URL Parameters
  // ==========================================

  const investmentId =
    searchParams.get("investmentId") ||
    "";

  const transactionId =
    searchParams.get("transactionId") ||
    "N/A";

  const projectId =
    searchParams.get("projectId") ||
    "";

  const investorId =
    searchParams.get("investorId") ||
    "";

  const amountFromUrl =
    Number(
      searchParams.get("amount")
    ) || 0;

  const paymentMethod =
    searchParams.get("paymentMethod") ||
    "SSLCommerz";

  const paymentDateRaw =
    searchParams.get("paymentDate");

  // ==========================================
  // Investment Details From Database
  // ==========================================

  const [
    investmentDetails,
    setInvestmentDetails,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // ==========================================
  // Get Previously Saved Payment Info
  // ==========================================

  const pendingInvestment =
    useMemo(() => {
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

  // ==========================================
  // Fetch Actual Investment Details
  // ==========================================

  useEffect(() => {
    const fetchInvestmentDetails =
      async () => {
        if (!investmentId) {
          setLoading(false);
          return;
        }

        try {
          const response =
            await fetch(
              `${API_URL}/investments/${investmentId}`
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to load investment details."
            );
          }

          setInvestmentDetails(
            data.investment
          );
        } catch (error) {
          console.error(
            "Investment details fetch error:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchInvestmentDetails();
  }, [investmentId]);

  // ==========================================
  // Actual Project Name
  // ==========================================

  const projectName =
    investmentDetails?.project_name ||
    pendingInvestment?.projectName ||
    (projectId
      ? `Project #${projectId}`
      : "Project");

  // ==========================================
  // Actual Investor Name
  // ==========================================

  const investorName =
    investmentDetails?.investor_name ||
    pendingInvestment?.investorName ||
    (investorId
      ? `Investor #${investorId}`
      : "Investor");

  // ==========================================
  // Actual Investment Amount
  // ==========================================

  const amount =
    Number(
      investmentDetails?.amount
    ) ||
    amountFromUrl;

  // ==========================================
  // Format Payment Date
  // ==========================================

  const formattedPaymentDate =
    useMemo(() => {
      const dateValue =
        paymentDateRaw ||
        investmentDetails?.created_at;

      if (!dateValue) {
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
        new Date(dateValue);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return dateValue;
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
    }, [
      paymentDateRaw,
      investmentDetails,
    ]);

  // ==========================================
  // Copy Transaction ID
  // ==========================================

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
    } catch (error) {
      console.error(
        "Copy error:",
        error
      );

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

          {/* HEADER */}

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
              Your investment has been
              successfully completed.
            </p>
          </section>

          {/* PAYMENT DETAILS */}

          <section className="success-card">
            <h2>
              Payment Details
            </h2>

            <div className="success-details-row">
              <span>
                Project Name
              </span>

              <strong className="success-project-name">
                {loading
                  ? "Loading..."
                  : projectName}
              </strong>
            </div>

            <div className="success-details-row">
              <span>
                Investor Name
              </span>

              <strong>
                {loading
                  ? "Loading..."
                  : investorName}
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

          {/* MESSAGE */}

          <section className="success-message">
            <strong>
              Thank you for supporting
              agriculture!
            </strong>

            <p>
              You will start earning
              returns once the project is
              completed. You can track
              your investment from your
              dashboard.
            </p>
          </section>

          {/* ACTION BUTTONS */}

          <div className="success-actions">
            <Link
              to="/investor/my-investments"
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