const up = async (connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS admin_notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const down = async (connection) => {
  await connection.query("DROP TABLE IF EXISTS admin_notifications");
};

module.exports = { up, down };
