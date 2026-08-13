import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  FaCheckCircle,
  FaExclamationCircle,
  FaLock,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import sslcommerz from "../assets/payment/sslcommerz.png";

import "./Payment.css";

const API_URL = "https://agroinvest-backend-q6hl.onrender.com/api";
const BACKEND_URL = "https://agroinvest-backend-q6hl.onrender.com";

const quickAmounts = [
  5000,
  10000,
  15000,
  30000,
];

/* =========================
   DATE FORMAT
========================= */

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================
   PROJECT IMAGE
========================= */

const getProjectImageUrl = (project) => {
  if (!project?.land_image) {
    return "";
  }

  const normalizedPath =
    project.land_image.replace(/\\/g, "/");

  return `${BACKEND_URL}/${normalizedPath}`;
};

/* =========================
   PAYMENT
========================= */

function Payment() {
  const { id } = useParams();

  const [project, setProject] =
    useState(null);

  const [amount, setAmount] =
    useState(5000);

  const [agreed, setAgreed] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState("");

  const minimumInvestment = 1000;
  const maximumInvestment = 50000;

  /* =========================
     GET TOKEN
  ========================= */

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  /* =========================
     GET USER
  ========================= */

  const getUser = () => {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error(
        "User parse error:",
        error
      );

      return null;
    }
  };

  /* =========================
     FETCH PROJECT
  ========================= */

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/projects/${id}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load project."
          );
        }

        setProject(data.project);
      } catch (err) {
        console.error(
          "Payment project fetch error:",
          err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  /* =========================
     AMOUNT CHANGE
  ========================= */

  const handleAmountChange = (
    event
  ) => {
    const inputValue =
      event.target.value;

    if (inputValue === "") {
      setAmount("");
      return;
    }

    const numericValue =
      Number(inputValue);

    if (
      !Number.isNaN(numericValue)
    ) {
      setAmount(numericValue);
    }
  };

  /* =========================
     PROCEED TO PAYMENT
  ========================= */

  const handleProceed = async () => {
    if (!project) {
      return;
    }

    setError("");

    /* =========================
       LOGIN CHECK
    ========================= */

    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      setError(
        "Please login as an investor before making an investment."
      );

      return;
    }

    /* =========================
       ROLE CHECK
    ========================= */

    if (user.role !== "investor") {
      setError(
        "Only investors can invest in projects."
      );

      return;
    }

    /* =========================
       TERMS CHECK
    ========================= */

    if (!agreed) {
      window.alert(
        "Please agree to the Terms & Conditions and Investment Policy."
      );

      return;
    }

    /* =========================
       AMOUNT VALIDATION
    ========================= */

    const numericAmount =
      Number(amount);

    if (
      amount === "" ||
      !Number.isFinite(numericAmount) ||
      numericAmount <
        minimumInvestment ||
      numericAmount >
        maximumInvestment
    ) {
      window.alert(
        `Investment amount must be between ৳ ${minimumInvestment.toLocaleString()} and ৳ ${maximumInvestment.toLocaleString()}.`
      );

      return;
    }

    /* =========================
       REMAINING AMOUNT
    ========================= */

    const fundingGoal =
      Number(
        project.target_amount
      ) || 0;

    const raisedAmount =
      Number(
        project.raised_amount
      ) || 0;

    const remainingAmount =
      Math.max(
        fundingGoal -
          raisedAmount,
        0
      );

    if (
      numericAmount >
      remainingAmount
    ) {
      window.alert(
        `Only ৳ ${remainingAmount.toLocaleString()} is remaining for this project.`
      );

      return;
    }

    try {
      setProcessing(true);

      /* =========================
         STEP 1
         CREATE PENDING INVESTMENT
      ========================= */

      const investmentResponse =
        await fetch(
          `${API_URL}/investments/invest`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              project_id:
                project.id,

              amount:
                numericAmount,
            }),
          }
        );

      const investmentData =
        await investmentResponse.json();

      if (
        investmentResponse.status ===
        401
      ) {
        throw new Error(
          "Your login session has expired. Please login again."
        );
      }

      if (
        investmentResponse.status ===
        403
      ) {
        throw new Error(
          investmentData.message ||
            "Only investors can invest."
        );
      }

      if (
        !investmentResponse.ok
      ) {
        throw new Error(
          investmentData.message ||
            "Failed to create investment."
        );
      }

      const investment =
        investmentData.investment;

      if (!investment?.id) {
        throw new Error(
          "Investment was created but no investment ID was returned."
        );
      }

      /* =========================
         STEP 2
         INITIATE SSLCOMMERZ
      ========================= */

      const paymentResponse =
        await fetch(
          `${API_URL}/payments/initiate`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              investment_id:
                investment.id,

              amount:
                numericAmount,
            }),
          }
        );

      const paymentData =
        await paymentResponse.json();

      if (
        paymentResponse.status ===
        401
      ) {
        throw new Error(
          "Your login session has expired. Please login again."
        );
      }

      if (
        paymentResponse.status ===
        403
      ) {
        throw new Error(
          paymentData.message ||
            "Payment access denied."
        );
      }

      if (
        !paymentResponse.ok
      ) {
        throw new Error(
          paymentData.message ||
            "Failed to initiate SSLCommerz payment."
        );
      }

      /* =========================
         STEP 3
         GET GATEWAY URL
      ========================= */

      if (
        !paymentData.payment_url
      ) {
        throw new Error(
          "SSLCommerz payment URL was not returned."
        );
      }

      /*
        Store basic information temporarily.

        We can use this later on the
        Payment Success page.
      */

      sessionStorage.setItem(
        "pendingInvestment",
        JSON.stringify({
          investmentId:
            investment.id,

          projectId:
            project.id,

          projectName:
            project.title,

          investorName:
            user.full_name ||
            "Investor",

          amount:
            numericAmount,

          paymentMethod:
            "SSLCommerz",
        })
      );

      /* =========================
         STEP 4
         REDIRECT TO SSLCOMMERZ
      ========================= */

      window.location.href =
        paymentData.payment_url;

    } catch (err) {
      console.error(
        "Payment process error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while processing the payment."
      );
    } finally {
      setProcessing(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="payment-page">
          <div className="payment-container">

            <Link
              to={`/projects/${id}`}
              className="payment-back-link"
            >
              ← Back to Project Details
            </Link>

            <div
              style={{
                padding:
                  "80px 20px",

                textAlign:
                  "center",
              }}
            >
              Loading payment information...
            </div>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* =========================
     PROJECT LOAD ERROR
  ========================= */

  if (!project) {
    return (
      <>
        <Navbar />

        <main className="payment-page">
          <div className="payment-container">

            <Link
              to={`/projects/${id}`}
              className="payment-back-link"
            >
              ← Back to Project Details
            </Link>

            <div
              style={{
                marginTop:
                  "30px",

                padding:
                  "20px",

                color:
                  "#b42318",

                textAlign:
                  "center",

                backgroundColor:
                  "#fee4e2",

                borderRadius:
                  "8px",
              }}
            >
              {error ||
                "Project not found."}
            </div>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* =========================
     PROJECT VALUES
  ========================= */

  const fundingGoal =
    Number(
      project.target_amount
    ) || 0;

  const raisedAmount =
    Number(
      project.raised_amount
    ) || 0;

  const remainingAmount =
    Math.max(
      fundingGoal -
        raisedAmount,
      0
    );

  const fundingPercentage =
    fundingGoal > 0
      ? Math.min(
          100,
          Math.round(
            (raisedAmount /
              fundingGoal) *
              100
          )
        )
      : 0;

  const projectImageUrl =
    getProjectImageUrl(project);

  return (
    <>
      <Navbar />

      <main className="payment-page">
        <div className="payment-container">

          {/* BACK */}

          <Link
            to={`/projects/${project.id}`}
            className="payment-back-link"
          >
            ← Back to Project Details
          </Link>

          {/* HEADING */}

          <div className="payment-heading">
            <h1>
              Payment
            </h1>

            <p>
              You are investing in{" "}
              <span>
                {project.title}
              </span>
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div
              style={{
                marginBottom:
                  "18px",

                padding:
                  "12px 16px",

                color:
                  "#b42318",

                fontSize:
                  "12px",

                backgroundColor:
                  "#fee4e2",

                borderRadius:
                  "7px",
              }}
            >
              {error}
            </div>
          )}

          <div className="payment-layout">

            {/* LEFT COLUMN */}

            <div className="payment-left-column">

              {/* SUMMARY */}

              <section className="payment-card payment-summary-card">

                <h2>
                  1. Investment Summary
                </h2>

                <div className="payment-project-summary">

                  {projectImageUrl ? (
                    <img
                      src={
                        projectImageUrl
                      }
                      alt={
                        project.title
                      }
                    />
                  ) : (
                    <div
                      style={{
                        width:
                          "110px",

                        minHeight:
                          "80px",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        background:
                          "#eef5ee",

                        borderRadius:
                          "6px",

                        fontSize:
                          "10px",

                        color:
                          "#777777",
                      }}
                    >
                      No Image
                    </div>
                  )}

                  <div>
                    <h3>
                      {project.title}
                    </h3>

                    <p>
                      Bangladesh
                    </p>

                    <span className="payment-verified-badge">
                      <FaCheckCircle />

                      Verified Farmer
                    </span>
                  </div>

                </div>

                <div className="payment-summary-divider" />

                <div className="payment-summary-row">
                  <span>
                    Funding Goal
                  </span>

                  <strong>
                    ৳{" "}
                    {fundingGoal.toLocaleString()}
                  </strong>
                </div>

                <div className="payment-summary-row">
                  <span>
                    Raised Amount
                  </span>

                  <strong>
                    ৳{" "}
                    {raisedAmount.toLocaleString()}
                  </strong>
                </div>

                <div className="payment-summary-row">
                  <span>
                    Remaining Amount
                  </span>

                  <strong>
                    ৳{" "}
                    {remainingAmount.toLocaleString()}
                  </strong>
                </div>

                <div className="payment-summary-row payment-progress-row">

                  <span>
                    Funding Progress
                  </span>

                  <div className="payment-summary-progress-wrap">

                    <div className="payment-summary-progress">
                      <div
                        style={{
                          width:
                            `${fundingPercentage}%`,
                        }}
                      />
                    </div>

                    <strong>
                      {fundingPercentage}%
                    </strong>

                  </div>
                </div>

                <div className="payment-summary-row">
                  <span>
                    Expected Profit
                  </span>

                  <strong>
                    15%
                  </strong>
                </div>

                <div className="payment-summary-row">
                  <span>
                    Crop Type
                  </span>

                  <strong>
                    {project.crop_type}
                  </strong>
                </div>

                <div className="payment-summary-row">
                  <span>
                    Expected Harvest
                  </span>

                  <strong>
                    {formatDate(
                      project.deadline
                    )}
                  </strong>
                </div>

              </section>

              {/* AMOUNT */}

              <section className="payment-card payment-amount-card">

                <h2>
                  2. Enter Investment Amount
                </h2>

                <label htmlFor="investment-amount">
                  Amount (BDT)
                </label>

                <div className="payment-amount-input">

                  <span>
                    ৳
                  </span>

                  <input
                    id="investment-amount"
                    type="number"
                    min={
                      minimumInvestment
                    }
                    max={
                      maximumInvestment
                    }
                    step="500"
                    value={
                      amount
                    }
                    onChange={
                      handleAmountChange
                    }
                    aria-describedby="investment-note"
                  />

                </div>

                <div className="payment-quick-amounts">

                  {quickAmounts.map(
                    (
                      quickAmount
                    ) => (
                      <button
                        type="button"
                        key={
                          quickAmount
                        }
                        className={
                          amount ===
                          quickAmount
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setAmount(
                            quickAmount
                          )
                        }
                      >
                        ৳{" "}
                        {quickAmount.toLocaleString()}
                      </button>
                    )
                  )}

                </div>

                <div
                  className="payment-note"
                  id="investment-note"
                >

                  <FaExclamationCircle />

                  <div>
                    <strong>
                      Note:
                    </strong>

                    <p>
                      The minimum investment amount is ৳
                      {minimumInvestment.toLocaleString()}.
                    </p>
                  </div>

                </div>

              </section>

            </div>

            {/* PAYMENT METHOD */}

            <section className="payment-card payment-method-card">

              <h2>
                3. Payment Method
              </h2>

              <article className="payment-gateway-option">

                <div>
                  <h3>
                    SSLCommerz
                  </h3>

                  <p>
                    Secure payment gateway
                  </p>
                </div>

                <img
                  src={sslcommerz}
                  alt="SSLCommerz"
                />

              </article>

              <div className="payment-methods-list">

                <p>
                  Accepted Methods:
                </p>

                <ul>
                  <li>Visa</li>
                  <li>Mastercard</li>
                  <li>bKash</li>
                  <li>Nagad</li>
                </ul>

              </div>

              <div className="payment-security-box">

                <FaLock />

                <div>
                  <strong>
                    Your payment information is secure
                  </strong>

                  <p>
                    We do not share your payment details.
                  </p>
                </div>

              </div>

            </section>

          </div>

          {/* CONFIRMATION */}

          <section className="payment-confirmation">

            <label className="payment-terms">

              <input
                type="checkbox"
                checked={
                  agreed
                }
                onChange={(
                  event
                ) =>
                  setAgreed(
                    event.target.checked
                  )
                }
              />

              <span>
                I agree to the{" "}
                <a href="#terms">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#policy">
                  Investment Policy
                </a>
              </span>

            </label>

            <button
              type="button"
              className="payment-proceed-btn"
              onClick={
                handleProceed
              }
              disabled={
                processing
              }
            >
              {processing
                ? "Connecting to SSLCommerz..."
                : "Proceed to Payment →"}
            </button>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Payment;