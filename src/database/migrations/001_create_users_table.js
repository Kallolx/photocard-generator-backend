/**
 * Migration: Create Users Table
 * This table stores all user information including authentication and subscription details
 */

const up = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      
      -- Subscription Plan
      plan ENUM('Free', 'Basic', 'Premium') DEFAULT 'Free',
      plan_status ENUM('active', 'inactive', 'canceled', 'expired') DEFAULT 'active',
      
      -- Subscription Details
      subscription_id VARCHAR(255) NULL COMMENT 'Stripe subscription ID',
      subscription_start_date DATETIME NULL,
      subscription_end_date DATETIME NULL,
      next_billing_date DATETIME NULL,
      
      -- Account Status
      status ENUM('active', 'inactive', 'suspended', 'deleted') DEFAULT 'active',
      email_verified BOOLEAN DEFAULT FALSE,
      email_verification_token VARCHAR(255) NULL,
      
      -- Password Reset
      password_reset_token VARCHAR(255) NULL,
      password_reset_expires DATETIME NULL,
      
      -- Security
      failed_login_attempts INT DEFAULT 0,
      account_locked_until DATETIME NULL,
      last_login DATETIME NULL,
      last_ip VARCHAR(45) NULL,
      
      -- Timestamps
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at DATETIME NULL,
      
      INDEX idx_email (email),
      INDEX idx_plan (plan),
      INDEX idx_status (status),
      INDEX idx_subscription_id (subscription_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  
  await connection.query(sql);
  console.log('✓ Migration: users table created');
};

const down = async (connection) => {
  await connection.query('DROP TABLE IF EXISTS users');
  console.log('✓ Rollback: users table dropped');
};

module.exports = { up, down };
