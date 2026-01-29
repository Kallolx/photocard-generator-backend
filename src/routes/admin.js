const express = require("express");
const router = express.Router();
const { query, transaction } = require("../config/database");
const { authenticate } = require("../middleware/auth");

/**
 * Middleware to check if user is admin
 */
const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;

    const users = await query("SELECT role FROM users WHERE id = ?", [userId]);

    if (users.length === 0 || users[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({
      success: false,
      message: "Authorization error",
    });
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination
 * @access  Private (Admin only)
 */
router.get("/users", authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      plan = "all",
      status = "all",
    } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    // Search filter
    if (search) {
      whereConditions.push("(users.name LIKE ? OR users.email LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Plan filter
    if (plan !== "all") {
      whereConditions.push("users.plan = ?");
      queryParams.push(plan);
    }

    // Status filter
    if (status !== "all") {
      whereConditions.push("users.status = ?");
      queryParams.push(status);
    }

    const whereClause =
      whereConditions.length > 0
        ? "WHERE " + whereConditions.join(" AND ")
        : "";

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const [{ total }] = await query(countQuery, queryParams);

    // Get users with their credits
    // Get users with their credits and API key status
    const usersQuery = `
      SELECT 
        users.id,
        users.name,
        users.email,
        users.plan,
        users.status,
        users.role,
        users.created_at,
        users.last_login,
        uc.daily_limit,
        uc.cards_generated_today,
        uc.total_cards_generated,
        ak.api_key as active_api_key_check,
        ak.status as api_key_status
      FROM users
      LEFT JOIN user_credits uc ON users.id = uc.user_id
      LEFT JOIN api_keys ak ON users.id = ak.user_id AND ak.status = 'active'
      ${whereClause}
      ORDER BY users.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const users = await query(usersQuery, [
      ...queryParams,
      parseInt(limit),
      offset,
    ]);

    // Shape the data
    const shapedUsers = users.map((user) => ({
      ...user,
      has_api_key: !!user.active_api_key_check,
    }));

    res.json({
      success: true,
      data: {
        users: shapedUsers,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get single user details
 * @access  Private (Admin only)
 */
router.get("/users/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    const users = await query(
      `SELECT 
        users.*,
        uc.daily_limit,
        uc.cards_generated_today,
        uc.last_reset_date,
        uc.total_cards_generated,
        uc.batch_processing_enabled,
        uc.custom_cards_enabled,
        uc.api_access_enabled,
        ak.api_key,
        ak.status as api_key_status,
        ak.created_at as api_key_created_at,
        ak.daily_usage as api_usage_today
      FROM users
      LEFT JOIN user_credits uc ON users.id = uc.user_id
      LEFT JOIN api_keys ak ON users.id = ak.user_id AND ak.status = 'active'
      WHERE users.id = ?`,
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's recent card generations
    const recentCards = await query(
      `SELECT * FROM card_generations 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [userId],
    );

    res.json({
      success: true,
      data: {
        user: users[0],
        recentCards,
      },
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
});

/**
 * @route   PUT /api/admin/users/:id/plan
 * @desc    Update user plan
 * @access  Private (Admin only)
 */
router.put("/users/:id/plan", authenticate, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { plan } = req.body;

    if (!["Free", "Basic", "Premium"].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan",
      });
    }

    await transaction(async (connection) => {
      // Update user plan
      await connection.execute("UPDATE users SET plan = ? WHERE id = ?", [
        plan,
        userId,
      ]);

      // Update credits based on plan
      const planLimits = {
        Free: { limit: 5, batch: false, custom: false, api: false },
        Basic: {
          limit: parseInt(process.env.BASIC_PLAN_LIMIT) || 30,
          batch: false,
          custom: true,
          api: false,
        },
        Premium: { limit: -1, batch: true, custom: true, api: true },
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

    res.json({
      success: true,
      message: "User plan updated successfully",
    });
  } catch (error) {
    console.error("Update user plan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user plan",
    });
  }
});

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Update user status
 * @access  Private (Admin only)
 */
router.put(
  "/users/:id/status",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const userId = req.params.id;
      const { status } = req.body;

      if (!["active", "inactive", "suspended", "deleted"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      await query("UPDATE users SET status = ? WHERE id = ?", [status, userId]);

      res.json({
        success: true,
        message: "User status updated successfully",
      });
    } catch (error) {
      console.error("Update user status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update user status",
      });
    }
  },
);

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin only)
 */
router.get("/stats", authenticate, requireAdmin, async (req, res) => {
  try {
    // Total users
    const [{ totalUsers }] = await query(
      "SELECT COUNT(*) as totalUsers FROM users",
    );

    // Users by plan
    const planStats = await query(
      `SELECT plan, COUNT(*) as count FROM users GROUP BY plan`,
    );

    // Total cards generated
    const [{ totalCards }] = await query(
      "SELECT SUM(total_cards_generated) as totalCards FROM user_credits",
    );

    res.json({
      success: true,
      data: {
        totalUsers,
        planStats: planStats.reduce((acc, { plan, count }) => {
          acc[plan.toLowerCase()] = count;
          return acc;
        }, {}),
        totalCards: totalCards || 0,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
});

/**
 * @route   GET /api/admin/notifications
 * @desc    Get recent notifications
 * @access  Private (Admin only)
 */
router.get("/notifications", authenticate, requireAdmin, async (req, res) => {
  try {
    const notifications = await query(
      "SELECT * FROM admin_notifications ORDER BY created_at DESC LIMIT 50",
    );

    // Count unread
    const [{ unreadCount }] = await query(
      "SELECT COUNT(*) as unreadCount FROM admin_notifications WHERE is_read = FALSE",
    );

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
});

/**
 * @route   PUT /api/admin/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private (Admin only)
 */
router.put(
  "/notifications/:id/read",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      await query(
        "UPDATE admin_notifications SET is_read = TRUE WHERE id = ?",
        [id],
      );
      res.json({ success: true, message: "Marked as read" });
    } catch (error) {
      console.error("Mark read error:", error);
      res.status(500).json({ success: false, message: "Failed to update" });
    }
  },
);

/**
 * @route   PUT /api/admin/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private (Admin only)
 */
router.put(
  "/notifications/read-all",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      await query("UPDATE admin_notifications SET is_read = TRUE");
      res.json({ success: true, message: "All marked as read" });
    } catch (error) {
      console.error("Mark all read error:", error);
      res.status(500).json({ success: false, message: "Failed to update" });
    }
  },
);

module.exports = router;
