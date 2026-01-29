/**
 * Add usage monitoring to api_keys
 */

const up = async (connection) => {
  // Add daily_usage and last_reset_date columns
  await connection.query(`
    ALTER TABLE api_keys 
    ADD COLUMN daily_usage INT DEFAULT 0,
    ADD COLUMN last_reset_date DATE DEFAULT NULL
  `);
};

const down = async (connection) => {
  await connection.query(`
    ALTER TABLE api_keys 
    DROP COLUMN daily_usage,
    DROP COLUMN last_reset_date
  `);
};

module.exports = { up, down };
