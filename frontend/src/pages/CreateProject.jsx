import { useState } from "react";
import {
  FaThLarge,
  FaClipboardList,
  FaPlusCircle,
  FaFileAlt,
  FaChartLine,
  FaUsers,
  FaFolderOpen,
  FaEnvelope,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaCloudUploadAlt,
} from "react-icons/fa";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import FarmerTopbar from "../components/farmer/FarmerTopbar";
import logo from "../assets/images/logo.png";

import "./CreateProject.css";

function CreateProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    cropType: "",
    location: "",
    description: "",
    landSize: "",
    duration: "",
    targetAmount: "",
    expectedProfit: "",
    deadline: "",
  });

  const [nidFile, setNidFile] = useState(null);
  const [landDeedFile, setLandDeedFile] = useState(null);
  const [landImageFile, setLandImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const token = getToken();

    if (!token) {
      setError(
        "You are not logged in. Please login as a farmer first."
      );
      return;
    }

    if (
      !formData.title ||
      !formData.cropType ||
      !formData.targetAmount ||
      !formData.deadline
    ) {
      setError(
        "Please fill in all required project information."
      );
      return;
    }

    if (
      !nidFile ||
      !landDeedFile ||
      !landImageFile
    ) {
      setError(
        "Please upload NID, land ownership document and land photo."
      );
      return;
    }

    setLoading(true);

    try {
      /*
        STEP 1
        Create Project
      */

      const projectResponse = await fetch(
        "http://localhost:5000/api/projects/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            crop_type: formData.cropType,
            target_amount: Number(
              formData.targetAmount
            ),
            deadline: formData.deadline,
          }),
        }
      );

      const projectData =
        await projectResponse.json();

      if (!projectResponse.ok) {
        throw new Error(
          projectData.message ||
            "Project creation failed."
        );
      }

      const projectId =
        projectData.project?.id;

      if (!projectId) {
        throw new Error(
          "Project was created but project ID was not returned."
        );
      }

      /*
        STEP 2
        Upload Verification Documents
      */

      const documentData =
        new FormData();

      documentData.append(
        "project_id",
        projectId
      );

      documentData.append(
        "nid",
        nidFile
      );

      documentData.append(
        "land_deed",
        landDeedFile
      );

      documentData.append(
        "land_image",
        landImageFile
      );

      const documentResponse =
        await fetch(
          "http://localhost:5000/api/projects/upload-documents",
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
            },

            body: documentData,
          }
        );

      const documentResult =
        await documentResponse.json();

      if (!documentResponse.ok) {
        throw new Error(
          documentResult.message ||
            "Project created, but document upload failed."
        );
      }

      setSuccess(
        "Project submitted successfully! Your project is now waiting for admin approval."
      );

      setTimeout(() => {
        navigate(
          "/farmer/dashboard"
        );
      }, 1800);
    } catch (error) {
      console.error(
        "Create project error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-project-page">
      <div className="create-project-container">
        {/* Sidebar */}
        <aside className="create-project-sidebar">
          <div>
            <div className="create-project-logo">
              <img
                src={logo}
                alt="AgroInvest"
              />
            </div>

            <nav
              className="create-project-menu"
              aria-label="Farmer navigation"
            >
              <Link to="/farmer/dashboard">
                <FaThLarge />
                <span>Dashboard</span>
              </Link>

              <a href="#my-projects">
                <FaClipboardList />
                <span>My Projects</span>
              </a>

              <Link
                to="/farmer/create-project"
                className="active"
              >
                <FaPlusCircle />
                <span>
                  Create New Projects
                </span>
              </Link>

              <a href="#applications">
                <FaFileAlt />
                <span>Applications</span>
              </a>

              <Link to="/farmer/profit-report">
                <FaChartLine />
                <span>Profit Reports</span>
              </Link>

              <a href="#investors">
                <FaUsers />
                <span>Investors</span>
              </a>

              <a href="#documents">
                <FaFolderOpen />
                <span>Documents</span>
              </a>

              <a href="#messages">
                <FaEnvelope />
                <span>Messages</span>
              </a>

              <a href="#profile">
                <FaUser />
                <span>Profile</span>
              </a>

              <a href="#settings">
                <FaCog />
                <span>Settings</span>
              </a>

              <a href="#help">
                <FaQuestionCircle />
                <span>Help & Support</span>
              </a>
            </nav>
          </div>

          <div className="create-project-help-card">
            <FaQuestionCircle />

            <h3>Need Help?</h3>

            <p>
              Our support team is here to help you.
            </p>

            <button type="button">
              Contact Support
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <section className="create-project-main">
          <FarmerTopbar />

          <div className="create-project-heading">
            <h1>
              Create New Project
            </h1>

            <p>
              Fill in details below to create a new farming project.
            </p>
          </div>

          <form
            className="create-project-form"
            onSubmit={handleSubmit}
          >
            {/* Basic Information */}
            <section className="create-form-section">
              <h2>
                1. Basic Information
              </h2>

              <div className="create-form-grid">
                <div className="create-form-group">
                  <label>
                    Project Title
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Boro Rice Cultivation 2026"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="create-form-group">
                  <label>
                    Crop Type
                    <span>*</span>
                  </label>

                  <select
                    name="cropType"
                    value={
                      formData.cropType
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >
                    <option value="">
                      Select crop type
                    </option>

                    <option value="Rice">
                      Rice
                    </option>

                    <option value="Tomato">
                      Tomato
                    </option>

                    <option value="Mango">
                      Mango
                    </option>

                    <option value="Chilli">
                      Chilli
                    </option>
                  </select>
                </div>

                <div className="create-form-group">
                  <label>
                    Location
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="location"
                    placeholder="Select your location"
                    value={
                      formData.location
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="create-form-group">
                  <label>
                    Project Description
                    <span>*</span>
                  </label>

                  <textarea
                    rows="4"
                    name="description"
                    placeholder="Describe your farming project..."
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>
              </div>
            </section>

            {/* Farming Details */}
            <section className="create-form-section">
              <h2>
                2. Farming Details
              </h2>

              <div className="create-form-grid">
                <div className="create-form-group">
                  <label>
                    Land Size (in Acres)
                    <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="landSize"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 2.50"
                    value={
                      formData.landSize
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="create-form-group">
                  <label>
                    Cultivation Duration
                    (Months)
                    <span>*</span>
                  </label>

                  <select
                    name="duration"
                    value={
                      formData.duration
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >
                    <option value="">
                      Select duration
                    </option>

                    <option value="3">
                      3 Months
                    </option>

                    <option value="6">
                      6 Months
                    </option>

                    <option value="9">
                      9 Months
                    </option>

                    <option value="12">
                      12 Months
                    </option>
                  </select>
                </div>

                <div className="create-form-group">
                  <label>
                    Funding Goal (BDT)
                    <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="targetAmount"
                    min="1"
                    placeholder="e.g. 100000"
                    value={
                      formData.targetAmount
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="create-form-group">
                  <label>
                    Expected Profit (%)
                    <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="expectedProfit"
                    min="0"
                    placeholder="e.g. 15"
                    value={
                      formData.expectedProfit
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="create-form-group">
                  <label>
                    Expected Harvest Date
                    <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="deadline"
                    value={
                      formData.deadline
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>
              </div>
            </section>

            {/* Documents */}
            <section className="create-form-section">
              <h2>
                3. Verification Documents
              </h2>

              <p className="create-form-description">
                Please upload the required documents for verification.
              </p>

              <div className="document-upload-grid">
                {/* NID */}
                <label className="document-upload-box">
                  <strong>
                    National ID (NID)
                    <span>*</span>
                  </strong>

                  <small>
                    Upload a clear copy of your NID.
                  </small>

                  <div className="upload-area">
                    <FaCloudUploadAlt />

                    <span>
                      {nidFile
                        ? nidFile.name
                        : "Click to Upload"}
                    </span>

                    <small>
                      PNG, JPG or PDF
                    </small>
                  </div>

                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    hidden
                    required
                    onChange={(event) =>
                      setNidFile(
                        event.target.files[0] ||
                          null
                      )
                    }
                  />
                </label>

                {/* LAND DEED */}
                <label className="document-upload-box">
                  <strong>
                    Land Ownership Documents
                    <span>*</span>
                  </strong>

                  <small>
                    Upload land ownership documents.
                  </small>

                  <div className="upload-area">
                    <FaCloudUploadAlt />

                    <span>
                      {landDeedFile
                        ? landDeedFile.name
                        : "Click to Upload"}
                    </span>

                    <small>
                      PNG, JPG or PDF
                    </small>
                  </div>

                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    hidden
                    required
                    onChange={(event) =>
                      setLandDeedFile(
                        event.target.files[0] ||
                          null
                      )
                    }
                  />
                </label>

                {/* LAND IMAGE */}
                <label className="document-upload-box">
                  <strong>
                    Land Photo
                    <span>*</span>
                  </strong>

                  <small>
                    Upload a recent photo of your farming land.
                  </small>

                  <div className="upload-area">
                    <FaCloudUploadAlt />

                    <span>
                      {landImageFile
                        ? landImageFile.name
                        : "Click to Upload"}
                    </span>

                    <small>
                      PNG or JPG
                    </small>
                  </div>

                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    hidden
                    required
                    onChange={(event) =>
                      setLandImageFile(
                        event.target.files[0] ||
                          null
                      )
                    }
                  />
                </label>
              </div>
            </section>

            {/* IMPORTANT NOTE */}
            <div className="create-project-note">
              <FaQuestionCircle />

              <div>
                <strong>
                  Important Note
                </strong>

                <p>
                  All projects will be reviewed by our admin team.
                  You will be notified after approval.
                </p>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div
                style={{
                  padding:
                    "11px 14px",
                  color:
                    "#b42318",
                  fontSize:
                    "12px",
                  textAlign:
                    "center",
                  backgroundColor:
                    "#fee4e2",
                  borderRadius:
                    "6px",
                }}
              >
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div
                style={{
                  padding:
                    "11px 14px",
                  color:
                    "#16723b",
                  fontSize:
                    "12px",
                  textAlign:
                    "center",
                  backgroundColor:
                    "#dcfae6",
                  borderRadius:
                    "6px",
                }}
              >
                {success}
              </div>
            )}

            {/* BUTTONS */}
            <div className="create-project-actions">
              <button
                type="button"
                className="save-draft-button"
                onClick={() =>
                  window.alert(
                    "Draft saving will be added later."
                  )
                }
              >
                Save Draft
              </button>

              <button
                type="submit"
                className="submit-project-button"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Project"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default CreateProject;