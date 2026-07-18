const express = require("express");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("🚀 AgroInvest Backend Server is Running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});