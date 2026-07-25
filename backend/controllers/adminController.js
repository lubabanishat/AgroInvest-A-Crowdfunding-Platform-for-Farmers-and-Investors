const db = require("../config/db");

// Admin Dashboard
const getAdminDashboard = (req, res) => {
  const dashboardQuery = `
    SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'farmer') AS totalFarmers,
      (SELECT COUNT(*) FROM users WHERE role = 'investor') AS totalInvestors,
      (SELECT COUNT(*) FROM projects) AS totalProjects,
      (SELECT COUNT(*) FROM projects WHERE status = 'pending') AS pendingProjects,
      (SELECT COUNT(*) FROM projects WHERE status = 'approved') AS approvedProjects,
      (SELECT COUNT(*) FROM projects WHERE status = 'rejected') AS rejectedProjects
  `;

  db.query(dashboardQuery, (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to load dashboard",
      });
    }

    return res.status(200).json({
      message: "Admin Dashboard",
      data: results[0],
    });
  });
};

// Get All Pending Projects
const getPendingProjects = (req, res) => {
  const query = `
    SELECT
  p.id,
  p.title,
  p.description,
  p.crop_type,
  p.target_amount,
  p.deadline,
  p.status,
  u.full_name AS farmer_name
FROM projects p
JOIN users u ON p.farmer_id = u.id
WHERE p.status = 'pending'
ORDER BY p.created_at DESC
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to load pending projects",
      });
    }

    return res.status(200).json({
      message: "Pending Projects",
      projects: results,
    });
  });
};

// Approve Project
const approveProject = (req, res) => {
  const projectId = req.params.id;

  const checkQuery = "SELECT id, status FROM projects WHERE id = ?";

  db.query(checkQuery, [projectId], (checkError, results) => {
    if (checkError) {
      console.error("Project check error:", checkError);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (results[0].status === "approved") {
      return res.status(400).json({
        message: "Project is already approved",
      });
    }

    const updateQuery = `
      UPDATE projects
      SET status = 'approved'
      WHERE id = ?
    `;

    db.query(updateQuery, [projectId], (updateError) => {
      if (updateError) {
        console.error("Project approval error:", updateError);

        return res.status(500).json({
          message: "Failed to approve project",
        });
      }

      return res.status(200).json({
        message: "Project approved successfully",
        project_id: Number(projectId),
        status: "approved",
      });

      if (results[0].status === "rejected") {
      return res.status(400).json({
      message: "Rejected projects cannot be approved",
    });
  }
    });
  });
};

// Reject Project
const rejectProject = (req, res) => {
  const projectId = req.params.id;

  const checkQuery = "SELECT id, status FROM projects WHERE id = ?";

  db.query(checkQuery, [projectId], (checkError, results) => {
    if (checkError) {
      console.error("Project check error:", checkError);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (results[0].status === "rejected") {
      return res.status(400).json({
        message: "Project is already rejected",
      });
    }
    if (results[0].status === "approved") {
  return res.status(400).json({
    message: "Approved projects cannot be rejected",
  });
}

    const updateQuery = `
      UPDATE projects
      SET status = 'rejected'
      WHERE id = ?
    `;

    db.query(updateQuery, [projectId], (updateError) => {
      if (updateError) {
        console.error("Project rejection error:", updateError);

        return res.status(500).json({
          message: "Failed to reject project",
        });
      }

      return res.status(200).json({
        message: "Project rejected successfully",
        project_id: Number(projectId),
        status: "rejected",
      });
    });
  });
};

module.exports = {
  getAdminDashboard,
  getPendingProjects,
  approveProject,
  rejectProject,
};