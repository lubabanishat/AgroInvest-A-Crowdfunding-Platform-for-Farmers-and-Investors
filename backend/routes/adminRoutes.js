const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAdminDashboard,
  getPendingProjects,
} = require("../controllers/adminController");

router.get(
  "/dashboard",
  verifyToken,
  adminMiddleware,
  getAdminDashboard
);
router.get(
  "/projects/pending",
  verifyToken,
  adminMiddleware,
  getPendingProjects
);

module.exports = router;