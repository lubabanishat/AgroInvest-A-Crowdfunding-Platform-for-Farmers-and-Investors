const express = require("express");

const { investInProject } = require("../controllers/investmentController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Invest in a Project
router.post("/invest", verifyToken, investInProject);

module.exports = router;