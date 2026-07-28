const Profit = require("../models/profitModel");

// ===============================
// Update Project Revenue
// ===============================
const updateRevenue = (req, res) => {
  const { projectId } = req.params;
  const { total_revenue } = req.body;

  if (!total_revenue || Number(total_revenue) <= 0) {
    return res.status(400).json({
      message: "Please provide a valid total revenue.",
    });
  }

  Profit.updateRevenue(projectId, total_revenue, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error.",
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      message: "Revenue updated successfully.",
      total_revenue: Number(total_revenue),
      profit_distributed: true,
    });
  });
};

// ===============================
// Farmer Profit Report
// ===============================
const getFarmerReport = (req, res) => {
  const { projectId } = req.params;

  Profit.getFarmerProfitReport(projectId, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error.",
        error: err,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const project = results[0];

    const fundingGoal = Number(project.target_amount);
    const totalInvestment = Number(project.total_investment);
    const totalRevenue = Number(project.total_revenue || 0);

    const netProfit = Math.max(0, totalRevenue - totalInvestment);

    const farmerShare = Number((netProfit * 0.7).toFixed(2));
    const investorShare = Number((netProfit * 0.3).toFixed(2));

    return res.status(200).json({
      project_name: project.title,
      funding_goal: fundingGoal,
      total_investment: totalInvestment,
      total_revenue: totalRevenue,
      net_profit: netProfit,
      farmer_share: farmerShare,
      investor_share: investorShare,
      profit_distributed: totalRevenue > 0,
    });
  });
};

// ===============================
// Investor Profit Report
// ===============================
const getInvestorReport = (req, res) => {
  const { projectId } = req.params;
  const investorId = req.user.id;

  Profit.getFarmerProfitReport(projectId, (err, projectResult) => {
    if (err) {
      return res.status(500).json({
        message: "Database error.",
        error: err,
      });
    }

    if (projectResult.length === 0) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const project = projectResult[0];

    Profit.getInvestorInvestment(
      projectId,
      investorId,
      (err, investmentResult) => {
        if (err) {
          return res.status(500).json({
            message: "Database error.",
            error: err,
          });
        }

        if (investmentResult.length === 0) {
          return res.status(404).json({
            message: "Investment not found.",
          });
        }

        const investedAmount = Number(investmentResult[0].amount);

        const totalInvestment = Number(project.total_investment);
        const totalRevenue = Number(project.total_revenue || 0);

        const netProfit = Math.max(
          0,
          totalRevenue - totalInvestment
        );

        const investorPool = netProfit * 0.3;

        const investmentRatio =
          totalInvestment > 0
            ? investedAmount / totalInvestment
            : 0;

        const profitEarned = Number(
          (investorPool * investmentRatio).toFixed(2)
        );

        const totalReturned = Number(
          (investedAmount + profitEarned).toFixed(2)
        );

        return res.status(200).json({
          invested_amount: investedAmount,
          investment_ratio:
            (investmentRatio * 100).toFixed(2) + "%",
          profit_earned: profitEarned,
          total_returned: totalReturned,
          payment_status:
            project.profit_distributed
              ? "Paid"
              : "Pending",
        });
      }
    );
  });
};

module.exports = {
  updateRevenue,
  getFarmerReport,
  getInvestorReport,
};