import createTables from './schema.js';
import pool from './config.js';

const setup = async () => {
  try {
    console.log('🔧 Setting up database...');
    
    // Create tables
    await createTables();
    
    // Create default admin user (optional)
    const bcrypt = await import('bcrypt');
    const password_hash = await bcrypt.hash('changeme123', 10);
    
    try {
      await pool.query(
        `INSERT INTO users (email, password_hash, name, role) 
         VALUES ($1, $2, $3, $4)`,
        ['admin@parallax.local', password_hash, 'Admin', 'admin']
      );
      console.log('✅ Default admin user created (email: admin@parallax.local, password: changeme123)');
    } catch (error) {
      if (error.code === '23505') {
        console.log('ℹ️  Admin user already exists');
      }
    }
    
    console.log('✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

setup();
