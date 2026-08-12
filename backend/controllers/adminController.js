const db = require("../config/db");

/* =========================
   ADMIN DASHBOARD
========================= */

const getAdminDashboard = (req, res) => {
  const dashboardQuery = `
    SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'farmer') AS totalFarmers,
      (SELECT COUNT(*) FROM users WHERE role = 'investor') AS totalInvestors,
      (SELECT COUNT(*) FROM projects) AS totalProjects,
      (SELECT COUNT(*) FROM projects WHERE status = 'pending') AS pendingProjects,
      (SELECT COUNT(*) FROM projects WHERE status = 'approved') AS approvedProjects,
      (SELECT COUNT(*) FROM projects WHERE status = 'rejected') AS rejectedProjects,
      (SELECT COUNT(*) FROM projects WHERE status = 'completed') AS completedProjects,
      (
        SELECT COUNT(*)
        FROM users
        WHERE role = 'farmer'
          AND verification_status = 'pending'
      ) AS pendingFarmers
  `;

  db.query(dashboardQuery, (error, results) => {
    if (error) {
      console.error("Admin dashboard error:", error);

      return res.status(500).json({
        message: "Failed to load dashboard",
      });
    }

    return res.status(200).json({
      message: "Admin Dashboard",
      data: results[0],
    });
  });
};

/* =========================
   GET PENDING FARMERS
========================= */

const getPendingFarmers = (req, res) => {
  const query = `
    SELECT
      id,
      full_name,
      email,
      role,
      verification_status,
      created_at
    FROM users
    WHERE role = 'farmer'
      AND verification_status = 'pending'
    ORDER BY created_at DESC
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error(
        "Pending farmers error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to load pending farmers",
      });
    }

    return res.status(200).json({
      message: "Pending Farmers",
      farmers: results,
    });
  });
};

/* =========================
   APPROVE FARMER
========================= */

const approveFarmer = (req, res) => {
  const farmerId = req.params.id;

  const checkQuery = `
    SELECT
      id,
      role,
      verification_status
    FROM users
    WHERE id = ?
  `;

  db.query(
    checkQuery,
    [farmerId],
    (checkError, results) => {
      if (checkError) {
        console.error(
          "Farmer check error:",
          checkError
        );

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Farmer not found",
        });
      }

      const farmer = results[0];

      if (farmer.role !== "farmer") {
        return res.status(400).json({
          message:
            "Selected user is not a farmer",
        });
      }

      if (
        farmer.verification_status ===
        "approved"
      ) {
        return res.status(400).json({
          message:
            "Farmer is already approved",
        });
      }

      if (
        farmer.verification_status ===
        "rejected"
      ) {
        return res.status(400).json({
          message:
            "Rejected farmer cannot be approved",
        });
      }

      const updateQuery = `
        UPDATE users
        SET verification_status = 'approved'
        WHERE id = ?
      `;

      db.query(
        updateQuery,
        [farmerId],
        (updateError) => {
          if (updateError) {
            console.error(
              "Farmer approval error:",
              updateError
            );

            return res.status(500).json({
              message:
                "Failed to approve farmer",
            });
          }

          return res.status(200).json({
            message:
              "Farmer approved successfully",
            farmer_id:
              Number(farmerId),
            verification_status:
              "approved",
          });
        }
      );
    }
  );
};

/* =========================
   REJECT FARMER
========================= */

const rejectFarmer = (req, res) => {
  const farmerId = req.params.id;

  const checkQuery = `
    SELECT
      id,
      role,
      verification_status
    FROM users
    WHERE id = ?
  `;

  db.query(
    checkQuery,
    [farmerId],
    (checkError, results) => {
      if (checkError) {
        console.error(
          "Farmer check error:",
          checkError
        );

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Farmer not found",
        });
      }

      const farmer = results[0];

      if (farmer.role !== "farmer") {
        return res.status(400).json({
          message:
            "Selected user is not a farmer",
        });
      }

      if (
        farmer.verification_status ===
        "rejected"
      ) {
        return res.status(400).json({
          message:
            "Farmer is already rejected",
        });
      }

      if (
        farmer.verification_status ===
        "approved"
      ) {
        return res.status(400).json({
          message:
            "Approved farmer cannot be rejected",
        });
      }

      const updateQuery = `
        UPDATE users
        SET verification_status = 'rejected'
        WHERE id = ?
      `;

      db.query(
        updateQuery,
        [farmerId],
        (updateError) => {
          if (updateError) {
            console.error(
              "Farmer rejection error:",
              updateError
            );

            return res.status(500).json({
              message:
                "Failed to reject farmer",
            });
          }

          return res.status(200).json({
            message:
              "Farmer rejected successfully",
            farmer_id:
              Number(farmerId),
            verification_status:
              "rejected",
          });
        }
      );
    }
  );
};

/* =========================
   GET PENDING PROJECTS
========================= */

const getPendingProjects = (req, res) => {
  const query = `
    SELECT
      p.id,
      p.title,
      p.description,
      p.crop_type,
      p.target_amount,
      p.deadline,
      p.status,
      u.full_name AS farmer_name
    FROM projects p
    JOIN users u
      ON p.farmer_id = u.id
    WHERE p.status = 'pending'
    ORDER BY p.created_at DESC
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error(
        "Pending projects error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to load pending projects",
      });
    }

    return res.status(200).json({
      message: "Pending Projects",
      projects: results,
    });
  });
};

/* =========================
   GET PROJECT DOCUMENTS
========================= */

const getProjectDocuments = (req, res) => {
  const projectId = req.params.id;

  const projectQuery = `
    SELECT
      p.id,
      p.title,
      p.description,
      p.crop_type,
      p.target_amount,
      p.deadline,
      p.status,
      u.full_name AS farmer_name,
      u.email AS farmer_email
    FROM projects p
    JOIN users u
      ON p.farmer_id = u.id
    WHERE p.id = ?
  `;

  db.query(
    projectQuery,
    [projectId],
    (
      projectError,
      projectResults
    ) => {
      if (projectError) {
        console.error(
          "Project fetch error:",
          projectError
        );

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (
        projectResults.length === 0
      ) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      const documentQuery = `
        SELECT
          id,
          project_id,
          document_type,
          file_name,
          file_path,
          uploaded_at
        FROM project_documents
        WHERE project_id = ?
        ORDER BY id ASC
      `;

      db.query(
        documentQuery,
        [projectId],
        (
          documentError,
          documents
        ) => {
          if (documentError) {
            console.error(
              "Project documents error:",
              documentError
            );

            return res.status(500).json({
              message:
                "Failed to load project documents",
            });
          }

          const formattedDocuments =
            documents.map(
              (document) => {
                const normalizedPath =
                  document.file_path.replace(
                    /\\/g,
                    "/"
                  );

                return {
                  ...document,
                  file_url:
                    `http://localhost:5000/${normalizedPath}`,
                };
              }
            );

          return res.status(200).json({
            message:
              "Project documents fetched successfully",

            project:
              projectResults[0],

            documents:
              formattedDocuments,
          });
        }
      );
    }
  );
};

/* =========================
   APPROVE PROJECT
========================= */

const approveProject = (req, res) => {
  const projectId = req.params.id;

  const checkQuery = `
    SELECT id, status
    FROM projects
    WHERE id = ?
  `;

  db.query(
    checkQuery,
    [projectId],
    (checkError, results) => {
      if (checkError) {
        console.error(
          "Project check error:",
          checkError
        );

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      const currentStatus =
        results[0].status;

      if (
        currentStatus === "approved"
      ) {
        return res.status(400).json({
          message:
            "Project is already approved",
        });
      }

      if (
        currentStatus === "completed"
      ) {
        return res.status(400).json({
          message:
            "Completed project cannot be approved again",
        });
      }

      if (
        currentStatus === "rejected"
      ) {
        return res.status(400).json({
          message:
            "Rejected projects cannot be approved",
        });
      }

      const updateQuery = `
        UPDATE projects
        SET status = 'approved'
        WHERE id = ?
      `;

      db.query(
        updateQuery,
        [projectId],
        (updateError) => {
          if (updateError) {
            console.error(
              "Project approval error:",
              updateError
            );

            return res.status(500).json({
              message:
                "Failed to approve project",
            });
          }

          return res.status(200).json({
            message:
              "Project approved successfully",
            project_id:
              Number(projectId),
            status: "approved",
          });
        }
      );
    }
  );
};

/* =========================
   REJECT PROJECT
========================= */

const rejectProject = (req, res) => {
  const projectId = req.params.id;

  const checkQuery = `
    SELECT id, status
    FROM projects
    WHERE id = ?
  `;

  db.query(
    checkQuery,
    [projectId],
    (checkError, results) => {
      if (checkError) {
        console.error(
          "Project check error:",
          checkError
        );

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      const currentStatus =
        results[0].status;

      if (
        currentStatus === "rejected"
      ) {
        return res.status(400).json({
          message:
            "Project is already rejected",
        });
      }

      if (
        currentStatus === "approved" ||
        currentStatus === "completed"
      ) {
        return res.status(400).json({
          message:
            "Approved or completed projects cannot be rejected",
        });
      }

      const updateQuery = `
        UPDATE projects
        SET status = 'rejected'
        WHERE id = ?
      `;

      db.query(
        updateQuery,
        [projectId],
        (updateError) => {
          if (updateError) {
            console.error(
              "Project rejection error:",
              updateError
            );

            return res.status(500).json({
              message:
                "Failed to reject project",
            });
          }

          return res.status(200).json({
            message:
              "Project rejected successfully",
            project_id:
              Number(projectId),
            status: "rejected",
          });
        }
      );
    }
  );
};

/* =========================
   GET PROJECTS FOR PROFIT
========================= */

const getProjectsForProfit = (req, res) => {
  const query = `
    SELECT
      p.id,
      p.title,
      p.crop_type,
      p.target_amount,
      p.status,
      p.total_revenue,
      p.profit_distributed,
      p.created_at,

      u.full_name AS farmer_name,

      COALESCE(
        SUM(
          CASE
            WHEN i.payment_status = 'completed'
            THEN i.amount
            ELSE 0
          END
        ),
        0
      ) AS total_investment,

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

    LEFT JOIN investments i
      ON p.id = i.project_id

    WHERE p.status IN (
      'approved',
      'completed'
    )

    GROUP BY
      p.id,
      p.title,
      p.crop_type,
      p.target_amount,
      p.status,
      p.total_revenue,
      p.profit_distributed,
      p.created_at,
      u.full_name

    ORDER BY p.created_at DESC
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error(
        "Profit projects error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to load profit projects",
      });
    }

    const projects = results.map(
      (project) => {
        const totalInvestment =
          Number(
            project.total_investment
          ) || 0;

        const totalRevenue =
          Number(
            project.total_revenue
          ) || 0;

        const netProfit =
          Boolean(
            project.profit_distributed
          )
            ? Math.max(
                0,
                totalRevenue -
                  totalInvestment
              )
            : 0;

        const farmerShare =
          Number(
            (
              netProfit * 0.7
            ).toFixed(2)
          );

        const investorShare =
          Number(
            (
              netProfit * 0.3
            ).toFixed(2)
          );

        let landImageUrl = null;

        if (project.land_image) {
          const normalizedPath =
            project.land_image.replace(
              /\\/g,
              "/"
            );

          landImageUrl =
            `http://localhost:5000/${normalizedPath}`;
        }

        return {
          ...project,

          target_amount:
            Number(
              project.target_amount
            ) || 0,

          total_investment:
            totalInvestment,

          total_revenue:
            totalRevenue,

          net_profit:
            netProfit,

          farmer_share:
            farmerShare,

          investor_share:
            investorShare,

          profit_distributed:
            Boolean(
              project.profit_distributed
            ),

          land_image_url:
            landImageUrl,
        };
      }
    );

    return res.status(200).json({
      message:
        "Profit projects fetched successfully",

      projects,
    });
  });
};

/* =========================
   EXPORTS
========================= */

module.exports = {
  getAdminDashboard,

  getPendingFarmers,
  approveFarmer,
  rejectFarmer,

  getPendingProjects,
  getProjectDocuments,
  approveProject,
  rejectProject,

  getProjectsForProfit,
};