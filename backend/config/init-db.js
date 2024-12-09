import pool from './database.js';

async function initializeDatabase() {
  try {
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create boards table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS boards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create columns table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS columns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        board_id INT NOT NULL,
        position INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (board_id) REFERENCES boards(id)
      )
    `);

    // Create tasks table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        column_id INT NOT NULL,
        position INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (column_id) REFERENCES columns(id)
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run the initialization
initializeDatabase();

export default initializeDatabase; 