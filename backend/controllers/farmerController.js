const db = require("../config/db");

/* =========================
   FARMER DASHBOARD
========================= */

const getFarmerDashboard = (req, res) => {
  const farmerId = req.user.id;

  /* =========================
     CHECK FARMER ROLE
  ========================= */

  if (req.user.role !== "farmer") {
    return res.status(403).json({
      message: "Only farmers can access this dashboard.",
    });
  }

  /* =========================
     GET FARMER PROFILE
  ========================= */

  const farmerQuery = `
    SELECT
      id,
      full_name,
      email,
      verification_status,
      created_at
    FROM users
    WHERE id = ?
      AND role = 'farmer'
    LIMIT 1
  `;

  db.query(
    farmerQuery,
    [farmerId],
    (farmerError, farmerResults) => {
      if (farmerError) {
        console.error(
          "Farmer profile error:",
          farmerError
        );

        return res.status(500).json({
          message: "Database error.",
        });
      }

      if (farmerResults.length === 0) {
        return res.status(404).json({
          message: "Farmer not found.",
        });
      }

      const farmer = farmerResults[0];

      /* =========================
         GET FARMER PROJECTS
      ========================= */

      const projectsQuery = `
        SELECT
          p.id,
          p.title,
          p.description,
          p.crop_type,
          p.target_amount,
          p.deadline,
          p.status,
          p.total_revenue,
          p.profit_distributed,
          p.created_at,

          COALESCE(
            SUM(
              CASE
                WHEN i.payment_status = 'completed'
                THEN i.amount
                ELSE 0
              END
            ),
            0
          ) AS total_raised,

          COUNT(
            DISTINCT CASE
              WHEN i.payment_status = 'completed'
              THEN i.investor_id
            END
          ) AS total_investors,

          (
            SELECT pd.file_path
            FROM project_documents pd
            WHERE pd.project_id = p.id
              AND pd.document_type = 'LAND_IMAGE'
            ORDER BY pd.id DESC
            LIMIT 1
          ) AS land_image

        FROM projects p

        LEFT JOIN investments i
          ON p.id = i.project_id

        WHERE p.farmer_id = ?

        GROUP BY
          p.id,
          p.title,
          p.description,
          p.crop_type,
          p.target_amount,
          p.deadline,
          p.status,
          p.total_revenue,
          p.profit_distributed,
          p.created_at

        ORDER BY p.created_at DESC
      `;

      db.query(
        projectsQuery,
        [farmerId],
        (projectsError, projectResults) => {
          if (projectsError) {
            console.error(
              "Farmer projects error:",
              projectsError
            );

            return res.status(500).json({
              message: "Database error.",
            });
          }

          /* =========================
             FORMAT PROJECTS
          ========================= */

          const projects = projectResults.map(
            (project) => {
              const targetAmount =
                Number(project.target_amount) || 0;

              const totalRaised =
                Number(project.total_raised) || 0;

              const totalRevenue =
                Number(project.total_revenue) || 0;

              const fundingProgress =
                targetAmount > 0
                  ? Math.min(
                      100,
                      Number(
                        (
                          (totalRaised / targetAmount) *
                          100
                        ).toFixed(2)
                      )
                    )
                  : 0;

              const netProfit =
                project.profit_distributed
                  ? Math.max(
                      0,
                      totalRevenue - totalRaised
                    )
                  : 0;

              const farmerProfitShare =
                Number(
                  (netProfit * 0.7).toFixed(2)
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
                id: project.id,

                title: project.title,

                description:
                  project.description,

                crop_type:
                  project.crop_type,

                target_amount:
                  targetAmount,

                deadline:
                  project.deadline,

                status:
                  project.status,

                total_raised:
                  totalRaised,

                funding_progress:
                  fundingProgress,

                total_investors:
                  Number(
                    project.total_investors
                  ) || 0,

                total_revenue:
                  totalRevenue,

                net_profit:
                  netProfit,

                farmer_profit_share:
                  farmerProfitShare,

                profit_distributed:
                  Boolean(
                    project.profit_distributed
                  ),

                land_image_url:
                  landImageUrl,

                created_at:
                  project.created_at,
              };
            }
          );

          /* =========================
             DASHBOARD SUMMARY
          ========================= */

          const totalProjects =
            projects.length;

          const activeProjects =
            projects.filter(
              (project) =>
                project.status === "approved"
            ).length;

          const completedProjects =
            projects.filter(
              (project) =>
                project.status === "completed"
            ).length;

          const pendingProjects =
            projects.filter(
              (project) =>
                project.status === "pending"
            ).length;

          const totalRaised =
            projects.reduce(
              (total, project) =>
                total +
                Number(
                  project.total_raised
                ),
              0
            );

          const investorIdsQuery = `
            SELECT
              COUNT(
                DISTINCT i.investor_id
              ) AS total_investors
            FROM investments i
            JOIN projects p
              ON i.project_id = p.id
            WHERE p.farmer_id = ?
              AND i.payment_status = 'completed'
          `;

          db.query(
            investorIdsQuery,
            [farmerId],
            (
              investorError,
              investorResults
            ) => {
              if (investorError) {
                console.error(
                  "Farmer investor count error:",
                  investorError
                );

                return res.status(500).json({
                  message: "Database error.",
                });
              }

              const totalInvestors =
                Number(
                  investorResults[0]
                    ?.total_investors
                ) || 0;

              const totalFarmerProfit =
                projects.reduce(
                  (total, project) =>
                    total +
                    Number(
                      project.farmer_profit_share
                    ),
                  0
                );

              return res.status(200).json({
                message:
                  "Farmer dashboard fetched successfully.",

                farmer: {
                  id: farmer.id,

                  full_name:
                    farmer.full_name,

                  email:
                    farmer.email,

                  verification_status:
                    farmer.verification_status,
                },

                summary: {
                  total_projects:
                    totalProjects,

                  active_projects:
                    activeProjects,

                  completed_projects:
                    completedProjects,

                  pending_projects:
                    pendingProjects,

                  total_investors:
                    totalInvestors,

                  total_raised:
                    totalRaised,

                  total_profit_share:
                    totalFarmerProfit,
                },

                projects,
              });
            }
          );
        }
      );
    }
  );
};

module.exports = {
  getFarmerDashboard,
};