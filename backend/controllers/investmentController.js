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

module.exports = {
  investInProject,
};