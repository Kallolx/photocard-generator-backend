const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post("/register", authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", authController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", authenticate, authController.getProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", authenticate, authController.logout);

/**
 * @route   GET /api/auth/ai-check
 * @desc    Verify token and return AI access status (used by Next.js AI routes)
 * @access  Private
 */
router.get("/ai-check", authenticate, async (req, res) => {
  try {
    const { query } = require("../config/database");
    const rows = await query(
      "SELECT COALESCE(ai_enabled, 1) AS ai_enabled FROM user_credits WHERE user_id = ?",
      [req.userId],
    );
    const ai_enabled = rows.length === 0 || rows[0].ai_enabled === 1;
    res.json({ success: true, userId: req.userId, ai_enabled });
  } catch (error) {
    console.error("AI check error:", error);
    res.status(500).json({ success: false, message: "AI check failed" });
  }
});

/**
 * @route   POST /api/auth/ai-track
 * @desc    Increment AI usage counters for a user (internal, server-to-server)
 * @access  Internal (no external auth — rely on server-only call from Next.js)
 */
router.post("/ai-track", async (req, res) => {
  try {
    // Only allow calls from the same server (localhost / trusted origin)
    const origin = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "";
    const isLocal =
      origin === "::1" ||
      origin === "127.0.0.1" ||
      origin === "::ffff:127.0.0.1" ||
      origin === "" || // server-side fetch within same process
      String(origin).startsWith("::ffff:"); // internal Docker / Node

    if (!isLocal && process.env.NODE_ENV === "production") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { query } = require("../config/database");
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    // Reset daily counter if last reset was not today
    await query(
      `UPDATE user_credits
       SET
         ai_requests_today = CASE
           WHEN ai_requests_last_reset < CURDATE() OR ai_requests_last_reset IS NULL THEN 1
           ELSE ai_requests_today + 1
         END,
         ai_requests_last_reset = CURDATE(),
         ai_requests_total = ai_requests_total + 1
       WHERE user_id = ?`,
      [userId],
    );

    res.json({ success: true });
  } catch (error) {
    console.error("AI track error:", error);
    res.status(500).json({ success: false, message: "Tracking failed" });
  }
});

module.exports = router;
