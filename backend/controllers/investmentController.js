const Investment = require("../models/Investment");

const investInProject = (req, res) => {
  const { project_id, amount } = req.body;

  const investor_id = req.user.id;
  const role = req.user.role;

  // Only investors can invest
  if (role !== "investor") {
    return res.status(403).json({
      message: "Only investors can invest in projects",
    });
  }

  // Validation
  if (!project_id || !amount) {
    return res.status(400).json({
      message: "Project ID and investment amount are required",
    });
  }

  if (Number(amount) <= 0) {
    return res.status(400).json({
      message: "Investment amount must be greater than zero",
    });
  }

  // Check project exists and is approved
  Investment.getApprovedProjectById(project_id, (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Approved project not found",
      });
    }

    const investmentData = {
      project_id,
      investor_id,
      amount,
    };

    Investment.createInvestment(investmentData, (error, result) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          message: "Database error",
        });
      }

      return res.status(201).json({
        message: "Investment created successfully",
        investment: {
          id: result.insertId,
          project_id,
          investor_id,
          amount,
          payment_status: "pending",
        },
      });
    });
  });
};
const getMyInvestments = (req, res) => {
  const investorId = req.user.id;
  const role = req.user.role;

  if (role !== "investor") {
    return res.status(403).json({
      message: "Only investors can view their investments",
    });
  }

  Investment.getMyInvestments(investorId, (error, investments) => {
    if (error) {
      console.error("Get my investments error:", error);

      return res.status(500).json({
        message: "Database error",
      });
    }

    return res.status(200).json({
      message: "Investments fetched successfully",
      investments,
    });
  });
};

const getInvestmentSummary = (req, res) => {
  const projectId = req.params.id;

  Investment.getInvestmentSummary(projectId, (error, results) => {
    if (error) {
      console.error("Get investment summary error:", error);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Approved project not found",
      });
    }

    const summary = results[0];

    return res.status(200).json({
      message: "Investment summary fetched successfully",
      summary: {
        project_id: summary.project_id,
        title: summary.title,
        target_amount: summary.target_amount,
        collected_amount: summary.collected_amount,
        remaining_amount: summary.remaining_amount,
        funding_progress: Number(summary.funding_progress),
        total_investments: summary.total_investments,
        total_investors: summary.total_investors,
      },
    });
  });
};

module.exports = {
  investInProject,
  getMyInvestments,
  getInvestmentSummary,
};