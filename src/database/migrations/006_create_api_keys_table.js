/**
 * Create api_keys table
 */

const up = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS api_keys (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      api_key VARCHAR(255) NOT NULL UNIQUE,
      status ENUM('active', 'revoked') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  await connection.query(sql);

  // Add index for faster lookups
  await connection.query("CREATE INDEX idx_api_key ON api_keys(api_key);");
};

const down = async (connection) => {
  await connection.query("DROP TABLE IF EXISTS api_keys");
};

module.exports = { up, down };
