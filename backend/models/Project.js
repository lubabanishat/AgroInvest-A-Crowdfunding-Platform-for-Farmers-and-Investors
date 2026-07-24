const db = require("../config/db");

const createProject = (projectData, callback) => {
  const query = `
    INSERT INTO projects
    (farmer_id, title, description, crop_type, target_amount, deadline)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      projectData.farmer_id,
      projectData.title,
      projectData.description,
      projectData.crop_type,
      projectData.target_amount,
      projectData.deadline,
    ],
    callback
  );
};

const uploadDocument = (documentData, callback) => {
  const query = `
    INSERT INTO project_documents
    (project_id, document_type, file_name, file_path)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      documentData.project_id,
      documentData.document_type,
      documentData.file_name,
      documentData.file_path,
    ],
    callback
  );
};

module.exports = {
  createProject,
  uploadDocument,
};