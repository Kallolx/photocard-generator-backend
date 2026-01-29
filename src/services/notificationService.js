const { query } = require("../config/database");

/**
 * Create a new admin notification
 * @param {string} type - 'signup', 'security', 'system', 'payment'
 * @param {string} title - Short title
 * @param {string} message - Detailed message
 */
const createNotification = async (type, title, message) => {
  try {
    const sql =
      "INSERT INTO admin_notifications (type, title, message) VALUES (?, ?, ?)";
    await query(sql, [type, title, message]);
    console.log(`[Notification] Created: ${title}`);
  } catch (error) {
    console.error("Failed to create notification:", error);
    // Silent fail to not disrupt main flow
  }
};

module.exports = { createNotification };
