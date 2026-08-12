const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getFarmerDashboard,
} = require("../controllers/farmerController");


/* =========================
   FARMER DASHBOARD
========================= */

router.get(
  "/dashboard",
  verifyToken,
  getFarmerDashboard
);


module.exports = router;