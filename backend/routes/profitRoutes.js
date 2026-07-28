const express = require("express");

const {
  updateRevenue,
  getFarmerReport,
  getInvestorReport,
} = require("../controllers/profitController");

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Update Project Revenue (Admin Only)
router.put(
  "/revenue/:projectId",
  verifyToken,
  adminMiddleware,
  updateRevenue
);

// Farmer Profit Report
router.get(
  "/farmer/:projectId",
  verifyToken,
  getFarmerReport
);

// Investor Profit Report
router.get(
  "/investor/:projectId",
  verifyToken,
  getInvestorReport
);

module.exports = router;