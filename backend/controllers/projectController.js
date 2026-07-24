const Project = require("../models/Project");

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

  if (role !== "farmer") {
    return res.status(403).json({
      message: "Only farmers can create projects",
    });
  }

  if (!title || !crop_type || !target_amount || !deadline) {
    return res.status(400).json({
      message: "Title, crop type, target amount and deadline are required",
    });
  }

  const projectData = {
    farmer_id,
    title,
    description: description || "",
    crop_type,
    target_amount,
    deadline,
  };

  Project.createProject(projectData, (error, result) => {
    if (error) {
      console.error("Create project error:", error);

      return res.status(500).json({
        message: "Database error",
      });
    }

    return res.status(201).json({
      message: "Project created successfully",
      project: {
        id: result.insertId,
        farmer_id,
        title,
        description: description || "",
        crop_type,
        target_amount,
        deadline,
        status: "pending",
      },
    });
  });
};


const uploadDocuments = async (req, res) => {
  try {
    const { project_id } = req.body;

    if (!project_id) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }

    const documents = [];

    const addDocument = (fieldName, documentType) => {
      if (req.files[fieldName]) {
        const file = req.files[fieldName][0];

        documents.push({
          project_id,
          document_type: documentType,
          file_name: file.filename,
          file_path: file.path,
        });
      }
    };

    addDocument("nid", "NID");
    addDocument("land_deed", "LAND_DEED");
    addDocument("land_image", "LAND_IMAGE");

    if (documents.length === 0) {
      return res.status(400).json({
        message: "No valid files uploaded",
      });
    }

    let completed = 0;
    const uploadedFiles = [];

    documents.forEach((documentData) => {
      Project.uploadDocument(documentData, (error) => {
        if (error) {
          console.error("Document upload database error:", error);

          if (!res.headersSent) {
            return res.status(500).json({
              message: "Database error while saving documents",
            });
          }

          return;
        }

        uploadedFiles.push({
          document_type: documentData.document_type,
          file_name: documentData.file_name,
        });

        completed++;

        if (completed === documents.length && !res.headersSent) {
          return res.status(201).json({
            message: "Documents uploaded successfully",
            files: uploadedFiles,
          });
        }
      });
    });
  } catch (error) {
    console.error("Upload documents error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProject,
  uploadDocuments,
};