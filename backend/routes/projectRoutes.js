const express = require("express");

const {
  createProject,
  uploadDocuments,
} = require("../controllers/projectController");

const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Create Project
router.post("/create", verifyToken, createProject);

// Upload Project Documents
router.post(
  "/upload-documents",
  verifyToken,
  upload.fields([
    { name: "nid", maxCount: 1 },
    { name: "land_deed", maxCount: 1 },
    { name: "land_image", maxCount: 1 },
  ]),
  uploadDocuments
);

module.exports = router;