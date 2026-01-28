/**
 * Database Migration Runner
 * Runs all pending migrations in order
 */

const fs = require('fs');
const path = require('path');
const { getConnection } = require('../config/database');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// Create migrations tracking table
const createMigrationsTable = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      migration_name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  await connection.query(sql);
};

// Get executed migrations
const getExecutedMigrations = async (connection) => {
  const [rows] = await connection.query('SELECT migration_name FROM migrations ORDER BY id');
  return rows.map(row => row.migration_name);
};

// Record executed migration
const recordMigration = async (connection, migrationName) => {
  await connection.query('INSERT INTO migrations (migration_name) VALUES (?)', [migrationName]);
};

// Run migrations
const runMigrations = async () => {
  let connection;
  
  try {
    connection = await getConnection();
    console.log('\n🔄 Starting database migrations...\n');
    
    // Create migrations tracking table
    await createMigrationsTable(connection);
    
    // Get list of executed migrations
    const executedMigrations = await getExecutedMigrations(connection);
    
    // Get all migration files
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.js'))
      .sort();
    
    // Run pending migrations
    let executedCount = 0;
    
    for (const file of migrationFiles) {
      const migrationName = file.replace('.js', '');
      
      if (executedMigrations.includes(migrationName)) {
        console.log(`⊘ Skipping: ${migrationName} (already executed)`);
        continue;
      }
      
      console.log(`▶ Running: ${migrationName}`);
      
      const migration = require(path.join(MIGRATIONS_DIR, file));
      await migration.up(connection);
      await recordMigration(connection, migrationName);
      
      executedCount++;
    }
    
    console.log(`\n✓ Migrations completed! (${executedCount} executed)\n`);
    
  } catch (error) {
    console.error('\n✗ Migration failed:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
};

// Run if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
