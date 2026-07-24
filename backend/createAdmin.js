const bcrypt = require("bcrypt");
const db = require("./config/db");
require("dotenv").config();

const createAdmin = async () => {
  try {
    const fullName = "AgroInvest Admin";
    const email = "admin@agroinvest.com";
    const plainPassword = "Admin123";
    const role = "admin";

    // Check if admin already exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.log(err);
          return;
        }

        if (results.length > 0) {
          console.log("Admin already exists.");
          process.exit();
        }

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        db.query(
          "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
          [fullName, email, hashedPassword, role],
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Admin account created successfully!");
              console.log("Email:", email);
              console.log("Password:", plainPassword);
            }

            process.exit();
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

createAdmin();