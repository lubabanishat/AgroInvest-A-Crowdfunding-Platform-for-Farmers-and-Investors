const db = require("../config/db");

const createInvestment = (investmentData, callback) => {
  const query = `
    INSERT INTO investments
    (project_id, investor_id, amount, payment_status)
    VALUES (?, ?, ?, 'pending')
  `;

  db.query(
    query,
    [
      investmentData.project_id,
      investmentData.investor_id,
      investmentData.amount,
    ],
    callback
  );
};

const getApprovedProjectById = (projectId, callback) => {
  const query = `
    SELECT
      id,
      title,
      target_amount,
      status
    FROM projects
    WHERE id = ?
      AND status = 'approved'
  `;

  db.query(query, [projectId], callback);
};

module.exports = {
  createInvestment,
  getApprovedProjectById,
};