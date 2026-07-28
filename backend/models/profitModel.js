const db = require("../config/db");

// Update Total Revenue
const updateRevenue = (projectId, totalRevenue, callback) => {
  const sql = `
    UPDATE projects
    SET
      total_revenue = ?,
      profit_distributed = TRUE
    WHERE id = ?
  `;

  db.query(sql, [totalRevenue, projectId], callback);
};

// Get Farmer Profit Report
const getFarmerProfitReport = (projectId, callback) => {
  const sql = `
    SELECT
      p.id,
      p.title,
      p.target_amount,
      p.total_revenue,
      p.profit_distributed,
      COALESCE(SUM(i.amount),0) AS total_investment
    FROM projects p
    LEFT JOIN investments i
      ON p.id = i.project_id
      AND i.payment_status = 'completed'
    WHERE p.id = ?
    GROUP BY p.id
  `;

  db.query(sql, [projectId], callback);
};

// Get Investor Investment Details
const getInvestorInvestment = (projectId, investorId, callback) => {
  const sql = `
    SELECT amount
    FROM investments
    WHERE
      project_id = ?
      AND investor_id = ?
      AND payment_status = 'completed'
  `;

  db.query(sql, [projectId, investorId], callback);
};

const getProjectDistributionStatus = (projectId, callback) => {
  const sql = `
    SELECT profit_distributed
    FROM projects
    WHERE id = ?
  `;

  db.query(sql, [projectId], callback);
};

module.exports = {
  updateRevenue,
  getFarmerProfitReport,
  getInvestorInvestment,
  getProjectDistributionStatus,
};