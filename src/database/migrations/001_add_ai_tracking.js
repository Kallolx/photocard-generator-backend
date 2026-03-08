/**
 * Migration: Add AI usage tracking & control to user_credits
 */
const migration = {
  name: "001_add_ai_tracking",

  up: async (connection) => {
    // Add AI tracking columns to user_credits
    await connection.query(`
      ALTER TABLE user_credits
        ADD COLUMN IF NOT EXISTS ai_enabled TINYINT(1) NOT NULL DEFAULT 1
          COMMENT '1 = AI allowed, 0 = admin has blocked AI for this user',
        ADD COLUMN IF NOT EXISTS ai_requests_today INT NOT NULL DEFAULT 0
          COMMENT 'AI requests made today',
        ADD COLUMN IF NOT EXISTS ai_requests_total INT NOT NULL DEFAULT 0
          COMMENT 'All-time AI requests',
        ADD COLUMN IF NOT EXISTS ai_requests_last_reset DATE DEFAULT NULL
          COMMENT 'Date when ai_requests_today was last reset'
    `);

    console.log("  ✓ Added ai_enabled, ai_requests_today, ai_requests_total, ai_requests_last_reset to user_credits");
  },

  down: async (connection) => {
    await connection.query(`
      ALTER TABLE user_credits
        DROP COLUMN IF EXISTS ai_enabled,
        DROP COLUMN IF EXISTS ai_requests_today,
        DROP COLUMN IF EXISTS ai_requests_total,
        DROP COLUMN IF EXISTS ai_requests_last_reset
    `);
  },
};

module.exports = migration;
