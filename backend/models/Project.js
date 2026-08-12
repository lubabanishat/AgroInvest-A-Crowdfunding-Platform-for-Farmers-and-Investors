const db = require("../config/db");

/* =========================
   CREATE PROJECT
========================= */

const createProject = (projectData, callback) => {
  const query = `
    INSERT INTO projects
    (
      farmer_id,
      title,
      description,
      crop_type,
      target_amount,
      deadline
    )
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

/* =========================
   UPLOAD PROJECT DOCUMENT
========================= */

const uploadDocument = (documentData, callback) => {
  const query = `
    INSERT INTO project_documents
    (
      project_id,
      document_type,
      file_name,
      file_path
    )
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

/* =========================
   GET PUBLIC PROJECTS

   Approved + Completed
========================= */

const getApprovedProjects = (callback) => {
  const query = `
    SELECT
      p.id,
      p.title,
      p.description,
      p.crop_type,
      p.target_amount,
      p.deadline,
      p.status,

      u.full_name AS farmer_name,

      (
        SELECT pd.file_name
        FROM project_documents pd
        WHERE pd.project_id = p.id
          AND pd.document_type = 'LAND_IMAGE'
        ORDER BY pd.id DESC
        LIMIT 1
      ) AS land_image_name,

      (
        SELECT pd.file_path
        FROM project_documents pd
        WHERE pd.project_id = p.id
          AND pd.document_type = 'LAND_IMAGE'
        ORDER BY pd.id DESC
        LIMIT 1
      ) AS land_image

    FROM projects p

    JOIN users u
      ON p.farmer_id = u.id

    WHERE p.status IN ('approved', 'completed')

    ORDER BY p.created_at DESC
  `;

  db.query(query, callback);
};

/* =========================
   GET SINGLE PROJECT DETAILS

   Approved + Completed
========================= */

const getProjectById = (projectId, callback) => {
  const query = `
    SELECT
      p.id,
      p.title,
      p.description,
      p.crop_type,
      p.target_amount,
      p.deadline,
      p.status,

      u.full_name AS farmer_name,
      u.email AS farmer_email,

      (
        SELECT pd.file_name
        FROM project_documents pd
        WHERE pd.project_id = p.id
          AND pd.document_type = 'LAND_IMAGE'
        ORDER BY pd.id DESC
        LIMIT 1
      ) AS land_image_name,

      (
        SELECT pd.file_path
        FROM project_documents pd
        WHERE pd.project_id = p.id
          AND pd.document_type = 'LAND_IMAGE'
        ORDER BY pd.id DESC
        LIMIT 1
      ) AS land_image

    FROM projects p

    JOIN users u
      ON p.farmer_id = u.id

    WHERE p.id = ?
      AND p.status IN ('approved', 'completed')

    LIMIT 1
  `;

  db.query(
    query,
    [projectId],
    callback
  );
};

/* =========================
   EXPORTS
========================= */

module.exports = {
  createProject,
  uploadDocument,
  getApprovedProjects,
  getProjectById,
};