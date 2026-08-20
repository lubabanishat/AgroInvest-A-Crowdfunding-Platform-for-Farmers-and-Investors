const express =
  require("express");

const {
  createProject,
  uploadDocuments,
  getApprovedProjects,
  getProjectById,
} = require(
  "../controllers/projectController"
);

const verifyToken =
  require(
    "../middleware/authMiddleware"
  );

const upload =
  require(
    "../middleware/uploadMiddleware"
  );

const router =
  express.Router();

/* =========================
   GET APPROVED PROJECTS
========================= */

router.get(
  "/",
  getApprovedProjects
);

/* =========================
   GET SINGLE PROJECT
========================= */

router.get(
  "/:id",
  getProjectById
);

/* =========================
   CREATE PROJECT
========================= */

router.post(
  "/create",
  verifyToken,
  createProject
);

/* =========================
   UPLOAD DOCUMENTS
========================= */

router.post(
  "/upload-documents",

  verifyToken,

  (req, res, next) => {
    const uploadHandler =
      upload.fields([
        {
          name: "nid",
          maxCount: 1,
        },
        {
          name: "land_deed",
          maxCount: 1,
        },
        {
          name: "land_image",
          maxCount: 1,
        },
      ]);

    uploadHandler(
      req,
      res,
      (error) => {
        if (error) {
          console.error(
            "Multer upload error:",
            error
          );

          return res
            .status(400)
            .json({
              message:
                error.message ||
                "File upload failed",
            });
        }

        next();
      }
    );
  },

  uploadDocuments
);

module.exports = router;