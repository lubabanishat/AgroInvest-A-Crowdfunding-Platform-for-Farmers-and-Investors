const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Register User
const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!["farmer", "investor"].includes(role)) {
      return res.status(400).json({
        message: "Role must be farmer or investor",
      });
    }

    const checkUserQuery = "SELECT id FROM users WHERE email = ?";

    db.query(checkUserQuery, [email], async (checkError, results) => {
      if (checkError) {
        console.error(checkError);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = `
        INSERT INTO users (full_name, email, password, role)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertQuery,
        [full_name, email, hashedPassword, role],
        (insertError, result) => {
          if (insertError) {
            console.error(insertError);
            return res.status(500).json({
              message: "Registration failed",
            });
          }

          return res.status(201).json({
            message: "User registered successfully",
            user: {
              id: result.insertId,
              full_name,
              email,
              role,
            },
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (error, results) => {
      if (error) {
        console.error("Login database error:", error);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const user = results[0];

      const passwordMatched = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatched) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};