const express = require("express");
const router = express.Router();
const { query, transaction } = require("../config/database");
const { authenticate } = require("../middleware/auth");

/**
 * @route   POST /api/user/upgrade-plan
 * @desc    Upgrade user's plan (demo version - no payment)
 * @access  Private
 */
router.post("/upgrade-plan", authenticate, async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.userId;

    // Validate plan
    if (!["Basic", "Premium"].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan. Must be Basic or Premium.",
      });
    }

    // Update user plan and credits in transaction
    await transaction(async (connection) => {
      // Update user's plan
      await connection.execute(
        "UPDATE users SET plan = ?, plan_status = ?, subscription_start_date = NOW() WHERE id = ?",
        [plan, "active", userId],
      );

      // Update user credits based on new plan
      const planLimits = {
        Free: { limit: 5, batch: false, custom: false, api: false },
        Basic: {
          limit: parseInt(process.env.BASIC_PLAN_LIMIT) || 30,
          batch: false,
          custom: true,
          api: false,
        }, // Batch is Premium only
        Premium: { limit: -1, batch: true, custom: true, api: true }, // -1 = unlimited
      };

      const limits = planLimits[plan];

      await connection.execute(
        `UPDATE user_credits SET 
          daily_limit = ?,
          batch_processing_enabled = ?,
          custom_cards_enabled = ?,
          api_access_enabled = ?
        WHERE user_id = ?`,
        [limits.limit, limits.batch, limits.custom, limits.api, userId],
      );
    });

    // Get updated user data
    const users = await query(
      "SELECT id, name, email, plan, plan_status FROM users WHERE id = ?",
      [userId],
    );

    const credits = await query(
      `SELECT daily_limit, cards_generated_today, batch_processing_enabled, 
              custom_cards_enabled, api_access_enabled 
       FROM user_credits WHERE user_id = ?`,
      [userId],
    );

    res.json({
      success: true,
      message: `Successfully upgraded to ${plan} plan`,
      data: {
        user: users[0],
        credits: credits[0],
        features: {
          batchProcessing: credits[0].batch_processing_enabled,
          customCards: credits[0].custom_cards_enabled,
          apiAccess: credits[0].api_access_enabled,
        },
      },
    });
  } catch (error) {
    console.error("Upgrade plan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upgrade plan",
    });
  }
});

/**
 * @route   GET /api/user/credits
 * @desc    Get user's current credit status
 * @access  Private
 */
router.get("/credits", authenticate, async (req, res) => {
  try {
    const credits = await query(
      `SELECT daily_limit, cards_generated_today, last_reset_date, 
              total_cards_generated, batch_processing_enabled, 
              custom_cards_enabled, api_access_enabled 
       FROM user_credits WHERE user_id = ?`,
      [req.userId],
    );

    if (credits.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Credits not found",
      });
    }

    res.json({
      success: true,
      data: credits[0],
    });
  } catch (error) {
    console.error("Get credits error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch credits",
    });
  }
});

/**
 * @route   GET /api/user/features/:feature
 * @desc    Check if user has access to a specific feature
 * @access  Private
 */
router.get("/features/:feature", authenticate, async (req, res) => {
  try {
    const { feature } = req.params;

    const credits = await query(
      `SELECT batch_processing_enabled, custom_cards_enabled, api_access_enabled 
       FROM user_credits WHERE user_id = ?`,
      [req.userId],
    );

    if (credits.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const featureMap = {
      batch: credits[0].batch_processing_enabled,
      custom: credits[0].custom_cards_enabled,
      api: credits[0].api_access_enabled,
    };

    const hasAccess = featureMap[feature] || false;

    res.json({
      success: true,
      data: {
        feature,
        hasAccess,
        currentPlan: req.user.plan,
      },
    });
  } catch (error) {
    console.error("Check feature error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check feature access",
    });
  }
});

const userController = require("../controllers/userController");

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put("/profile", authenticate, userController.updateProfile);

/**
 * @route   PUT /api/user/password
 * @desc    Change user password
 * @access  Private
 */
router.put("/password", authenticate, userController.changePassword);

module.exports = router;
