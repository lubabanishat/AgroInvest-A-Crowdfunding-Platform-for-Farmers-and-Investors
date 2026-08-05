import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaLock,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import riceProject from "../assets/payment/rice-project.png";
import sslcommerz from "../assets/payment/sslcommerz.png";

import "./Payment.css";

const quickAmounts = [5000, 10000, 15000, 30000];

function Payment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [amount, setAmount] = useState(5000);
  const [agreed, setAgreed] = useState(false);

  const minimumInvestment = 1000;
  const maximumInvestment = 50000;

  const handleAmountChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue === "") {
      setAmount("");
      return;
    }

    const numericValue = Number(inputValue);

    if (!Number.isNaN(numericValue)) {
      setAmount(numericValue);
    }
  };

  const handleProceed = () => {
    if (!agreed) {
      window.alert(
        "Please agree to the Terms & Conditions and Investment Policy."
      );
      return;
    }

    if (
      amount === "" ||
      amount < minimumInvestment ||
      amount > maximumInvestment
    ) {
      window.alert(
        `Investment amount must be between ৳ ${minimumInvestment.toLocaleString()} and ৳ ${maximumInvestment.toLocaleString()}.`
      );
      return;
    }

    navigate("/payment-success", {
      state: {
        projectId: id,
        projectName: "Rice Farming Project",
        investorName: "Akash",
        amount,
        paymentMethod: "SSLCommerz",
      },
    });
  };

  return (
    <>
      <Navbar />

      <main className="payment-page">
        <div className="payment-container">
          <Link
            to={`/projects/${id || 1}`}
            className="payment-back-link"
          >
            ← Back to Project Details
          </Link>

          <div className="payment-heading">
            <h1>Payment</h1>

            <p>
              You are investing in{" "}
              <span>Rice Farming Project</span>
            </p>
          </div>

          <div className="payment-layout">
            <div className="payment-left-column">
              <section className="payment-card payment-summary-card">
                <h2>1. Investment Summary</h2>

                <div className="payment-project-summary">
                  <img
                    src={riceProject}
                    alt="Rice Farming Project"
                  />

                  <div>
                    <h3>Rice Farming Project</h3>
                    <p>Jessore, Bangladesh</p>

                    <span className="payment-verified-badge">
                      <FaCheckCircle />
                      Verified Farmer
                    </span>
                  </div>
                </div>

                <div className="payment-summary-divider" />

                <div className="payment-summary-row">
                  <span>Funding Goal</span>
                  <strong>৳ 25,000</strong>
                </div>

                <div className="payment-summary-row">
                  <span>Raised Amount</span>
                  <strong>৳ 16,000</strong>
                </div>

                <div className="payment-summary-row payment-progress-row">
                  <span>Funding Progress</span>

                  <div className="payment-summary-progress-wrap">
                    <div className="payment-summary-progress">
                      <div style={{ width: "64%" }} />
                    </div>

                    <strong>64%</strong>
                  </div>
                </div>

                <div className="payment-summary-row">
                  <span>Expected Profit</span>
                  <strong>15%</strong>
                </div>

                <div className="payment-summary-row">
                  <span>Project Duration</span>
                  <strong>4 Months</strong>
                </div>

                <div className="payment-summary-row">
                  <span>Expected Harvest</span>
                  <strong>15 Nov 2026</strong>
                </div>
              </section>

              <section className="payment-card payment-amount-card">
                <h2>2. Enter Investment Amount</h2>

                <label htmlFor="investment-amount">
                  Amount (BDT)
                </label>

                <div className="payment-amount-input">
                  <span>৳</span>

                  <input
                    id="investment-amount"
                    type="number"
                    min={minimumInvestment}
                    max={maximumInvestment}
                    step="500"
                    value={amount}
                    onChange={handleAmountChange}
                    aria-describedby="investment-note"
                  />
                </div>

                <div className="payment-quick-amounts">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      type="button"
                      key={quickAmount}
                      className={
                        amount === quickAmount ? "active" : ""
                      }
                      onClick={() => setAmount(quickAmount)}
                    >
                      ৳ {quickAmount.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="payment-note" id="investment-note">
                  <FaExclamationCircle />

                  <div>
                    <strong>Note:</strong>
                    <p>
                      The minimum investment amount is ৳
                      {minimumInvestment.toLocaleString()}.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <section className="payment-card payment-method-card">
              <h2>3. Payment Method</h2>

              <article className="payment-gateway-option">
                <div>
                  <h3>SSLCommerz</h3>
                  <p>Secure payment gateway</p>
                </div>

                <img src={sslcommerz} alt="SSLCommerz" />
              </article>

              <div className="payment-methods-list">
                <p>Accepted Methods:</p>

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

          <section className="payment-confirmation">
            <label className="payment-terms">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) =>
                  setAgreed(event.target.checked)
                }
              />

              <span>
                I agree to the{" "}
                <a href="#terms">Terms & Conditions</a> and{" "}
                <a href="#policy">Investment Policy</a>
              </span>
            </label>

            <button
              type="button"
              className="payment-proceed-btn"
              onClick={handleProceed}
            >
              Proceed to Payment →
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Payment;