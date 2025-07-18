import { Pool } from 'pg';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('PostgreSQL connected successfully at:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
    return false;
  }
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        profile_image_url TEXT,
        phone_number VARCHAR(20),
        language VARCHAR(50) DEFAULT 'english',
        knowledge_level VARCHAR(50),
        daily_goal INTEGER DEFAULT 15,
        age_group VARCHAR(50),
        onboarding_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create calculator_history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS calculator_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        calculator_type VARCHAR(50) CHECK (calculator_type IN ('budget', 'tax', 'emi', 'investment')) NOT NULL,
        inputs JSONB NOT NULL,
        results JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        priority VARCHAR(20) DEFAULT 'medium',
        due_date DATE,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create goals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        target_amount DECIMAL(12, 2),
        current_amount DECIMAL(12, 2) DEFAULT 0,
        target_date DATE,
        category VARCHAR(100),
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        read BOOLEAN DEFAULT FALSE,
        action_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create quiz_attempts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        quiz_id VARCHAR(50) NOT NULL,
        score INTEGER DEFAULT 0,
        total_questions INTEGER NOT NULL,
        correct_answers INTEGER DEFAULT 0,
        answers JSONB,
        time_spent INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    // Create AI chat sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_chat_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_id VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create AI chat messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_chat_messages (
        id SERIAL PRIMARY KEY,
        session_id INTEGER REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
        role VARCHAR(20) CHECK (role IN ('user', 'assistant')) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
    client.release();
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}