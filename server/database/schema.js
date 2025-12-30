import pool from './config.js';

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Health - Body Metrics
    await client.query(`
      CREATE TABLE IF NOT EXISTS body_metrics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        weight DECIMAL(5,2),
        body_fat DECIMAL(5,2),
        muscle_mass DECIMAL(5,2),
        measurements JSONB,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Health - Workouts
    await client.query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        type VARCHAR(100),
        exercises JSONB,
        duration INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Health - Meals
    await client.query(`
      CREATE TABLE IF NOT EXISTS meals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        meal_type VARCHAR(50),
        foods JSONB,
        protein DECIMAL(6,2),
        carbs DECIMAL(6,2),
        fat DECIMAL(6,2),
        fiber DECIMAL(6,2),
        calories INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Health - Habits
    await client.query(`
      CREATE TABLE IF NOT EXISTS habits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        frequency VARCHAR(50),
        streak INTEGER DEFAULT 0,
        last_completed DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sports - Training Sessions
    await client.query(`
      CREATE TABLE IF NOT EXISTS training_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        sport VARCHAR(100),
        performance JSONB,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sports - Competitions
    await client.query(`
      CREATE TABLE IF NOT EXISTS competitions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        event VARCHAR(255),
        results JSONB,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sports - Recovery
    await client.query(`
      CREATE TABLE IF NOT EXISTS recovery_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        sleep_hours DECIMAL(4,2),
        sleep_quality INTEGER,
        soreness INTEGER,
        energy INTEGER,
        stress INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Budget - Transactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        subcategory VARCHAR(100),
        type VARCHAR(50),
        is_shared BOOLEAN DEFAULT false,
        notes TEXT,
        receipt_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Budget - Budgets
    await client.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100) NOT NULL,
        monthly_limit DECIMAL(10,2),
        rollover BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Budget - Savings Goals
    await client.query(`
      CREATE TABLE IF NOT EXISTS savings_goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        target_amount DECIMAL(10,2) NOT NULL,
        current_amount DECIMAL(10,2) DEFAULT 0,
        deadline DATE,
        priority INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Escape Plan - Countries
    await client.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        code VARCHAR(3) UNIQUE NOT NULL,
        region VARCHAR(100),
        cost_of_living_index DECIMAL(6,2),
        rent_index DECIMAL(6,2),
        groceries_index DECIMAL(6,2),
        avg_salary INTEGER,
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Escape Plan - Pet Requirements
    await client.query(`
      CREATE TABLE IF NOT EXISTS pet_requirements (
        id SERIAL PRIMARY KEY,
        country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
        pets_allowed BOOLEAN,
        quarantine_required BOOLEAN,
        quarantine_days INTEGER,
        requirements JSONB,
        estimated_cost DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Escape Plan - Saved Comparisons
    await client.query(`
      CREATE TABLE IF NOT EXISTS country_comparisons (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255),
        country_ids INTEGER[],
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Escape Plan - Relocation Plans
    await client.query(`
      CREATE TABLE IF NOT EXISTS relocation_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        target_country_id INTEGER REFERENCES countries(id),
        target_date DATE,
        savings_target DECIMAL(10,2),
        current_savings DECIMAL(10,2) DEFAULT 0,
        monthly_contribution DECIMAL(10,2),
        checklist JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Pets
    await client.query(`
      CREATE TABLE IF NOT EXISTS pets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        breed VARCHAR(100),
        age INTEGER,
        weight DECIMAL(5,2),
        medical_records JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query('COMMIT');
    console.log('✅ All tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default createTables;
