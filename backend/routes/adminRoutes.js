const express = require("express");

const router = express.Router();

const verifyToken =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const {
  getAdminDashboard,

  getPendingFarmers,
  approveFarmer,
  rejectFarmer,

  getPendingProjects,
  getProjectDocuments,
  approveProject,
  rejectProject,

  getProjectsForProfit,
} = require("../controllers/adminController");


/* =========================
   ADMIN DASHBOARD
========================= */

router.get(
  "/dashboard",
  verifyToken,
  adminMiddleware,
  getAdminDashboard
);


/* =========================
   FARMER VERIFICATION
========================= */

router.get(
  "/farmers/pending",
  verifyToken,
  adminMiddleware,
  getPendingFarmers
);

router.put(
  "/farmers/:id/approve",
  verifyToken,
  adminMiddleware,
  approveFarmer
);

router.put(
  "/farmers/:id/reject",
  verifyToken,
  adminMiddleware,
  rejectFarmer
);


/* =========================
   PROJECT VERIFICATION
========================= */

router.get(
  "/projects/pending",
  verifyToken,
  adminMiddleware,
  getPendingProjects
);

router.get(
  "/projects/:id/documents",
  verifyToken,
  adminMiddleware,
  getProjectDocuments
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


/* =========================
   PROFIT MANAGEMENT
========================= */

router.get(
  "/projects/profit",
  verifyToken,
  adminMiddleware,
  getProjectsForProfit
);


/* =========================
   EXPORT
========================= */

module.exports = router;