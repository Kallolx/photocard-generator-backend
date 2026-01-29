const bcrypt = require("bcryptjs");
const { query } = require("../config/database");
const { body, validationResult } = require("express-validator");

/**
 * Update user profile
 */
const updateProfile = [
  // Validation
  body("name")
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Name must be between 2-255 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),

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

      const { name, email } = req.body;
      const userId = req.userId;

      // Check if email is already taken by another user
      if (email) {
        const existingUsers = await query(
          "SELECT id FROM users WHERE email = ? AND id != ?",
          [email, userId],
        );

        if (existingUsers.length > 0) {
          return res.status(409).json({
            success: false,
            message: "Email already in use by another account",
          });
        }
      }

      // Update user
      await query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
        name,
        email,
        userId,
      ]);

      // Get updated user data
      const users = await query(
        "SELECT id, name, email, plan, role FROM users WHERE id = ?",
        [userId],
      );

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: users[0],
        },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  },
];

/**
 * Change user password
 */
const changePassword = [
  // Validation
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),

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

      const { currentPassword, newPassword } = req.body;
      const userId = req.userId;

      // Get user password hash
      const users = await query("SELECT password FROM users WHERE id = ?", [
        userId,
      ]);

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        users[0].password,
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Incorrect current password",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await query("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        userId,
      ]);

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to change password",
      });
    }
  },
];

module.exports = {
  updateProfile,
  changePassword,
};
