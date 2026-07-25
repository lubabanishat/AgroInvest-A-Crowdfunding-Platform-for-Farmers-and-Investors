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

const getMyInvestments = (investorId, callback) => {
  const query = `
    SELECT
      i.id,
      i.amount,
      i.payment_status,
      i.created_at,

      p.id AS project_id,
      p.title,
      p.crop_type,
      p.target_amount

    FROM investments i

    JOIN projects p
      ON i.project_id = p.id

    WHERE i.investor_id = ?

    ORDER BY i.created_at DESC
  `;

  db.query(query, [investorId], callback);
};

module.exports = {
  createInvestment,
  getApprovedProjectById,
  getMyInvestments,
};