/**
 * Migration: Create User Credits Table
 * This table tracks card generation credits and limits for each user
 */

const up = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS user_credits (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      
      -- Daily Credits
      daily_limit INT NOT NULL DEFAULT 5 COMMENT 'Cards allowed per day based on plan',
      cards_generated_today INT DEFAULT 0 COMMENT 'Cards generated in current 24h period',
      last_reset_date DATE NOT NULL COMMENT 'Last time daily counter was reset',
      
      -- Lifetime Stats
      total_cards_generated INT DEFAULT 0 COMMENT 'Total cards generated all time',
      
      -- Feature Access (based on plan)
      batch_processing_enabled BOOLEAN DEFAULT FALSE,
      custom_cards_enabled BOOLEAN DEFAULT FALSE,
      api_access_enabled BOOLEAN DEFAULT FALSE,
      
      -- Timestamps
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user (user_id),
      INDEX idx_last_reset (last_reset_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  
  await connection.query(sql);
  console.log('✓ Migration: user_credits table created');
};

const down = async (connection) => {
  await connection.query('DROP TABLE IF EXISTS user_credits');
  console.log('✓ Rollback: user_credits table dropped');
};

module.exports = { up, down };
