/**
 * Migration: Add Role to Users Table
 * Adds role field to differentiate between regular users and admins
 */

const up = async (connection) => {
  // Add role column
  const addRoleColumn = `
    ALTER TABLE users 
    ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password;
  `;
  
  await connection.query(addRoleColumn);
  console.log('✓ Migration: role column added to users table');
  
  // Create a default admin user if not exists
  const bcrypt = require('bcryptjs');
  const defaultPassword = await bcrypt.hash('Admin@123', 10);
  
  const insertAdmin = `
    INSERT INTO users (name, email, password, role, plan, status) 
    VALUES ('Admin User', 'admin@photocard.com', ?, 'admin', 'Premium', 'active')
    ON DUPLICATE KEY UPDATE role = 'admin', plan = 'Premium';
  `;
  
  await connection.query(insertAdmin, [defaultPassword]);
  console.log('✓ Default admin user created/updated (email: admin@photocard.com, password: Admin@123)');
};

const down = async (connection) => {
  await connection.query('ALTER TABLE users DROP COLUMN role');
  console.log('✓ Rollback: role column dropped from users table');
};

module.exports = { up, down };
