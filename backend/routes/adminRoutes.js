const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAdminDashboard,
  getPendingProjects,
  approveProject,
  rejectProject,
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
router.put(
  "/projects/:id/approve",
  verifyToken,
  adminMiddleware,
  approveProject
);
router.put(
  "/projects/:id/reject",
  verifyToken,
  adminMiddleware,
  rejectProject
);

module.exports = router;