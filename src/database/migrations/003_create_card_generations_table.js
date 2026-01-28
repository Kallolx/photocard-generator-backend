/**
 * Migration: Create Card Generations Table
 * This table logs every card generation for tracking and security
 */

const up = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS card_generations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      
      -- Card Details
      card_type ENUM('url', 'custom') NOT NULL,
      source_url VARCHAR(1000) NULL COMMENT 'URL for URL-based cards',
      is_batch BOOLEAN DEFAULT FALSE,
      batch_count INT DEFAULT 1,
      
      -- Card Configuration
      theme VARCHAR(50) NULL,
      font VARCHAR(50) NULL,
      background_color VARCHAR(50) NULL,
      
      -- Security & Access Control
      download_allowed BOOLEAN DEFAULT TRUE COMMENT 'Can user download this card',
      download_count INT DEFAULT 0 COMMENT 'Times downloaded',
      access_token VARCHAR(64) NULL COMMENT 'Secure token for download access',
      access_expires_at DATETIME NULL COMMENT 'When download access expires',
      
      -- File Information
      file_path VARCHAR(500) NULL COMMENT 'Server path to generated card',
      file_size INT NULL COMMENT 'File size in bytes',
      
      -- IP & Security
      ip_address VARCHAR(45) NULL,
      user_agent TEXT NULL,
      
      -- Timestamps
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_date (user_id, created_at),
      INDEX idx_access_token (access_token),
      INDEX idx_card_type (card_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  
  await connection.query(sql);
  console.log('✓ Migration: card_generations table created');
};

const down = async (connection) => {
  await connection.query('DROP TABLE IF EXISTS card_generations');
  console.log('✓ Rollback: card_generations table dropped');
};

module.exports = { up, down };
