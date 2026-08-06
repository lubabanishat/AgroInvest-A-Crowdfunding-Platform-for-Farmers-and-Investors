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

import { Link } from "react-router-dom";

import FarmerTopbar from "../components/farmer/FarmerTopbar";
import logo from "../assets/images/logo.png";

import "./CreateProject.css";

function CreateProject() {
  return (
    <main className="create-project-page">
      <div className="create-project-container">
        {/* Sidebar */}
        <aside className="create-project-sidebar">
          <div>
            <div className="create-project-logo">
              <img src={logo} alt="AgroInvest" />
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
                <span>Create New Projects</span>
              </Link>

              <a href="#applications">
                <FaFileAlt />
                <span>Applications</span>
              </a>

              <a href="#profit-reports">
                <FaChartLine />
                <span>Profit Reports</span>
              </a>

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
            <p>Our support team is here to help you.</p>
            <button type="button">Contact Support</button>
          </div>
        </aside>

        {/* Main Content */}
        <section className="create-project-main">
          <FarmerTopbar />

          <div className="create-project-heading">
            <h1>Create New Project</h1>
            <p>
              Fill in details below to create a new farming project.
            </p>
          </div>

          <form className="create-project-form">
            {/* Basic Information */}
            <section className="create-form-section">
              <h2>1. Basic Information</h2>

              <div className="create-form-grid">
                <div className="create-form-group">
                  <label>
                    Project Title<span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Boro Rice Cultivation 2026"
                  />
                </div>

                <div className="create-form-group">
                  <label>
                    Crop Type<span>*</span>
                  </label>

                  <select defaultValue="">
                    <option value="" disabled>
                      Select crop type
                    </option>
                    <option>Rice</option>
                    <option>Tomato</option>
                    <option>Mango</option>
                    <option>Chilli</option>
                  </select>
                </div>

                <div className="create-form-group">
                  <label>
                    Location<span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Select your location"
                  />
                </div>

                <div className="create-form-group">
                  <label>
                    Project Description<span>*</span>
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Describe your farming project..."
                  />
                </div>
              </div>
            </section>

            {/* Farming Details */}
            <section className="create-form-section">
              <h2>2. Farming Details</h2>

              <div className="create-form-grid">
                <div className="create-form-group">
                  <label>
                    Land Size (in Acres)<span>*</span>
                  </label>

                  <input type="number" placeholder="e.g. 2.50" />
                </div>

                <div className="create-form-group">
                  <label>
                    Cultivation Duration (Months)<span>*</span>
                  </label>

                  <select defaultValue="">
                    <option value="" disabled>
                      Select duration
                    </option>
                    <option>3 Months</option>
                    <option>6 Months</option>
                    <option>9 Months</option>
                    <option>12 Months</option>
                  </select>
                </div>

                <div className="create-form-group">
                  <label>
                    Funding Goal (BDT)<span>*</span>
                  </label>

                  <input type="number" placeholder="e.g. 100000" />
                </div>

                <div className="create-form-group">
                  <label>
                    Expected Profit (%)<span>*</span>
                  </label>

                  <input type="number" placeholder="e.g. 15" />
                </div>

                <div className="create-form-group">
                  <label>
                    Expected Harvest Date<span>*</span>
                  </label>

                  <input type="date" />
                </div>
              </div>
            </section>

            {/* Documents */}
            <section className="create-form-section">
              <h2>3. Verification Documents</h2>

              <p className="create-form-description">
                Please upload the required documents for verification.
              </p>

              <div className="document-upload-grid">
                <label className="document-upload-box">
                  <strong>
                    National ID (NID)<span>*</span>
                  </strong>

                  <small>Upload a clear copy of your NID.</small>

                  <div className="upload-area">
                    <FaCloudUploadAlt />
                    <span>Click to Upload</span>
                    <small>PNG, JPG or PDF</small>
                  </div>

                  <input type="file" hidden />
                </label>

                <label className="document-upload-box">
                  <strong>
                    Land Ownership Documents<span>*</span>
                  </strong>

                  <small>Upload land ownership documents.</small>

                  <div className="upload-area">
                    <FaCloudUploadAlt />
                    <span>Click to Upload</span>
                    <small>PNG, JPG or PDF</small>
                  </div>

                  <input type="file" hidden />
                </label>

                <label className="document-upload-box">
                  <strong>
                    Land Photo<span>*</span>
                  </strong>

                  <small>Upload a recent photo of your farming land.</small>

                  <div className="upload-area">
                    <FaCloudUploadAlt />
                    <span>Click to Upload</span>
                    <small>PNG or JPG</small>
                  </div>

                  <input type="file" hidden />
                </label>
              </div>
            </section>

            <div className="create-project-note">
              <FaQuestionCircle />

              <div>
                <strong>Important Note</strong>
                <p>
                  All projects will be reviewed by our admin team.
                  You will be notified after approval.
                </p>
              </div>
            </div>

            <div className="create-project-actions">
              <button type="button" className="save-draft-button">
                Save Draft
              </button>

              <button type="submit" className="submit-project-button">
                Submit Project
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default CreateProject;