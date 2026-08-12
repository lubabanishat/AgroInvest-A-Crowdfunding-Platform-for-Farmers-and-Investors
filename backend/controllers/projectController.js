const Project = require("../models/Project");
const db = require("../config/db");

/* =========================
   CREATE PROJECT
========================= */

const createProject = (req, res) => {
  const {
    title,
    description,
    crop_type,
    target_amount,
    deadline,
  } = req.body;

  const farmer_id = req.user.id;
  const role = req.user.role;

  /* =========================
     CHECK ROLE
  ========================= */

  if (role !== "farmer") {
    return res.status(403).json({
      message: "Only farmers can create projects",
    });
  }

  /* =========================
     VALIDATION
  ========================= */

  if (
    !title ||
    !crop_type ||
    !target_amount ||
    !deadline
  ) {
    return res.status(400).json({
      message:
        "Title, crop type, target amount and deadline are required",
    });
  }

  /* =========================
     CHECK FARMER VERIFICATION
  ========================= */

  const checkFarmerQuery = `
    SELECT
      id,
      verification_status
    FROM users
    WHERE id = ?
      AND role = 'farmer'
  `;

  db.query(
    checkFarmerQuery,
    [farmer_id],
    (checkError, results) => {
      if (checkError) {
        console.error(
          "Farmer verification check error:",
          checkError
        );

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Farmer account not found",
        });
      }

      const verificationStatus =
        results[0].verification_status;

      if (verificationStatus === "pending") {
        return res.status(403).json({
          message:
            "Your farmer account is still pending admin verification.",
        });
      }

      if (verificationStatus === "rejected") {
        return res.status(403).json({
          message:
            "Your farmer account has been rejected. You cannot create a project.",
        });
      }

      if (verificationStatus !== "approved") {
        return res.status(403).json({
          message:
            "Your farmer account is not verified.",
        });
      }

      /* =========================
         CREATE PROJECT
      ========================= */

      const projectData = {
        farmer_id,
        title,
        description: description || "",
        crop_type,
        target_amount,
        deadline,
      };

      Project.createProject(
        projectData,
        (error, result) => {
          if (error) {
            console.error(
              "Create project error:",
              error
            );

            return res.status(500).json({
              message: "Database error",
            });
          }

          return res.status(201).json({
            message:
              "Project created successfully",
            project: {
              id: result.insertId,
              farmer_id,
              title,
              description:
                description || "",
              crop_type,
              target_amount,
              deadline,
              status: "pending",
            },
          });
        }
      );
    }
  );
};

/* =========================
   UPLOAD PROJECT DOCUMENTS
========================= */

const uploadDocuments = async (req, res) => {
  try {
    const { project_id } = req.body;

    if (!project_id) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    if (
      !req.files ||
      Object.keys(req.files).length === 0
    ) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }

    const documents = [];

    const addDocument = (
      fieldName,
      documentType
    ) => {
      if (req.files[fieldName]) {
        const file =
          req.files[fieldName][0];

        documents.push({
          project_id,
          document_type: documentType,
          file_name: file.filename,
          file_path: file.path,
        });
      }
    };

    addDocument("nid", "NID");
    addDocument(
      "land_deed",
      "LAND_DEED"
    );
    addDocument(
      "land_image",
      "LAND_IMAGE"
    );

    if (documents.length === 0) {
      return res.status(400).json({
        message:
          "No valid files uploaded",
      });
    }

    let completed = 0;
    const uploadedFiles = [];

    documents.forEach(
      (documentData) => {
        Project.uploadDocument(
          documentData,
          (error) => {
            if (error) {
              console.error(
                "Document upload database error:",
                error
              );

              if (!res.headersSent) {
                return res
                  .status(500)
                  .json({
                    message:
                      "Database error while saving documents",
                  });
              }

              return;
            }

            uploadedFiles.push({
              document_type:
                documentData.document_type,
              file_name:
                documentData.file_name,
            });

            completed++;

            if (
              completed ===
                documents.length &&
              !res.headersSent
            ) {
              return res
                .status(201)
                .json({
                  message:
                    "Documents uploaded successfully",
                  files:
                    uploadedFiles,
                });
            }
          }
        );
      }
    );
  } catch (error) {
    console.error(
      "Upload documents error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   GET ALL APPROVED PROJECTS
========================= */

const getApprovedProjects = (
  req,
  res
) => {
  Project.getApprovedProjects(
    (error, projects) => {
      if (error) {
        console.error(
          "Get approved projects error:",
          error
        );

        return res.status(500).json({
          message: "Database error",
        });
      }

      return res.status(200).json({
        message:
          "Approved projects fetched successfully",
        projects,
      });
    }
  );
};

/* =========================
   GET SINGLE PROJECT DETAILS
========================= */

const getProjectById = (
  req,
  res
) => {
  const projectId =
    req.params.id;

  Project.getProjectById(
    projectId,
    (error, results) => {
      if (error) {
        console.error(
          "Get project details error:",
          error
        );

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message:
            "Project not found",
        });
      }

      return res.status(200).json({
        message:
          "Project details fetched successfully",
        project: results[0],
      });
    }
  );
};

/* =========================
   EXPORTS
========================= */

module.exports = {
  createProject,
  uploadDocuments,
  getApprovedProjects,
  getProjectById,
};