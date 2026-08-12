const Profit = require("../models/profitModel");

/* =========================================
   UPDATE PROJECT REVENUE - ADMIN
========================================= */

const updateRevenue = (req, res) => {
  const { projectId } = req.params;
  const { total_revenue } = req.body;

  const revenue = Number(total_revenue);

  if (
    !total_revenue ||
    Number.isNaN(revenue) ||
    revenue <= 0
  ) {
    return res.status(400).json({
      message: "Please provide a valid total revenue.",
    });
  }

  Profit.getFarmerProfitReport(
    projectId,
    (err, results) => {
      if (err) {
        console.error(
          "Get project before revenue update error:",
          err
        );

        return res.status(500).json({
          message: "Database error.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Project not found.",
        });
      }

      const project = results[0];

      const fundingGoal =
        Number(project.target_amount) || 0;

      const totalInvestment =
        Number(project.total_investment) || 0;

      /* =========================================
         FUNDING PERCENTAGE
      ========================================= */

      const fundingPercentage =
        fundingGoal > 0
          ? (totalInvestment / fundingGoal) * 100
          : 0;

      /* =========================================
         MINIMUM 70% FUNDING CHECK
      ========================================= */

      if (fundingPercentage < 70) {
        return res.status(400).json({
          message:
            "Project must reach at least 70% funding before it can be completed.",

          funding_goal: fundingGoal,

          total_investment: totalInvestment,

          funding_percentage: Number(
            fundingPercentage.toFixed(2)
          ),

          minimum_required_percentage: 70,

          minimum_required_amount: Number(
            (fundingGoal * 0.7).toFixed(2)
          ),
        });
      }

      /* =========================================
         REVENUE CANNOT BE LOWER THAN
         ACTUAL INVESTMENT
      ========================================= */

      if (revenue < totalInvestment) {
        return res.status(400).json({
          message:
            "Total revenue cannot be lower than the actual total investment.",
        });
      }

      /* =========================================
         UPDATE PROJECT
      ========================================= */

      Profit.updateRevenue(
        projectId,
        revenue,
        (err, result) => {
          if (err) {
            console.error(
              "Update revenue error:",
              err
            );

            return res.status(500).json({
              message: "Database error.",
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Project not found.",
            });
          }

          /* =========================================
             PROFIT CALCULATION
          ========================================= */

          const netProfit =
            revenue - totalInvestment;

          const farmerShare = Number(
            (netProfit * 0.7).toFixed(2)
          );

          const investorShare = Number(
            (netProfit * 0.3).toFixed(2)
          );

          return res.status(200).json({
            message:
              "Project completed and profit report generated successfully.",

            project_id: Number(projectId),

            project_name: project.title,

            funding_goal: fundingGoal,

            total_investment: totalInvestment,

            funding_percentage: Number(
              fundingPercentage.toFixed(2)
            ),

            total_revenue: revenue,

            net_profit: netProfit,

            farmer_share: farmerShare,

            investor_share: investorShare,

            project_status: "completed",

            profit_distributed: true,
          });
        }
      );
    }
  );
};


/* =========================================
   FARMER PROFIT REPORT
========================================= */

const getFarmerReport = (req, res) => {
  const { projectId } = req.params;

  Profit.getFarmerProfitReport(
    projectId,
    (err, results) => {
      if (err) {
        console.error(
          "Farmer profit report error:",
          err
        );

        return res.status(500).json({
          message: "Database error.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Project not found.",
        });
      }

      const project = results[0];

      const fundingGoal =
        Number(project.target_amount) || 0;

      const totalInvestment =
        Number(project.total_investment) || 0;

      const totalRevenue =
        Number(project.total_revenue) || 0;

      const fundingPercentage =
        fundingGoal > 0
          ? Number(
              (
                (totalInvestment / fundingGoal) *
                100
              ).toFixed(2)
            )
          : 0;

      const netProfit = Math.max(
        0,
        totalRevenue - totalInvestment
      );

      const farmerShare = Number(
        (netProfit * 0.7).toFixed(2)
      );

      const investorShare = Number(
        (netProfit * 0.3).toFixed(2)
      );

      return res.status(200).json({
        project_id: project.id,

        project_name: project.title,

        project_status: project.status,

        funding_goal: fundingGoal,

        total_investment: totalInvestment,

        funding_percentage: fundingPercentage,

        total_revenue: totalRevenue,

        net_profit: netProfit,

        farmer_profit_percentage: 70,

        investor_profit_percentage: 30,

        farmer_share: farmerShare,

        investor_share: investorShare,

        profit_distributed: Boolean(
          project.profit_distributed
        ),
      });
    }
  );
};


/* =========================================
   INVESTOR PROFIT REPORT
========================================= */

const getInvestorReport = (req, res) => {
  const { projectId } = req.params;

  const investorId = req.user.id;

  Profit.getFarmerProfitReport(
    projectId,
    (err, projectResult) => {
      if (err) {
        console.error(
          "Investor report project error:",
          err
        );

        return res.status(500).json({
          message: "Database error.",
        });
      }

      if (projectResult.length === 0) {
        return res.status(404).json({
          message: "Project not found.",
        });
      }

      const project = projectResult[0];

      Profit.getInvestorInvestment(
        projectId,
        investorId,
        (err, investmentResult) => {
          if (err) {
            console.error(
              "Investor investment error:",
              err
            );

            return res.status(500).json({
              message: "Database error.",
            });
          }

          if (investmentResult.length === 0) {
            return res.status(404).json({
              message:
                "You have no completed investment in this project.",
            });
          }

          const investedAmount =
            Number(
              investmentResult[0].amount
            ) || 0;

          const fundingGoal =
            Number(project.target_amount) || 0;

          const totalInvestment =
            Number(
              project.total_investment
            ) || 0;

          const totalRevenue =
            Number(
              project.total_revenue
            ) || 0;

          const fundingPercentage =
            fundingGoal > 0
              ? Number(
                  (
                    (totalInvestment /
                      fundingGoal) *
                    100
                  ).toFixed(2)
                )
              : 0;

          const netProfit = Math.max(
            0,
            totalRevenue -
              totalInvestment
          );

          /* =========================
             INVESTORS RECEIVE 30%
          ========================= */

          const investorPool = Number(
            (netProfit * 0.3).toFixed(2)
          );

          /* =========================
             INVESTOR'S RATIO
             BASED ON ACTUAL RAISED MONEY
          ========================= */

          const investmentRatio =
            totalInvestment > 0
              ? investedAmount /
                totalInvestment
              : 0;

          const profitEarned = Number(
            (
              investorPool *
              investmentRatio
            ).toFixed(2)
          );

          const totalReturned = Number(
            (
              investedAmount +
              profitEarned
            ).toFixed(2)
          );

          return res.status(200).json({
            project_id: project.id,

            project_name: project.title,

            project_status: project.status,

            funding_goal: fundingGoal,

            project_total_investment:
              totalInvestment,

            funding_percentage:
              fundingPercentage,

            invested_amount:
              investedAmount,

            total_revenue:
              totalRevenue,

            net_profit:
              netProfit,

            investor_profit_pool:
              investorPool,

            investment_ratio: Number(
              (
                investmentRatio *
                100
              ).toFixed(2)
            ),

            profit_earned:
              profitEarned,

            total_returned:
              totalReturned,

            payment_status:
              project.profit_distributed
                ? "Paid"
                : "Pending",

            profit_distributed:
              Boolean(
                project.profit_distributed
              ),
          });
        }
      );
    }
  );
};


/* =========================================
   EXPORTS
========================================= */

module.exports = {
  updateRevenue,
  getFarmerReport,
  getInvestorReport,
};