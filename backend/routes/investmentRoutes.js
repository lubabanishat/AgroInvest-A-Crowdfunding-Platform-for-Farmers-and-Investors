const express = require("express");

const {
  investInProject,
  getMyInvestments,
  getInvestmentSummary,
  getInvestmentById,
} = require(
  "../controllers/investmentController"
);

const verifyToken = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// ==========================================
// Invest in a Project
// ==========================================
router.post(
  "/invest",
  verifyToken,
  investInProject
);

// ==========================================
// Get My Investments
// ==========================================
router.get(
  "/my-investments",
  verifyToken,
  getMyInvestments
);

// ==========================================
// Get Investment Summary
// ==========================================
router.get(
  "/summary/:id",
  getInvestmentSummary
);

// ==========================================
// Get Single Investment
// Payment Success page uses this
// ==========================================
router.get(
  "/:id",
  getInvestmentById
);

module.exports = router;