-- ===============================================
-- Face2Finance MongoDB Collections Schema
-- Financial Literacy Education Platform
-- Generated: July 18, 2025
-- ===============================================
-- Note: This is a representation of MongoDB collections in SQL-like format for documentation purposes.
-- The actual database uses MongoDB with Mongoose ODM.

-- ===============================================
-- USERS COLLECTION
-- ===============================================
-- Collection: users
-- Purpose: Store user account information and preferences
CREATE TABLE IF NOT EXISTS users (
    _id VARCHAR(24) PRIMARY KEY,                    -- MongoDB ObjectId
    email VARCHAR(255) UNIQUE NOT NULL,             -- User email (unique identifier)
    username VARCHAR(100) UNIQUE NOT NULL,          -- User display name (unique)
    firstName VARCHAR(100) NOT NULL,                -- User's first name
    lastName VARCHAR(100) NOT NULL,                 -- User's last name
    phone VARCHAR(20),                              -- Optional phone number
    passwordHash VARCHAR(255) NOT NULL,             -- Bcrypt hashed password
    language ENUM('en', 'hi', 'pa') DEFAULT 'en',   -- User's preferred language
    onboardingCompleted BOOLEAN DEFAULT FALSE,      -- Has user completed onboarding flow
    knowledgeLevel ENUM('beginner', 'intermediate', 'advanced'), -- User's financial knowledge level
    dailyGoal INT CHECK (dailyGoal >= 5 AND dailyGoal <= 120),   -- Daily learning goal in minutes
    ageGroup ENUM('18-25', '26-35', '36-45', '46-55', '55+'),    -- User's age group for targeted content
    totalPoints INT DEFAULT 0,                      -- Gamification points earned
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Account creation date
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===============================================
-- LEARNING MODULES COLLECTION
-- ===============================================
-- Collection: learningmodules
-- Purpose: Store educational content modules
CREATE TABLE IF NOT EXISTS learningmodules (
    _id VARCHAR(24) PRIMARY KEY,                    -- MongoDB ObjectId
    title VARCHAR(255) NOT NULL,                    -- Module title
    description TEXT,                               -- Module description
    category ENUM('budgeting', 'savings', 'investing', 'fraud', 'privacy', 'taxes') NOT NULL, -- Content category
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL, -- Difficulty level
    duration INT NOT NULL CHECK (duration >= 1 AND duration <= 180), -- Estimated completion time in minutes
    points INT DEFAULT 0,                           -- Points awarded for completion
    content JSON,                                   -- Module content (sections, videos, etc.)
    isActive BOOLEAN DEFAULT TRUE,                  -- Is module currently available
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===============================================
-- QUIZZES COLLECTION
-- ===============================================
-- Collection: quizzes
-- Purpose: Store quiz questions and metadata
CREATE TABLE IF NOT EXISTS quizzes (
    _id VARCHAR(24) PRIMARY KEY,                    -- MongoDB ObjectId
    title VARCHAR(255) NOT NULL,                    -- Quiz title
    description TEXT,                               -- Quiz description
    category ENUM('budgeting', 'savings', 'investing', 'fraud', 'privacy', 'taxes') NOT NULL, -- Quiz category
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL, -- Difficulty level
    duration INT NOT NULL CHECK (duration >= 1 AND duration <= 60), -- Time limit in minutes
    points INT DEFAULT 0,                           -- Points awarded for completion
    questions JSON NOT NULL,                        -- Array of question objects with options, correct answer, explanation
    isActive BOOLEAN DEFAULT TRUE,                  -- Is quiz currently available
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===============================================
-- USER PROGRESS COLLECTION
-- ===============================================
-- Collection: userprogresses
-- Purpose: Track user progress through learning modules
CREATE TABLE IF NOT EXISTS userprogresses (
    _id VARCHAR(24) PRIMARY KEY,                    -- MongoDB ObjectId
    userId VARCHAR(24) NOT NULL,                    -- Reference to users._id
    moduleId VARCHAR(24) NOT NULL,                  -- Reference to learningmodules._id
    completed BOOLEAN DEFAULT FALSE,                -- Has user completed this module
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100), -- Completion percentage
    completedAt TIMESTAMP NULL,                     -- When module was completed
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(userId, moduleId)                        -- One progress record per user per module
);

-- ===============================================
-- QUIZ ATTEMPTS COLLECTION
-- ===============================================
-- Collection: quizattempts
-- Purpose: Store user quiz attempt results
CREATE TABLE IF NOT EXISTS quizattempts (
    _id VARCHAR(24) PRIMARY KEY,                    -- MongoDB ObjectId
    userId VARCHAR(24) NOT NULL,                    -- Reference to users._id
    quizId VARCHAR(24) NOT NULL,                    -- Reference to quizzes._id
    score INT DEFAULT 0,                            -- Score achieved
    totalQuestions INT DEFAULT 0,                   -- Total questions in quiz
    answers JSON NOT NULL,                          -- Array of user answers with correctness
    completedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When quiz was completed
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- TASKS COLLECTION
-- ===============================================
-- Collection: tasks
-- Purpose: Store user personal financial tasks and goals
CREATE TABLE IF NOT EXISTS tasks (
    _id VARCHAR(24) PRIMARY KEY,                    -- MongoDB ObjectId
    userId VARCHAR(24) NOT NULL,                    -- Reference to users._id
    title VARCHAR(255) NOT NULL,                    -- Task title
    description TEXT,                               -- Task description
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium', -- Task priority
    dueDate TIMESTAMP NULL,                         -- Optional due date
    completed BOOLEAN DEFAULT FALSE,                -- Is task completed
    completedAt TIMESTAMP NULL,                     -- When task was completed
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===============================================
-- TRANSACTIONS COLLECTION
-- ===============================================
-- Collection: transactions
-- Purpose: Store user financial transactions for tracking and budgeting
CREATE TABLE IF NOT EXISTS transactions (
    _id VARCHAR(24) PRIMARY KEY,                    -- MongoDB ObjectId
    userId VARCHAR(24) NOT NULL,                    -- Reference to users._id
    name VARCHAR(255) NOT NULL,                     -- Transaction description
    amount DECIMAL(10,2) NOT NULL,                  -- Transaction amount
    type ENUM('income', 'expense') NOT NULL,        -- Transaction type
    category VARCHAR(100) NOT NULL,                 -- Transaction category
    description TEXT,                               -- Additional details
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- Transaction date
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===============================================
-- FINANCIAL GOALS COLLECTION
-- ===============================================
-- Collection: financialgoals
-- Purpose: Store user financial goals and savings targets
CREATE TABLE IF NOT EXISTS financialgoals (
    _id VARCHAR(24) PRIMARY KEY,                    -- MongoDB ObjectId
    userId VARCHAR(24) NOT NULL,                    -- Reference to users._id
    title VARCHAR(255) NOT NULL,                    -- Goal title
    description TEXT,                               -- Goal description
    targetAmount DECIMAL(10,2) NOT NULL CHECK (targetAmount >= 0), -- Target amount to save
    currentAmount DECIMAL(10,2) DEFAULT 0,          -- Current saved amount
    targetDate TIMESTAMP NOT NULL,                  -- Target completion date
    category VARCHAR(100) NOT NULL,                 -- Goal category (emergency, vacation, etc.)
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium', -- Goal priority
    completed BOOLEAN DEFAULT FALSE,                -- Is goal achieved
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===============================================
-- CALCULATOR HISTORY COLLECTION
-- ===============================================
-- Collection: calculatorhistories
-- Purpose: Store user calculator usage history for reference
CREATE TABLE IF NOT EXISTS calculatorhistories (
    _id VARCHAR(24) PRIMARY KEY,                    -- MongoDB ObjectId
    userId VARCHAR(24) NOT NULL,                    -- Reference to users._id
    calculatorType ENUM('budget', 'tax', 'emi', 'investment') NOT NULL, -- Type of calculator used
    inputs JSON NOT NULL,                           -- Calculator input parameters
    results JSON NOT NULL,                          -- Calculator output results
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- When calculation was performed
);

-- ===============================================
-- NOTIFICATIONS COLLECTION
-- ===============================================
-- Collection: notifications
-- Purpose: Store user notifications and alerts
CREATE TABLE IF NOT EXISTS notifications (
    _id VARCHAR(24) PRIMARY KEY,                    -- MongoDB ObjectId
    userId VARCHAR(24) NOT NULL,                    -- Reference to users._id
    title VARCHAR(255) NOT NULL,                    -- Notification title
    message TEXT NOT NULL,                          -- Notification content
    type ENUM('info', 'warning', 'success', 'error') DEFAULT 'info', -- Notification type
    read BOOLEAN DEFAULT FALSE,                     -- Has user read the notification
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- When notification was created
);

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================
-- MongoDB indexes (represented as SQL for documentation)

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Learning module indexes
CREATE INDEX idx_modules_category ON learningmodules(category);
CREATE INDEX idx_modules_difficulty ON learningmodules(difficulty);
CREATE INDEX idx_modules_active ON learningmodules(isActive);

-- Quiz indexes
CREATE INDEX idx_quizzes_category ON quizzes(category);
CREATE INDEX idx_quizzes_difficulty ON quizzes(difficulty);
CREATE INDEX idx_quizzes_active ON quizzes(isActive);

-- User progress indexes
CREATE INDEX idx_progress_user ON userprogresses(userId);
CREATE INDEX idx_progress_module ON userprogresses(moduleId);
CREATE INDEX idx_progress_completed ON userprogresses(completed);

-- Quiz attempt indexes
CREATE INDEX idx_attempts_user ON quizattempts(userId);
CREATE INDEX idx_attempts_quiz ON quizattempts(quizId);
CREATE INDEX idx_attempts_date ON quizattempts(completedAt);

-- Task indexes
CREATE INDEX idx_tasks_user ON tasks(userId);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_due ON tasks(dueDate);

-- Transaction indexes
CREATE INDEX idx_transactions_user ON transactions(userId);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_date ON transactions(date);

-- Financial goal indexes
CREATE INDEX idx_goals_user ON financialgoals(userId);
CREATE INDEX idx_goals_completed ON financialgoals(completed);
CREATE INDEX idx_goals_target_date ON financialgoals(targetDate);

-- Calculator history indexes
CREATE INDEX idx_calc_history_user ON calculatorhistories(userId);
CREATE INDEX idx_calc_history_type ON calculatorhistories(calculatorType);
CREATE INDEX idx_calc_history_date ON calculatorhistories(createdAt);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications(userId);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ===============================================
-- SAMPLE DATA CONSTRAINTS
-- ===============================================

-- User constraints
-- - Email must be valid format
-- - Password must be at least 6 characters (handled in application)
-- - Daily goal between 5-120 minutes
-- - Total points cannot be negative

-- Learning module constraints
-- - Duration between 1-180 minutes
-- - Content must be valid JSON structure

-- Quiz constraints
-- - Duration between 1-60 minutes
-- - Questions must be valid JSON array
-- - Each question must have: question, options, correct, explanation

-- User progress constraints
-- - Progress percentage between 0-100
-- - Cannot have duplicate progress records for same user/module

-- Quiz attempt constraints
-- - Score cannot be negative
-- - Total questions must match actual quiz

-- Transaction constraints
-- - Amount must be numeric
-- - Type must be income or expense

-- Financial goal constraints
-- - Target amount must be positive
-- - Current amount cannot exceed target amount
-- - Target date must be in the future (handled in application)

-- ===============================================
-- NOTES
-- ===============================================
-- 1. This schema represents MongoDB collections as SQL tables for documentation
-- 2. Actual implementation uses MongoDB with Mongoose ODM
-- 3. JSON fields store complex objects (content, questions, inputs, results, answers)
-- 4. All _id fields are MongoDB ObjectIds (24-character hex strings)
-- 5. Timestamps are stored as MongoDB Date objects
-- 6. Foreign key relationships are maintained through application logic
-- 7. Data validation is enforced through Mongoose schemas and Zod validation
-- 8. The application supports multi-language content (English, Hindi, Punjabi)
-- 9. Gamification elements include points and progress tracking
-- 10. Financial calculations and educational content are the core features