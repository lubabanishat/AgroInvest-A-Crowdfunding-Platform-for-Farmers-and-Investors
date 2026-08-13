import {
  useEffect,
  useState,
} from "react";

import {
  FaArrowLeft,
  FaClipboardList,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import "./FarmerProfitReport.css";

const API_URL =
  "https://agroinvest-backend-q6hl.onrender.com/api";

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
   FARMER PROFIT REPORT
========================= */

function FarmerProfitReport() {
  const [searchParams] =
    useSearchParams();

  const projectIdFromUrl =
    searchParams.get(
      "projectId"
    );

  const [
    farmerProjects,
    setFarmerProjects,
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
     FETCH FARMER PROJECTS
  ========================= */

  useEffect(() => {
    const fetchFarmerProjects =
      async () => {
        try {
          setLoading(true);
          setError("");

          const token =
            getToken();

          if (!token) {
            throw new Error(
              "Please login as a farmer."
            );
          }

          /*
            Use the SAME API as Farmer Dashboard.
            This API already returns the farmer's
            real projects and statuses.
          */

          const response =
            await fetch(
              `${API_URL}/farmer/dashboard`,
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
                "Failed to load farmer projects."
            );
          }

          const allProjects =
            Array.isArray(
              data.projects
            )
              ? data.projects
              : [];

          /*
            Only completed projects
            can have final profit reports.
          */

          const completedProjects =
            allProjects.filter(
              (project) =>
                project.status ===
                "completed"
            );

          setFarmerProjects(
            completedProjects
          );

          /*
            If URL contains projectId,
            use it only if it belongs to
            a completed farmer project.
          */

          if (
            projectIdFromUrl &&
            completedProjects.some(
              (project) =>
                String(project.id) ===
                String(projectIdFromUrl)
            )
          ) {
            setSelectedProjectId(
              String(
                projectIdFromUrl
              )
            );
          } else if (
            completedProjects.length >
            0
          ) {
            /*
              Otherwise automatically
              show the latest completed project.
            */

            setSelectedProjectId(
              String(
                completedProjects[0].id
              )
            );
          } else {
            setSelectedProjectId(
              ""
            );
          }
        } catch (err) {
          console.error(
            "Farmer projects fetch error:",
            err
          );

          setFarmerProjects(
            []
          );

          setSelectedProjectId(
            ""
          );

          setError(
            err.message
          );
        } finally {
          setLoading(false);
        }
      };

    fetchFarmerProjects();
  }, [projectIdFromUrl]);

  /* =========================
     FETCH PROFIT REPORT
  ========================= */

  useEffect(() => {
    if (!selectedProjectId) {
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
              "Please login as a farmer."
            );
          }

          const response =
            await fetch(
              `${API_URL}/profits/farmer/${selectedProjectId}`,
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

          setReport(
            data
          );
        } catch (err) {
          console.error(
            "Farmer profit report error:",
            err
          );

          setReport(
            null
          );

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
      <main className="farmer-profit-report-page">
        <div className="farmer-profit-report-wrapper">

          <Link
            to="/farmer/dashboard"
            className="farmer-profit-back-button"
          >
            <FaArrowLeft />

            <span>
              Back to Dashboard
            </span>
          </Link>

          <section className="farmer-profit-report-card">
            <p>
              Loading profit report...
            </p>
          </section>

        </div>
      </main>
    );
  }

  return (
    <main className="farmer-profit-report-page">
      <div className="farmer-profit-report-wrapper">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <Link
          to="/farmer/dashboard"
          className="farmer-profit-back-button"
        >
          <FaArrowLeft />

          <span>
            Back to Dashboard
          </span>
        </Link>

        {/* =========================
            NO COMPLETED PROJECT
        ========================= */}

        {farmerProjects.length ===
          0 && (
          <section className="farmer-profit-report-card">

            <header className="farmer-profit-report-header">

              <div className="farmer-profit-report-icon">
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

            {error ? (
              <div
                style={{
                  padding:
                    "14px 16px",
                  marginTop:
                    "20px",
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
            ) : (
              <div className="farmer-profit-success-message">

                <FaExclamationCircle />

                <p>
                  Your profit report will
                  appear here after a project
                  is completed and the admin
                  publishes the final revenue.
                </p>

              </div>
            )}

          </section>
        )}

        {/* =========================
            REPORT
        ========================= */}

        {farmerProjects.length >
          0 && (
          <section className="farmer-profit-report-card">

            {/* =========================
                HEADER
            ========================= */}

            <header className="farmer-profit-report-header">

              <div className="farmer-profit-report-icon">
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

            {farmerProjects.length >
              1 && (
              <div
                style={{
                  marginBottom:
                    "24px",
                }}
              >

                <label
                  htmlFor="farmer-profit-project"
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
                  id="farmer-profit-project"
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

                  {farmerProjects.map(
                    (project) => (
                      <option
                        key={
                          project.id
                        }
                        value={
                          project.id
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

            {/* =========================
                LOADING REPORT
            ========================= */}

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

            {/* =========================
                ERROR
            ========================= */}

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
                REAL PROFIT REPORT
            ========================= */}

            {!reportLoading &&
              report && (
                <>

                  <section
                    className="farmer-profit-report-table"
                    aria-label="Farmer profit report details"
                  >

                    {/* FUNDING GOAL */}

                    <div className="farmer-profit-report-row">

                      <span>
                        Funding Goal
                      </span>

                      <strong>
                        {formatMoney(
                          report.funding_goal
                        )}
                      </strong>

                    </div>

                    {/* TOTAL INVESTMENT */}

                    <div className="farmer-profit-report-row">

                      <span>
                        Total Investment
                      </span>

                      <strong>
                        {formatMoney(
                          report.total_investment
                        )}
                      </strong>

                    </div>

                    {/* FUNDING PERCENTAGE */}

                    <div className="farmer-profit-report-row">

                      <span>
                        Funding Percentage
                      </span>

                      <strong>
                        {Number(
                          report.funding_percentage ||
                            0
                        ).toFixed(
                          2
                        )}
                        %
                      </strong>

                    </div>

                    {/* TOTAL REVENUE */}

                    <div className="farmer-profit-report-row">

                      <span>
                        Total Revenue
                      </span>

                      <strong>
                        {formatMoney(
                          report.total_revenue
                        )}
                      </strong>

                    </div>

                    {/* NET PROFIT */}

                    <div className="farmer-profit-report-row">

                      <span>
                        Net Profit
                      </span>

                      <strong>
                        {formatMoney(
                          report.net_profit
                        )}
                      </strong>

                    </div>

                    {/* FARMER SHARE */}

                    <div className="farmer-profit-report-row">

                      <span>
                        Farmer Share (70%)
                      </span>

                      <strong>
                        {formatMoney(
                          report.farmer_share
                        )}
                      </strong>

                    </div>

                    {/* INVESTOR SHARE */}

                    <div className="farmer-profit-report-row">

                      <span>
                        Investor Share (30%)
                      </span>

                      <strong>
                        {formatMoney(
                          report.investor_share
                        )}
                      </strong>

                    </div>

                    {/* DISTRIBUTION STATUS */}

                    <div className="farmer-profit-report-row">

                      <span>
                        Distribution Status
                      </span>

                      <strong>
                        {report.profit_distributed
                          ? "Distributed"
                          : "Pending"}
                      </strong>

                    </div>

                  </section>

                  {/* =========================
                      SUCCESS MESSAGE
                  ========================= */}

                  <div className="farmer-profit-success-message">

                    <FaCheckCircle />

                    <p>
                      Profit has been distributed
                      according to the 70% farmer
                      and 30% investor profit
                      sharing ratio.
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

export default FarmerProfitReport;