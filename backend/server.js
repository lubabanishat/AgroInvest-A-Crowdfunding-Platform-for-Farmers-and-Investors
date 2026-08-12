const verifyToken = require("./middleware/authMiddleware");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const adminRoutes = require("./routes/adminRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const profitRoutes = require("./routes/profitRoutes");

// NEW FARMER ROUTES
const farmerRoutes = require("./routes/farmerRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


/* =========================
   SERVE UPLOADED FILES
========================= */

app.use(
  "/uploads",
  express.static("uploads")
);


/* =========================
   API ROUTES
========================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/investments",
  investmentRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/profits",
  profitRoutes
);

// FARMER ROUTES
app.use(
  "/api/farmer",
  farmerRoutes
);


/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
  res.send(
    "🚀 AgroInvest Backend Server is Running..."
  );
});


/* =========================
   PROTECTED PROFILE ROUTE
========================= */

app.get(
  "/api/profile",
  verifyToken,
  (req, res) => {
    res.status(200).json({
      message:
        "Protected route accessed successfully.",
      user: req.user,
    });
  }
);


/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});