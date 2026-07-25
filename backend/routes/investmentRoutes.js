const express = require("express");

const { 
    investInProject,
    getMyInvestments,
 } = require("../controllers/investmentController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Invest in a Project
router.post("/invest", verifyToken, investInProject);

// Get My Investments
router.get("/my-investments", verifyToken, getMyInvestments);

module.exports = router;