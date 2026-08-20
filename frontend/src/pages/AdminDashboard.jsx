import { useEffect, useState } from "react";

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
  FaFileAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import adminLogo from "../assets/admin-dashboard/logo.png";
import riceImg from "../assets/admin-dashboard/rice.png";
import vegetableImg from "../assets/admin-dashboard/vegetable.png";
import maizeImg from "../assets/admin-dashboard/maize.png";

import "./AdminDashboard.css";

const API_URL =
  "https://agroinvest-backend-q6hl.onrender.com/api";

const BACKEND_URL =
  "https://agroinvest-backend-q6hl.onrender.com";

/* =========================
   PROJECT IMAGE HELPER
========================= */

const getProjectImage = (
  projectOrCrop = ""
) => {
  if (
    typeof projectOrCrop === "object" &&
    projectOrCrop !== null
  ) {
    if (
      projectOrCrop.land_image_url
    ) {
      return projectOrCrop.land_image_url;
    }
  }

  const crop =
    typeof projectOrCrop === "string"
      ? projectOrCrop.toLowerCase()
      : String(
          projectOrCrop?.crop_type || ""
        ).toLowerCase();

  if (crop.includes("rice")) {
    return riceImg;
  }

  if (
    crop.includes("vegetable") ||
    crop.includes("chilli") ||
    crop.includes("chili") ||
    crop.includes("tomato") ||
    crop.includes("potato")
  ) {
    return vegetableImg;
  }

  if (
    crop.includes("maize") ||
    crop.includes("corn")
  ) {
    return maizeImg;
  }

  return vegetableImg;
};

/* =========================
   DATE FORMAT HELPER
========================= */

const formatDate = (
  dateValue
) => {
  if (!dateValue) {
    return "N/A";
  }

  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "N/A";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

/* =========================
   DOCUMENT NAME HELPER
========================= */

const getDocumentName = (
  documentType
) => {
  if (
    documentType === "NID"
  ) {
    return "National ID (NID)";
  }

  if (
    documentType === "LAND_DEED"
  ) {
    return "Land Ownership Deed";
  }

  if (
    documentType === "LAND_IMAGE"
  ) {
    return "Land Image";
  }

  return documentType;
};

/* =========================
   DOCUMENT URL HELPER
========================= */

const getDocumentUrl = (
  document
) => {
  if (!document) {
    return "#";
  }

  if (document.file_path) {
    const cleanPath =
      String(
        document.file_path
      )
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");

    return `${BACKEND_URL}/${cleanPath}`;
  }

  if (document.file_url) {
    return document.file_url.replace(
      /^https?:\/\/localhost:5000/,
      BACKEND_URL
    );
  }

  return "#";
};

/* =========================
   MONEY FORMAT
========================= */

const formatMoney = (
  amount
) => {
  return `৳ ${Number(
    amount || 0
  ).toLocaleString()}`;
};

/* =========================
   ADMIN DASHBOARD
========================= */

function AdminDashboard() {
  const navigate =
    useNavigate();

  /* =========================
     FARMER / PROJECT STATE
  ========================= */

  const [
    pendingFarmers,
    setPendingFarmers,
  ] = useState([]);

  const [
    pendingProjects,
    setPendingProjects,
  ] = useState([]);

  const [
    dashboardData,
    setDashboardData,
  ] = useState({
    totalFarmers: 0,
    totalInvestors: 0,
    totalProjects: 0,
    pendingProjects: 0,
    approvedProjects: 0,
    rejectedProjects: 0,
    completedProjects: 0,
    pendingFarmers: 0,
  });

  const [
    farmersLoading,
    setFarmersLoading,
  ] = useState(true);

  const [
    projectsLoading,
    setProjectsLoading,
  ] = useState(true);

  const [
    dashboardLoading,
    setDashboardLoading,
  ] = useState(true);

  const [
    processingFarmerId,
    setProcessingFarmerId,
  ] = useState(null);

  const [
    processingProjectId,
    setProcessingProjectId,
  ] = useState(null);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /* =========================
     PROFIT STATE
  ========================= */

  const [
    profitProjects,
    setProfitProjects,
  ] = useState([]);

  const [
    profitLoading,
    setProfitLoading,
  ] = useState(true);

  const [
    revenueInputs,
    setRevenueInputs,
  ] = useState({});

  const [
    processingRevenueId,
    setProcessingRevenueId,
  ] = useState(null);

  /* =========================
     DOCUMENT MODAL STATE
  ========================= */

  const [
    showDocumentModal,
    setShowDocumentModal,
  ] = useState(false);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  const [
    projectDocuments,
    setProjectDocuments,
  ] = useState([]);

  const [
    documentsLoading,
    setDocumentsLoading,
  ] = useState(false);

  /* =========================
     GET TOKEN
  ========================= */

  const getToken = () => {
    return (
      localStorage.getItem(
        "token"
      ) ||
      sessionStorage.getItem(
        "token"
      )
    );
  };

  /* =========================
     CLEAR LOGIN
  ========================= */

  const clearLogin = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    sessionStorage.removeItem(
      "token"
    );

    sessionStorage.removeItem(
      "user"
    );
  };

  /* =========================
     HANDLE UNAUTHORIZED
  ========================= */

  const handleUnauthorized =
    () => {
      clearLogin();

      navigate(
        "/admin/login"
      );
    };

  /* =========================
     FETCH DASHBOARD
  ========================= */

  const fetchDashboardData =
    async () => {
      try {
        setDashboardLoading(
          true
        );

        const token =
          getToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        const response =
          await fetch(
            `${API_URL}/admin/dashboard`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          response.status ===
            401 ||
          response.status ===
            403
        ) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load dashboard."
          );
        }

        setDashboardData(
          data.data
        );
      } catch (err) {
        console.error(
          "Dashboard fetch error:",
          err
        );

        setError(
          err.message
        );
      } finally {
        setDashboardLoading(
          false
        );
      }
    };

  /* =========================
     FETCH PENDING FARMERS
  ========================= */

  const fetchPendingFarmers =
    async () => {
      try {
        setFarmersLoading(
          true
        );

        const token =
          getToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        const response =
          await fetch(
            `${API_URL}/admin/farmers/pending`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          response.status ===
            401 ||
          response.status ===
            403
        ) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load pending farmers."
          );
        }

        setPendingFarmers(
          data.farmers || []
        );
      } catch (err) {
        console.error(
          "Pending farmers fetch error:",
          err
        );

        setError(
          err.message
        );
      } finally {
        setFarmersLoading(
          false
        );
      }
    };

  /* =========================
     FETCH PENDING PROJECTS
  ========================= */

  const fetchPendingProjects =
    async () => {
      try {
        setProjectsLoading(
          true
        );

        const token =
          getToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        const response =
          await fetch(
            `${API_URL}/admin/projects/pending`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          response.status ===
            401 ||
          response.status ===
            403
        ) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load pending projects."
          );
        }

        setPendingProjects(
          data.projects || []
        );
      } catch (err) {
        console.error(
          "Pending projects fetch error:",
          err
        );

        setError(
          err.message
        );
      } finally {
        setProjectsLoading(
          false
        );
      }
    };

  /* =========================
     FETCH PROFIT PROJECTS
  ========================= */

  const fetchProfitProjects =
    async () => {
      try {
        setProfitLoading(
          true
        );

        const token =
          getToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        const response =
          await fetch(
            `${API_URL}/admin/projects/profit`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          response.status ===
            401 ||
          response.status ===
            403
        ) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load profit projects."
          );
        }

        setProfitProjects(
          Array.isArray(
            data.projects
          )
            ? data.projects
            : []
        );
      } catch (err) {
        console.error(
          "Profit projects fetch error:",
          err
        );

        setError(
          err.message
        );
      } finally {
        setProfitLoading(
          false
        );
      }
    };

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    fetchDashboardData();
    fetchPendingFarmers();
    fetchPendingProjects();
    fetchProfitProjects();
  }, []);

  /* =========================
     REVENUE INPUT
  ========================= */

  const handleRevenueChange = (
    projectId,
    value
  ) => {
    setRevenueInputs(
      (current) => ({
        ...current,
        [projectId]:
          value,
      })
    );
  };

  /* =========================
     COMPLETE PROJECT &
     GENERATE REPORT
  ========================= */

  const handleGenerateProfitReport =
    async (project) => {
      const revenueValue =
        revenueInputs[
          project.id
        ];

      const totalRevenue =
        Number(
          revenueValue
        );

      const totalInvestment =
        Number(
          project.total_investment
        ) || 0;

      const targetAmount =
        Number(
          project.target_amount
        ) || 0;

      const fundingPercentage =
        targetAmount > 0
          ? (
              totalInvestment /
              targetAmount
            ) * 100
          : 0;

      if (
        fundingPercentage < 70
      ) {
        window.alert(
          `This project is only ${fundingPercentage.toFixed(
            0
          )}% funded. At least 70% funding is required before completion.`
        );

        return;
      }

      if (
        !revenueValue ||
        !Number.isFinite(
          totalRevenue
        ) ||
        totalRevenue <= 0
      ) {
        window.alert(
          "Please enter a valid total revenue."
        );

        return;
      }

      if (
        totalRevenue <
        totalInvestment
      ) {
        window.alert(
          `Total revenue cannot be lower than the total investment (${formatMoney(
            totalInvestment
          )}).`
        );

        return;
      }

      const confirmGenerate =
        window.confirm(
          `Complete "${project.title}" with total revenue ${formatMoney(
            totalRevenue
          )}?`
        );

      if (
        !confirmGenerate
      ) {
        return;
      }

      try {
        setError("");
        setSuccessMessage("");

        setProcessingRevenueId(
          project.id
        );

        const token =
          getToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        const response =
          await fetch(
            `${API_URL}/profits/revenue/${project.id}`,
            {
              method: "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  total_revenue:
                    totalRevenue,
                }),
            }
          );

        const data =
          await response.json();

        if (
          response.status ===
            401 ||
          response.status ===
            403
        ) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to generate profit report."
          );
        }

        setSuccessMessage(
          `${data.project_name} completed. Net Profit: ${formatMoney(
            data.net_profit
          )}. Farmer Share: ${formatMoney(
            data.farmer_share
          )}. Investor Share: ${formatMoney(
            data.investor_share
          )}.`
        );

        setRevenueInputs(
          (current) => ({
            ...current,
            [project.id]:
              "",
          })
        );

        await Promise.all([
          fetchProfitProjects(),
          fetchDashboardData(),
        ]);
      } catch (err) {
        console.error(
          "Generate profit report error:",
          err
        );

        setError(
          err.message
        );
      } finally {
        setProcessingRevenueId(
          null
        );
      }
    };

  /* =========================
     VIEW PROFIT SUMMARY
  ========================= */

  const handleViewProfitSummary =
    (project) => {
      window.alert(
        `${project.title}\n\n` +
          `Total Investment: ${formatMoney(
            project.total_investment
          )}\n` +
          `Total Revenue: ${formatMoney(
            project.total_revenue
          )}\n` +
          `Net Profit: ${formatMoney(
            project.net_profit
          )}\n` +
          `Farmer Share (70%): ${formatMoney(
            project.farmer_share
          )}\n` +
          `Investor Share (30%): ${formatMoney(
            project.investor_share
          )}`
      );
    };

  /* =========================
     VIEW PROJECT DOCUMENTS
  ========================= */

  const handleViewDocuments =
    async (projectId) => {
      try {
        setError("");
        setDocumentsLoading(
          true
        );
        setProjectDocuments(
          []
        );
        setSelectedProject(
          null
        );
        setShowDocumentModal(
          true
        );

        const token =
          getToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        const response =
          await fetch(
            `${API_URL}/admin/projects/${projectId}/documents`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          response.status ===
            401 ||
          response.status ===
            403
        ) {
          setShowDocumentModal(
            false
          );

          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load project documents."
          );
        }

        setSelectedProject(
          data.project
        );

        setProjectDocuments(
          data.documents || []
        );
      } catch (err) {
        console.error(
          "Project documents error:",
          err
        );

        setError(
          err.message
        );

        setShowDocumentModal(
          false
        );
      } finally {
        setDocumentsLoading(
          false
        );
      }
    };

  const closeDocumentModal =
    () => {
      setShowDocumentModal(
        false
      );

      setSelectedProject(
        null
      );

      setProjectDocuments(
        []
      );
    };

  /* =========================
     APPROVE FARMER
  ========================= */

  const handleApproveFarmer =
    async (farmerId) => {
      const confirmApprove =
        window.confirm(
          "Are you sure you want to approve this farmer?"
        );

      if (!confirmApprove) {
        return;
      }

      try {
        setProcessingFarmerId(
          farmerId
        );

        const token =
          getToken();

        const response =
          await fetch(
            `${API_URL}/admin/farmers/${farmerId}/approve`,
            {
              method: "PUT",
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
            data.message
          );
        }

        await Promise.all([
          fetchPendingFarmers(),
          fetchDashboardData(),
        ]);

        setSuccessMessage(
          data.message
        );
      } catch (err) {
        setError(
          err.message
        );
      } finally {
        setProcessingFarmerId(
          null
        );
      }
    };

  /* =========================
     REJECT FARMER
  ========================= */

  const handleRejectFarmer =
    async (farmerId) => {
      const confirmReject =
        window.confirm(
          "Are you sure you want to reject this farmer?"
        );

      if (!confirmReject) {
        return;
      }

      try {
        setProcessingFarmerId(
          farmerId
        );

        const token =
          getToken();

        const response =
          await fetch(
            `${API_URL}/admin/farmers/${farmerId}/reject`,
            {
              method: "PUT",
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
            data.message
          );
        }

        await Promise.all([
          fetchPendingFarmers(),
          fetchDashboardData(),
        ]);

        setSuccessMessage(
          data.message
        );
      } catch (err) {
        setError(
          err.message
        );
      } finally {
        setProcessingFarmerId(
          null
        );
      }
    };

  /* =========================
     APPROVE PROJECT
  ========================= */

  const handleApproveProject =
    async (projectId) => {
      const confirmApprove =
        window.confirm(
          "Are you sure you want to approve this project?"
        );

      if (!confirmApprove) {
        return;
      }

      try {
        setProcessingProjectId(
          projectId
        );

        const token =
          getToken();

        const response =
          await fetch(
            `${API_URL}/admin/projects/${projectId}/approve`,
            {
              method: "PUT",
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
            data.message
          );
        }

        closeDocumentModal();

        await Promise.all([
          fetchPendingProjects(),
          fetchDashboardData(),
          fetchProfitProjects(),
        ]);

        setSuccessMessage(
          data.message
        );
      } catch (err) {
        setError(
          err.message
        );
      } finally {
        setProcessingProjectId(
          null
        );
      }
    };

  /* =========================
     REJECT PROJECT
  ========================= */

  const handleRejectProject =
    async (projectId) => {
      const confirmReject =
        window.confirm(
          "Are you sure you want to reject this project?"
        );

      if (!confirmReject) {
        return;
      }

      try {
        setProcessingProjectId(
          projectId
        );

        const token =
          getToken();

        const response =
          await fetch(
            `${API_URL}/admin/projects/${projectId}/reject`,
            {
              method: "PUT",
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
            data.message
          );
        }

        closeDocumentModal();

        await Promise.all([
          fetchPendingProjects(),
          fetchDashboardData(),
        ]);

        setSuccessMessage(
          data.message
        );
      } catch (err) {
        setError(
          err.message
        );
      } finally {
        setProcessingProjectId(
          null
        );
      }
    };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    clearLogin();
    navigate("/");
  };

  return (
    <main className="ag-admin-page">
      <div className="ag-admin-shell">

        {/* SIDEBAR */}

        <aside className="ag-admin-sidebar">
          <Link
            to="/"
            className="ag-admin-brand"
          >
            <img
              src={adminLogo}
              alt="AgroInvest"
              className="ag-admin-brand-logo"
            />

            <div className="ag-admin-brand-text">
              <h2>
                Agro<span>Invest</span>
              </h2>

              <p>
                Invest. Grow. Impact.
              </p>
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
              <span>
                Dashboard
              </span>
            </Link>

            <a href="#verify-farmers">
              <FaUserCheck />
              <span>
                Verify Farmers
              </span>
            </a>

            <a href="#approve-projects">
              <FaClipboardCheck />
              <span>
                Approve Projects
              </span>
            </a>

            <a href="#reports">
              <FaChartBar />
              <span>
                Reports
              </span>
            </a>

            <a href="#manage-users">
              <FaUsers />
              <span>
                Manage Users
              </span>
            </a>

            <a href="#settings">
              <FaCog />
              <span>
                Settings
              </span>
            </a>

            <div className="ag-admin-nav-divider" />

            <button
              type="button"
              onClick={
                handleLogout
              }
              style={{
                border: "none",
                background:
                  "transparent",
                cursor:
                  "pointer",
                width: "100%",
              }}
            >
              <FaSignOutAlt />
              <span>
                Logout
              </span>
            </button>
          </nav>
        </aside>

        {/* MAIN */}

        <section className="ag-admin-content">

          <header className="ag-admin-heading">
            <h1>
              Admin Dashboard
            </h1>

            <p>
              Welcome back, Admin! Here&apos;s
              what&apos;s happening on AgroInvest.
            </p>
          </header>

          {error && (
            <div
              style={{
                padding:
                  "12px 16px",
                marginBottom:
                  "18px",
                backgroundColor:
                  "#fee4e2",
                color:
                  "#b42318",
                borderRadius:
                  "8px",
              }}
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                padding:
                  "12px 16px",
                marginBottom:
                  "18px",
                backgroundColor:
                  "#dcfae6",
                color:
                  "#067647",
                borderRadius:
                  "8px",
              }}
            >
              {successMessage}
            </div>
          )}

          {/* SUMMARY */}

          <section className="ag-admin-stats">

            <article>
              <div className="ag-stat-icon green">
                <FaUsers />
              </div>

              <div>
                <span>
                  Total Farmers
                </span>

                <strong>
                  {dashboardLoading
                    ? "..."
                    : dashboardData.totalFarmers}
                </strong>

                <small>
                  {dashboardData.pendingFarmers ||
                    0}{" "}
                  pending
                </small>
              </div>
            </article>

            <article>
              <div className="ag-stat-icon blue">
                <FaUsers />
              </div>

              <div>
                <span>
                  Total Investors
                </span>

                <strong>
                  {dashboardLoading
                    ? "..."
                    : dashboardData.totalInvestors}
                </strong>

                <small>
                  Registered Investors
                </small>
              </div>
            </article>

            <article>
              <div className="ag-stat-icon purple">
                <FaClipboardCheck />
              </div>

              <div>
                <span>
                  Approved Projects
                </span>

                <strong>
                  {dashboardLoading
                    ? "..."
                    : dashboardData.approvedProjects}
                </strong>

                <small>
                  {dashboardData.pendingProjects ||
                    0}{" "}
                  pending
                </small>
              </div>
            </article>

            <article>
              <div className="ag-stat-icon yellow">
                <FaClipboardCheck />
              </div>

              <div>
                <span>
                  Total Projects
                </span>

                <strong>
                  {dashboardLoading
                    ? "..."
                    : dashboardData.totalProjects}
                </strong>

                <small>
                  {dashboardData.completedProjects ||
                    0}{" "}
                  completed
                </small>
              </div>
            </article>

          </section>

          {/* FARMERS */}

          <section
            id="verify-farmers"
            className="ag-admin-panel"
          >
            <div className="ag-panel-title">
              <h2>
                Pending Farmer Verifications
              </h2>
            </div>

            <div className="ag-table ag-farmer-table">

              <div className="ag-table-head">
                <span>Farmer</span>
                <span>Email</span>
                <span>Registered On</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {farmersLoading ? (
                <div className="ag-empty-row">
                  Loading pending farmers...
                </div>
              ) : pendingFarmers.length ===
                0 ? (
                <div className="ag-empty-row">
                  No pending farmers found.
                </div>
              ) : (
                pendingFarmers.map(
                  (farmer) => (
                    <div
                      className="ag-table-row"
                      key={
                        farmer.id
                      }
                    >
                      <div className="ag-farmer-cell">
                        <div className="ag-avatar">
                          <FaUsers />
                        </div>

                        <div>
                          <strong>
                            {
                              farmer.full_name
                            }
                          </strong>

                          <small>
                            Farmer ID:{" "}
                            {farmer.id}
                          </small>
                        </div>
                      </div>

                      <span>
                        {
                          farmer.email
                        }
                      </span>

                      <span>
                        {formatDate(
                          farmer.created_at
                        )}
                      </span>

                      <span className="ag-pending">
                        {
                          farmer.verification_status
                        }
                      </span>

                      <div className="ag-row-actions">

                        <button
                          className="accept"
                          type="button"
                          disabled={
                            processingFarmerId ===
                            farmer.id
                          }
                          onClick={() =>
                            handleApproveFarmer(
                              farmer.id
                            )
                          }
                        >
                          <FaCheck />
                        </button>

                        <button
                          className="reject"
                          type="button"
                          disabled={
                            processingFarmerId ===
                            farmer.id
                          }
                          onClick={() =>
                            handleRejectFarmer(
                              farmer.id
                            )
                          }
                        >
                          <FaTimes />
                        </button>

                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </section>

          {/* PROJECT VERIFICATION */}

          <section
            id="approve-projects"
            className="ag-admin-panel"
          >
            <div className="ag-panel-title">
              <h2>
                Pending Project Verifications
              </h2>
            </div>

            <div className="ag-table ag-project-table">

              <div className="ag-table-head">
                <span>Project</span>
                <span>Farmer</span>
                <span>Goal Amount</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {projectsLoading ? (
                <div className="ag-empty-row">
                  Loading pending projects...
                </div>
              ) : pendingProjects.length ===
                0 ? (
                <div className="ag-empty-row">
                  No pending projects found.
                </div>
              ) : (
                pendingProjects.map(
                  (item) => (
                    <div
                      className="ag-table-row"
                      key={
                        item.id
                      }
                    >
                      <div className="ag-project-cell">
                        <img
                          src={getProjectImage(
                            item.crop_type
                          )}
                          alt={
                            item.title
                          }
                        />

                        <strong>
                          {
                            item.title
                          }
                        </strong>
                      </div>

                      <span>
                        {
                          item.farmer_name
                        }
                      </span>

                      <span>
                        {formatMoney(
                          item.target_amount
                        )}
                      </span>

                      <span className="ag-pending">
                        {
                          item.status
                        }
                      </span>

                      <div className="ag-row-actions">

                        <button
                          className="view-documents"
                          type="button"
                          onClick={() =>
                            handleViewDocuments(
                              item.id
                            )
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="accept"
                          type="button"
                          disabled={
                            processingProjectId ===
                            item.id
                          }
                          onClick={() =>
                            handleApproveProject(
                              item.id
                            )
                          }
                        >
                          <FaCheck />
                        </button>

                        <button
                          className="reject"
                          type="button"
                          disabled={
                            processingProjectId ===
                            item.id
                          }
                          onClick={() =>
                            handleRejectProject(
                              item.id
                            )
                          }
                        >
                          <FaTimes />
                        </button>

                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </section>

          {/* PROFIT MANAGEMENT */}

          <section
            id="reports"
            className="ag-admin-panel ag-report-panel"
          >
            <div className="ag-panel-title">

              <div>
                <h2>
                  Profit Management & Reports
                </h2>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    color:
                      "#777",
                    fontSize:
                      "11px",
                  }}
                >
                  A project can be completed after reaching at least 70% funding.
                </p>
              </div>

            </div>

            <div className="ag-table ag-report-table">

              <div className="ag-table-head">
                <span>Project</span>
                <span>Total Investment</span>
                <span>Revenue / Profit</span>
                <span>Action</span>
              </div>

              {profitLoading ? (
                <div className="ag-empty-row">
                  Loading profit projects...
                </div>
              ) : profitProjects.length ===
                0 ? (
                <div className="ag-empty-row">
                  No approved or completed projects found.
                </div>
              ) : (
                profitProjects.map(
                  (project) => {
                    const totalInvestment =
                      Number(
                        project.total_investment
                      ) || 0;

                    const targetAmount =
                      Number(
                        project.target_amount
                      ) || 0;

                    const fundingPercentage =
                      targetAmount > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (
                                totalInvestment /
                                targetAmount
                              ) *
                                100
                            )
                          )
                        : 0;

                    const isEligible =
                      fundingPercentage >=
                      70;

                    const isCompleted =
                      project.status ===
                        "completed" ||
                      project.profit_distributed;

                    return (
                      <div
                        className="ag-table-row"
                        key={
                          project.id
                        }
                      >

                        <div className="ag-project-cell">

                          <img
                            src={getProjectImage(
                              project
                            )}
                            alt={
                              project.title
                            }
                            onError={(
                              event
                            ) => {
                              event.currentTarget.src =
                                getProjectImage(
                                  project.crop_type
                                );
                            }}
                          />

                          <div>
                            <strong>
                              {
                                project.title
                              }
                            </strong>

                            <small
                              style={{
                                display:
                                  "block",
                                marginTop:
                                  "3px",
                                color:
                                  "#777",
                              }}
                            >
                              {
                                project.farmer_name
                              }
                            </small>

                            <small
                              style={{
                                display:
                                  "block",
                                marginTop:
                                  "3px",
                                fontWeight:
                                  "600",
                                color:
                                  isCompleted
                                    ? "#067647"
                                    : isEligible
                                      ? "#218d43"
                                      : "#b54708",
                              }}
                            >
                              {isCompleted
                                ? "Completed"
                                : `${fundingPercentage}% Funded`}
                            </small>
                          </div>
                        </div>

                        <div>
                          <strong>
                            {formatMoney(
                              project.total_investment
                            )}
                          </strong>

                          <small
                            style={{
                              display:
                                "block",
                              marginTop:
                                "3px",
                              color:
                                "#777",
                            }}
                          >
                            Goal:{" "}
                            {formatMoney(
                              project.target_amount
                            )}
                          </small>
                        </div>

                        {isCompleted ? (
                          <div>
                            <strong>
                              Revenue:{" "}
                              {formatMoney(
                                project.total_revenue
                              )}
                            </strong>

                            <small
                              style={{
                                display:
                                  "block",
                                marginTop:
                                  "4px",
                                color:
                                  "#067647",
                              }}
                            >
                              Net Profit:{" "}
                              {formatMoney(
                                project.net_profit
                              )}
                            </small>
                          </div>
                        ) : isEligible ? (
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap:
                                "6px",
                            }}
                          >
                            <span>
                              ৳
                            </span>

                            <input
                              type="number"
                              min={
                                project.total_investment
                              }
                              placeholder="Total Revenue"
                              value={
                                revenueInputs[
                                  project.id
                                ] || ""
                              }
                              onChange={(
                                event
                              ) =>
                                handleRevenueChange(
                                  project.id,
                                  event.target.value
                                )
                              }
                              style={{
                                width:
                                  "120px",
                                padding:
                                  "8px 9px",
                                border:
                                  "1px solid #d5d9d5",
                                borderRadius:
                                  "5px",
                                fontSize:
                                  "10px",
                              }}
                            />
                          </div>
                        ) : (
                          <div>
                            <strong
                              style={{
                                color:
                                  "#b54708",
                              }}
                            >
                              Funding Incomplete
                            </strong>

                            <small
                              style={{
                                display:
                                  "block",
                                marginTop:
                                  "4px",
                                color:
                                  "#777",
                              }}
                            >
                              Minimum 70% required
                            </small>
                          </div>
                        )}

                        <div>
                          {isCompleted ? (
                            <button
                              className="ag-view-report"
                              type="button"
                              onClick={() =>
                                handleViewProfitSummary(
                                  project
                                )
                              }
                            >
                              <FaEye />
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                !isEligible ||
                                processingRevenueId ===
                                  project.id
                              }
                              onClick={() =>
                                handleGenerateProfitReport(
                                  project
                                )
                              }
                              style={{
                                minHeight:
                                  "34px",
                                padding:
                                  "0 10px",
                                border:
                                  "none",
                                borderRadius:
                                  "5px",
                                background:
                                  isEligible
                                    ? "#218d43"
                                    : "#cfd5cf",
                                color:
                                  "#ffffff",
                                fontSize:
                                  "9px",
                                fontWeight:
                                  "600",
                                cursor:
                                  isEligible
                                    ? "pointer"
                                    : "not-allowed",
                              }}
                            >
                              {processingRevenueId ===
                              project.id
                                ? "Generating..."
                                : isEligible
                                  ? "Complete & Generate"
                                  : "Funding Incomplete"}
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  }
                )
              )}
            </div>

            <button
              className="ag-panel-link"
              type="button"
            >
              <span>
                Farmer receives 70% and investors receive 30% of net profit
              </span>

              <FaArrowRight />
            </button>
          </section>

          <footer className="ag-admin-footer">
            © 2026 AgroInvest. All rights reserved.
          </footer>

        </section>
      </div>

      {/* PROJECT DOCUMENT MODAL */}

      {showDocumentModal && (
        <div
          className="ag-document-modal-overlay"
          onClick={
            closeDocumentModal
          }
        >
          <div
            className="ag-document-modal"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <div className="ag-document-modal-header">

              <div>
                <h2>
                  Project Verification
                </h2>

                <p>
                  Review project information and uploaded documents.
                </p>
              </div>

              <button
                type="button"
                className="ag-modal-close"
                onClick={
                  closeDocumentModal
                }
              >
                <FaTimes />
              </button>

            </div>

            {documentsLoading ? (
              <div className="ag-document-loading">
                Loading project documents...
              </div>
            ) : selectedProject ? (
              <>

                <div className="ag-modal-project-info">

                  <div>
                    <span>
                      Project
                    </span>

                    <strong>
                      {
                        selectedProject.title
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Farmer
                    </span>

                    <strong>
                      {
                        selectedProject.farmer_name
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Farmer Email
                    </span>

                    <strong>
                      {
                        selectedProject.farmer_email
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Crop Type
                    </span>

                    <strong>
                      {
                        selectedProject.crop_type
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Goal Amount
                    </span>

                    <strong>
                      {formatMoney(
                        selectedProject.target_amount
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Deadline
                    </span>

                    <strong>
                      {formatDate(
                        selectedProject.deadline
                      )}
                    </strong>
                  </div>

                </div>

                {selectedProject.description && (
                  <div className="ag-modal-description">
                    <span>
                      Description
                    </span>

                    <p>
                      {
                        selectedProject.description
                      }
                    </p>
                  </div>
                )}

                <div className="ag-modal-documents-section">

                  <h3>
                    Uploaded Documents
                  </h3>

                  {projectDocuments.length ===
                  0 ? (
                    <div className="ag-no-documents">
                      No documents were uploaded for this project.
                    </div>
                  ) : (
                    <div className="ag-document-list">

                      {projectDocuments.map(
                        (document) => (
                          <div
                            className="ag-document-item"
                            key={
                              document.id
                            }
                          >

                            <div className="ag-document-icon">
                              <FaFileAlt />
                            </div>

                            <div className="ag-document-details">

                              <strong>
                                {getDocumentName(
                                  document.document_type
                                )}
                              </strong>

                              <span>
                                {
                                  document.file_name
                                }
                              </span>

                            </div>

                            <a
                              href={
                                getDocumentUrl(
                                  document
                                )
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="ag-open-document"
                            >
                              <FaExternalLinkAlt />
                              Open
                            </a>

                          </div>
                        )
                      )}

                    </div>
                  )}
                </div>

                <div className="ag-modal-actions">

                  <button
                    type="button"
                    className="ag-modal-reject"
                    disabled={
                      processingProjectId ===
                      selectedProject.id
                    }
                    onClick={() =>
                      handleRejectProject(
                        selectedProject.id
                      )
                    }
                  >
                    <FaTimes />
                    Reject Project
                  </button>

                  <button
                    type="button"
                    className="ag-modal-approve"
                    disabled={
                      processingProjectId ===
                      selectedProject.id
                    }
                    onClick={() =>
                      handleApproveProject(
                        selectedProject.id
                      )
                    }
                  >
                    <FaCheck />
                    Approve Project
                  </button>

                </div>

              </>
            ) : null}

          </div>
        </div>
      )}

    </main>
  );
}

export default AdminDashboard;