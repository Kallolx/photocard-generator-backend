/**
 * Migration: Create Refresh Tokens Table
 * This table stores refresh tokens for JWT authentication
 */

const up = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token VARCHAR(500) NOT NULL,
      expires_at DATETIME NOT NULL,
      
      -- Device/Session Info
      ip_address VARCHAR(45) NULL,
      user_agent TEXT NULL,
      
      -- Status
      is_revoked BOOLEAN DEFAULT FALSE,
      revoked_at DATETIME NULL,
      
      -- Timestamps
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_token (token(255)),
      INDEX idx_user_id (user_id),
      INDEX idx_expires (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  
  await connection.query(sql);
  console.log('✓ Migration: refresh_tokens table created');
};

const down = async (connection) => {
  await connection.query('DROP TABLE IF EXISTS refresh_tokens');
  console.log('✓ Rollback: refresh_tokens table dropped');
};

module.exports = { up, down };
