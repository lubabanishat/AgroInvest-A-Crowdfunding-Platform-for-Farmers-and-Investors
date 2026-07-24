const verifyToken = require("./middleware/authMiddleware");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes); 
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("🚀 AgroInvest Backend Server is Running...");
});

app.get("/api/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully.",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});