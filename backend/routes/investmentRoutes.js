const express = require("express");

const { 
    investInProject,
    getMyInvestments,
    getInvestmentSummary,
 } = require("../controllers/investmentController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Invest in a Project
router.post("/invest", verifyToken, investInProject);

// Get My Investments
router.get("/my-investments", verifyToken, getMyInvestments);

// Get Investment Summary of a Project
router.get("/summary/:id", getInvestmentSummary);

module.exports = router;