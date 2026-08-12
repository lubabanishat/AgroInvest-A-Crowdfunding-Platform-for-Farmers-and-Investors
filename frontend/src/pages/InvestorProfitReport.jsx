import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  FaClipboardList,
  FaCheckCircle,
  FaArrowLeft,
  FaExclamationCircle,
} from "react-icons/fa";

import "./InvestorProfitReport.css";

const API_URL =
  "http://localhost:5000/api";

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
   MONEY FORMAT
========================= */

const formatMoney = (amount) => {
  return `৳ ${Number(
    amount || 0
  ).toLocaleString(
    "en-BD",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  )}`;
};

/* =========================
   INVESTOR PROFIT REPORT
========================= */

function InvestorProfitReport() {
  const [searchParams] =
    useSearchParams();

  const projectIdFromUrl =
    searchParams.get(
      "projectId"
    );

  const [
    completedProjects,
    setCompletedProjects,
  ] = useState([]);

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] = useState(
    projectIdFromUrl || ""
  );

  const [
    report,
    setReport,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    reportLoading,
    setReportLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /* =========================
     FETCH COMPLETED PROJECTS
  ========================= */

  useEffect(() => {
    const fetchCompletedProjects =
      async () => {
        try {
          setLoading(true);
          setError("");

          const token =
            getToken();

          if (!token) {
            throw new Error(
              "Please login as an investor."
            );
          }

          const response =
            await fetch(
              `${API_URL}/investments/my-investments`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to load investments."
            );
          }

          const allInvestments =
            Array.isArray(
              data.investments
            )
              ? data.investments
              : [];

          /*
            Only successful investments
            whose project has actually
            been completed by Admin.
          */

          const completed =
            allInvestments.filter(
              (investment) =>
                investment.payment_status ===
                  "completed" &&
                investment.project_status ===
                  "completed"
            );

          /*
            Same project-e investor
            multiple times invest korle
            duplicate project dropdown-e
            dekhabo na.
          */

          const uniqueProjects = [];

          const seenProjectIds =
            new Set();

          completed.forEach(
            (investment) => {
              if (
                !seenProjectIds.has(
                  investment.project_id
                )
              ) {
                seenProjectIds.add(
                  investment.project_id
                );

                uniqueProjects.push(
                  investment
                );
              }
            }
          );

          setCompletedProjects(
            uniqueProjects
          );

          /*
            URL-e projectId thakle
            oi project open korbe.

            Na thakle latest completed
            project automatically open.
          */

          if (
            projectIdFromUrl
          ) {
            setSelectedProjectId(
              String(
                projectIdFromUrl
              )
            );
          } else if (
            uniqueProjects.length >
            0
          ) {
            setSelectedProjectId(
              String(
                uniqueProjects[0]
                  .project_id
              )
            );
          }
        } catch (err) {
          console.error(
            "Completed investment fetch error:",
            err
          );

          setError(
            err.message
          );
        } finally {
          setLoading(false);
        }
      };

    fetchCompletedProjects();
  }, [projectIdFromUrl]);

  /* =========================
     FETCH PROFIT REPORT
  ========================= */

  useEffect(() => {
    if (
      !selectedProjectId
    ) {
      setReport(null);
      return;
    }

    const fetchProfitReport =
      async () => {
        try {
          setReportLoading(
            true
          );

          setError("");

          const token =
            getToken();

          if (!token) {
            throw new Error(
              "Please login as an investor."
            );
          }

          const response =
            await fetch(
              `${API_URL}/profits/investor/${selectedProjectId}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to load profit report."
            );
          }

          setReport(data);
        } catch (err) {
          console.error(
            "Investor profit report error:",
            err
          );

          setReport(null);

          setError(
            err.message
          );
        } finally {
          setReportLoading(
            false
          );
        }
      };

    fetchProfitReport();
  }, [selectedProjectId]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
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
            <p>
              Loading profit report...
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="profit-report-page">
      <div className="profit-report-wrapper">

        {/* BACK */}

        <Link
          to="/investor/dashboard"
          className="profit-report-back"
        >
          <FaArrowLeft />

          Back to Dashboard
        </Link>

        {/* =========================
            NO COMPLETED PROJECT
        ========================= */}

        {completedProjects.length ===
          0 && (
          <section className="profit-report-box">

            <header className="profit-report-heading">

              <div className="profit-report-heading-icon">
                <FaClipboardList />
              </div>

              <div>
                <h1>
                  Profit Report
                </h1>

                <p>
                  No completed project
                  report is available yet.
                </p>
              </div>

            </header>

            <div className="profit-report-message">

              <FaExclamationCircle />

              <p>
                Your profit report will
                appear here after a project
                is completed and the admin
                publishes the final revenue.
              </p>

            </div>

          </section>
        )}

        {/* =========================
            REPORT
        ========================= */}

        {completedProjects.length >
          0 && (
          <section className="profit-report-box">

            {/* HEADER */}

            <header className="profit-report-heading">

              <div className="profit-report-heading-icon">
                <FaClipboardList />
              </div>

              <div>
                <h1>
                  Profit Report
                  {report?.project_name
                    ? ` - ${report.project_name}`
                    : ""}
                </h1>

                <p>
                  Project Status:{" "}
                  {report?.project_status ===
                  "completed"
                    ? "Completed"
                    : "Report Available"}
                </p>
              </div>

            </header>

            {/* =========================
                PROJECT SELECTOR
            ========================= */}

            {completedProjects.length >
              1 && (
              <div
                style={{
                  marginBottom:
                    "24px",
                }}
              >
                <label
                  htmlFor="profit-project"
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "8px",
                    fontWeight:
                      "600",
                  }}
                >
                  Select Project
                </label>

                <select
                  id="profit-project"
                  value={
                    selectedProjectId
                  }
                  onChange={(
                    event
                  ) =>
                    setSelectedProjectId(
                      event.target.value
                    )
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "11px 12px",
                    border:
                      "1px solid #d8d8d8",
                    borderRadius:
                      "6px",
                    fontFamily:
                      "inherit",
                  }}
                >
                  {completedProjects.map(
                    (project) => (
                      <option
                        key={
                          project.project_id
                        }
                        value={
                          project.project_id
                        }
                      >
                        {
                          project.title
                        }
                      </option>
                    )
                  )}
                </select>

              </div>
            )}

            {/* LOADING REPORT */}

            {reportLoading && (
              <div
                style={{
                  padding:
                    "25px 0",
                  textAlign:
                    "center",
                }}
              >
                Loading report details...
              </div>
            )}

            {/* ERROR */}

            {!reportLoading &&
              error && (
                <div
                  style={{
                    padding:
                      "14px 16px",
                    marginBottom:
                      "18px",
                    color:
                      "#b42318",
                    background:
                      "#fee4e2",
                    borderRadius:
                      "7px",
                  }}
                >
                  {error}
                </div>
              )}

            {/* =========================
                REAL REPORT DATA
            ========================= */}

            {!reportLoading &&
              report && (
                <>

                  <div className="profit-report-details">

                    {/* INVESTED AMOUNT */}

                    <div className="profit-detail-row">

                      <span>
                        Invested Amount
                      </span>

                      <strong>
                        {formatMoney(
                          report.invested_amount
                        )}
                      </strong>

                    </div>

                    {/* INVESTMENT RATIO */}

                    <div className="profit-detail-row">

                      <span>
                        Investment Ratio
                      </span>

                      <strong>
                        {Number(
                          report.investment_ratio ||
                            0
                        ).toFixed(
                          2
                        )}
                        %
                      </strong>

                    </div>

                    {/* PROJECT TOTAL INVESTMENT */}

                    <div className="profit-detail-row">

                      <span>
                        Project Total Investment
                      </span>

                      <strong>
                        {formatMoney(
                          report.project_total_investment
                        )}
                      </strong>

                    </div>

                    {/* TOTAL REVENUE */}

                    <div className="profit-detail-row">

                      <span>
                        Project Revenue
                      </span>

                      <strong>
                        {formatMoney(
                          report.total_revenue
                        )}
                      </strong>

                    </div>

                    {/* NET PROFIT */}

                    <div className="profit-detail-row">

                      <span>
                        Project Net Profit
                      </span>

                      <strong>
                        {formatMoney(
                          report.net_profit
                        )}
                      </strong>

                    </div>

                    {/* INVESTOR POOL */}

                    <div className="profit-detail-row">

                      <span>
                        Investors&apos; Profit Pool
                        (30%)
                      </span>

                      <strong>
                        {formatMoney(
                          report.investor_profit_pool
                        )}
                      </strong>

                    </div>

                    {/* PROFIT EARNED */}

                    <div className="profit-detail-row">

                      <span>
                        Your Profit Earned
                      </span>

                      <strong>
                        {formatMoney(
                          report.profit_earned
                        )}
                      </strong>

                    </div>

                    {/* TOTAL RETURN */}

                    <div className="profit-detail-row">

                      <span>
                        Total Returned
                      </span>

                      <strong>
                        {formatMoney(
                          report.total_returned
                        )}
                      </strong>

                    </div>

                    {/* PAYMENT STATUS */}

                    <div className="profit-detail-row">

                      <span>
                        Payment Status
                      </span>

                      <strong>
                        {
                          report.payment_status
                        }
                      </strong>

                    </div>

                  </div>

                  {/* SUCCESS MESSAGE */}

                  <div className="profit-report-message">

                    <FaCheckCircle />

                    <p>
                      Your profit was calculated
                      from the investors&apos;
                      30% profit pool according
                      to your investment ratio.
                    </p>

                  </div>

                </>
              )}

          </section>
        )}

      </div>
    </main>
  );
}

export default InvestorProfitReport;