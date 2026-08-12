const db = require("../config/db");

// ==========================================
// 1. Create Investment
// ==========================================
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

// ==========================================
// 2. Get Approved Project By ID
// Used when making a NEW investment.
// Completed projects should NOT accept investment.
// ==========================================
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

// ==========================================
// 3. Get My Investments
// ==========================================
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
      p.target_amount,
      p.status AS project_status,

      u.full_name AS farmer_name,

      (
        SELECT COALESCE(SUM(i2.amount), 0)
        FROM investments i2
        WHERE i2.project_id = p.id
          AND i2.payment_status = 'completed'
      ) AS collected_amount,

      (
        SELECT pd.file_path
        FROM project_documents pd
        WHERE pd.project_id = p.id
          AND pd.document_type = 'LAND_IMAGE'
        ORDER BY pd.id DESC
        LIMIT 1
      ) AS land_image

    FROM investments i

    JOIN projects p
      ON i.project_id = p.id

    JOIN users u
      ON p.farmer_id = u.id

    WHERE i.investor_id = ?

    ORDER BY i.created_at DESC
  `;

  db.query(query, [investorId], callback);
};

// ==========================================
// 4. Get Investment Summary
// Approved + Completed projects supported
// ==========================================
const getInvestmentSummary = (projectId, callback) => {
  const query = `
    SELECT
      p.id AS project_id,
      p.title,
      p.target_amount,
      p.status AS project_status,

      COALESCE(SUM(i.amount), 0) AS collected_amount,

      GREATEST(
        p.target_amount - COALESCE(SUM(i.amount), 0),
        0
      ) AS remaining_amount,

      ROUND(
        (
          COALESCE(SUM(i.amount), 0) /
          NULLIF(p.target_amount, 0)
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
      AND p.status IN ('approved', 'completed')

    GROUP BY
      p.id,
      p.title,
      p.target_amount,
      p.status
  `;

  db.query(query, [projectId], callback);
};

// ==========================================
// 5. Update Payment Status
// ==========================================
const updatePaymentStatus = (
  investmentId,
  paymentStatus,
  callback
) => {
  const query = `
    UPDATE investments
    SET payment_status = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [paymentStatus, investmentId],
    callback
  );
};

// ==========================================
// 6. Get Investment For Payment
// ==========================================
const getInvestmentForPayment = (
  investmentId,
  investorId,
  callback
) => {
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

  db.query(
    query,
    [investmentId, investorId],
    callback
  );
};

// ==========================================
// Export
// ==========================================
module.exports = {
  createInvestment,
  getApprovedProjectById,
  getMyInvestments,
  getInvestmentSummary,
  updatePaymentStatus,
  getInvestmentForPayment,
};