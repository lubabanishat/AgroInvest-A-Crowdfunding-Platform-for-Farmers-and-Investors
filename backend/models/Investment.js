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

const getInvestmentSummary = (projectId, callback) => {
  const query = `
    SELECT
      p.id AS project_id,
      p.title,
      p.target_amount,

      COALESCE(SUM(i.amount), 0) AS collected_amount,

      (
        p.target_amount - COALESCE(SUM(i.amount), 0)
      ) AS remaining_amount,

      ROUND(
        (
          COALESCE(SUM(i.amount), 0) / p.target_amount
        ) * 100,
        2
      ) AS funding_progress,

      COUNT(i.id) AS total_investments,

      COUNT(DISTINCT i.investor_id) AS total_investors

    FROM projects p

    LEFT JOIN investments i
      ON p.id = i.project_id
      AND i.payment_status = 'completed'

    WHERE p.id = ?
      AND p.status = 'approved'

    GROUP BY
      p.id,
      p.title,
      p.target_amount;
  `;

  db.query(query, [projectId], callback);
};

const updatePaymentStatus = (investmentId, paymentStatus, callback) => {
  const query = `
    UPDATE investments
    SET payment_status = ?
    WHERE id = ?
  `;

  db.query(query, [paymentStatus, investmentId], callback);
};

const getInvestmentForPayment = (investmentId, investorId, callback) => {
  const query = `
    SELECT
      id,
      project_id,
      investor_id,
      amount,
      payment_status
    FROM investments
    WHERE id = ?
      AND investor_id = ?
    LIMIT 1
  `;

  db.query(query, [investmentId, investorId], callback);
};

module.exports = {
  createInvestment,
  getApprovedProjectById,
  getMyInvestments,
  getInvestmentSummary,
  updatePaymentStatus,
  getInvestmentForPayment,
};