const db = require("../config/db");

/* =========================
   UPDATE TOTAL REVENUE
========================= */

const updateRevenue = (
  projectId,
  totalRevenue,
  callback
) => {
  const sql = `
    UPDATE projects
    SET
      total_revenue = ?,
      profit_distributed = TRUE,
      status = 'completed'
    WHERE id = ?
  `;

  db.query(
    sql,
    [totalRevenue, projectId],
    callback
  );
};


/* =========================
   GET FARMER PROFIT REPORT
========================= */

const getFarmerProfitReport = (
  projectId,
  callback
) => {
  const sql = `
    SELECT
      p.id,
      p.title,
      p.target_amount,
      p.total_revenue,
      p.profit_distributed,
      p.status,

      COALESCE(
        SUM(i.amount),
        0
      ) AS total_investment

    FROM projects p

    LEFT JOIN investments i
      ON p.id = i.project_id
      AND i.payment_status = 'completed'

    WHERE p.id = ?

    GROUP BY
      p.id,
      p.title,
      p.target_amount,
      p.total_revenue,
      p.profit_distributed,
      p.status
  `;

  db.query(
    sql,
    [projectId],
    callback
  );
};


/* =========================
   GET INVESTOR INVESTMENT
========================= */

const getInvestorInvestment = (
  projectId,
  investorId,
  callback
) => {
  const sql = `
    SELECT
      COALESCE(
        SUM(amount),
        0
      ) AS amount

    FROM investments

    WHERE project_id = ?
      AND investor_id = ?
      AND payment_status = 'completed'

    HAVING SUM(amount) > 0
  `;

  db.query(
    sql,
    [projectId, investorId],
    callback
  );
};


/* =========================
   GET PROJECT DISTRIBUTION STATUS
========================= */

const getProjectDistributionStatus = (
  projectId,
  callback
) => {
  const sql = `
    SELECT
      id,
      title,
      status,
      total_revenue,
      profit_distributed
    FROM projects
    WHERE id = ?
    LIMIT 1
  `;

  db.query(
    sql,
    [projectId],
    callback
  );
};


/* =========================
   EXPORTS
========================= */

module.exports = {
  updateRevenue,
  getFarmerProfitReport,
  getInvestorInvestment,
  getProjectDistributionStatus,
};