const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query, transaction } = require("../config/database");
const { body, validationResult } = require("express-validator");
const { createNotification } = require("../services/notificationService");

/**
 * Generate JWT tokens
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });

  return { accessToken, refreshToken };
};

/**
 * Register new user
 */
const register = [
  // Validation
  body("name")
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Name must be between 2-255 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { name, email, password } = req.body;

      // Check if user exists
      const existingUsers = await query(
        "SELECT id FROM users WHERE email = ?",
        [email],
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user and initialize credits in transaction
      const result = await transaction(async (connection) => {
        // Insert user
        const [userResult] = await connection.execute(
          "INSERT INTO users (name, email, password, plan, status) VALUES (?, ?, ?, ?, ?)",
          [name, email, hashedPassword, "Free", "active"],
        );

        const userId = userResult.insertId;

        // Initialize user credits with Free plan limits
        await connection.execute(
          `INSERT INTO user_credits (
            user_id,
            daily_limit,
            cards_generated_today,
            last_reset_date,
            batch_processing_enabled,
            custom_cards_enabled,
            api_access_enabled
          ) VALUES (?, ?, ?, CURDATE(), ?, ?, ?)`,
          [userId, 5, 0, false, false, false],
        );

        // Notification
        await createNotification(
          "signup",
          "New User Signup",
          `User ${name} (${email}) has registered.`,
        );

        return { userId };
      });

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(result.userId);

      // Get user data
      const users = await query(
        "SELECT id, name, email, plan, role, created_at FROM users WHERE id = ?",
        [result.userId],
      );

      // Get user credits
      const credits = await query(
        "SELECT daily_limit, cards_generated_today, last_reset_date, batch_processing_enabled, custom_cards_enabled, api_access_enabled FROM user_credits WHERE user_id = ?",
        [result.userId],
      );

      res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: {
          user: users[0],
          credits: credits[0],
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed. Please try again.",
      });
    }
  },
];

/**
 * Login user
 */
const login = [
  // Validation
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),

  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Get user
      const users = await query(
        "SELECT id, name, email, password, plan, role, status, failed_login_attempts, account_locked_until FROM users WHERE email = ?",
        [email],
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const user = users[0];

      // Check if account is locked
      if (
        user.account_locked_until &&
        new Date(user.account_locked_until) > new Date()
      ) {
        return res.status(423).json({
          success: false,
          message:
            "Account temporarily locked due to multiple failed login attempts",
          lockedUntil: user.account_locked_until,
        });
      }

      // Check if account is active
      if (user.status !== "active") {
        return res.status(403).json({
          success: false,
          message: "Account is not active. Please contact support.",
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        // Increment failed attempts
        const failedAttempts = user.failed_login_attempts + 1;
        const lockAccount = failedAttempts >= 5;

        if (lockAccount) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
          await query(
            "UPDATE users SET failed_login_attempts = ?, account_locked_until = ? WHERE id = ?",
            [failedAttempts, lockUntil, user.id],
          );

          return res.status(423).json({
            success: false,
            message: "Account locked due to multiple failed login attempts",
            lockedUntil: lockUntil,
          });
        }

        await query("UPDATE users SET failed_login_attempts = ? WHERE id = ?", [
          failedAttempts,
          user.id,
        ]);

        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
          attemptsRemaining: 5 - failedAttempts,
        });
      }

      // Reset failed attempts and update last login
      await query(
        "UPDATE users SET failed_login_attempts = 0, account_locked_until = NULL, last_login = NOW(), last_ip = ? WHERE id = ?",
        [req.ip, user.id],
      );

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user.id);

      // Get user credits info
      const credits = await query(
        "SELECT daily_limit, cards_generated_today, last_reset_date, total_cards_generated, batch_processing_enabled, custom_cards_enabled, api_access_enabled FROM user_credits WHERE user_id = ?",
        [user.id],
      );

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            plan: user.plan,
            role: user.role || "user",
          },
          credits: credits[0] || null,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed. Please try again.",
      });
    }
  },
];

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    const users = await query(
      "SELECT id, name, email, plan, role, plan_status, status, created_at, last_login FROM users WHERE id = ?",
      [req.userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get credits info
    const credits = await query(
      `SELECT
        daily_limit,
        cards_generated_today,
        last_reset_date,
        total_cards_generated,
        batch_processing_enabled,
        custom_cards_enabled,
        api_access_enabled
      FROM user_credits
      WHERE user_id = ?`,
      [req.userId],
    );

    res.json({
      success: true,
      data: {
        user: users[0],
        credits: credits[0] || null,
        features: {
          batchProcessing: credits[0]?.batch_processing_enabled || false,
          customCards: credits[0]?.custom_cards_enabled || false,
          apiAccess: credits[0]?.api_access_enabled || false,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/**
 * Logout (invalidate refresh token)
 */
const logout = async (req, res) => {
  try {
    // In future, invalidate refresh token from database
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
};
