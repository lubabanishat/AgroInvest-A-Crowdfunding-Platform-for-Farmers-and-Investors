const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "agroinvest_db",
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((error, connection) => {
  if (error) {
    console.error("❌ Database connection failed:", error.message);
    return;
  }

  console.log("✅ Connected to MySQL Database!");
  connection.release();
});

module.exports = db;