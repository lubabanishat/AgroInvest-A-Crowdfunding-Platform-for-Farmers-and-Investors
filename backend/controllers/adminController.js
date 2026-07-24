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

module.exports = {
  getAdminDashboard,
  getPendingProjects,
};