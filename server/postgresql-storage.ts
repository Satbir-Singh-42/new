import { pool } from "./db";
import type { IUser, ITask, ITransaction, IFinancialGoal, INotification, ICalculatorHistory } from "@shared/schema";

export interface IPostgreSQLStorage {
  // User operations
  getUser(id: number): Promise<IUser | undefined>;
  getUserByEmail(email: string): Promise<IUser | undefined>;
  createUser(user: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser>;
  updateUser(id: number, updates: Partial<IUser>): Promise<IUser | undefined>;

  // Transaction operations
  getTransactions(userId: number): Promise<ITransaction[]>;
  createTransaction(transaction: Omit<ITransaction, '_id' | 'createdAt'>): Promise<ITransaction>;
  getTransactionsSummary(userId: number): Promise<any>;

  // Task operations
  getTasks(userId: number): Promise<ITask[]>;
  createTask(task: Omit<ITask, '_id' | 'createdAt' | 'updatedAt'>): Promise<ITask>;
  updateTask(id: number, updates: Partial<ITask>): Promise<ITask | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Goal operations
  getGoals(userId: number): Promise<IFinancialGoal[]>;
  createGoal(goal: Omit<IFinancialGoal, '_id' | 'createdAt' | 'updatedAt'>): Promise<IFinancialGoal>;
  updateGoal(id: number, updates: Partial<IFinancialGoal>): Promise<IFinancialGoal | undefined>;
  deleteGoal(id: number): Promise<boolean>;

  // Calculator history
  getCalculatorHistory(userId: number): Promise<ICalculatorHistory[]>;
  createCalculatorHistory(history: Omit<ICalculatorHistory, '_id' | 'createdAt'>): Promise<ICalculatorHistory>;

  // Notifications
  getNotifications(userId: number): Promise<INotification[]>;
  createNotification(notification: Omit<INotification, '_id' | 'createdAt'>): Promise<INotification>;
  markNotificationAsRead(id: number): Promise<boolean>;

  // Quiz attempts
  createQuizAttempt(attempt: any): Promise<any>;
  updateQuizAttempt(id: number, updates: any): Promise<any>;

  // AI Chat
  createChatSession(userId: number, title?: string): Promise<any>;
  getChatSessions(userId: number): Promise<any[]>;
  createChatMessage(sessionId: number, role: string, content: string): Promise<any>;
  getChatMessages(sessionId: number): Promise<any[]>;
}

export class PostgreSQLStorage implements IPostgreSQLStorage {
  async getUser(id: number): Promise<IUser | undefined> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] ? this.mapUserFromDB(result.rows[0]) : undefined;
    } finally {
      client.release();
    }
  }

  async getUserByEmail(email: string): Promise<IUser | undefined> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] ? this.mapUserFromDB(result.rows[0]) : undefined;
    } finally {
      client.release();
    }
  }

  async createUser(user: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO users (email, password, first_name, last_name, profile_image_url, phone_number, language, knowledge_level, daily_goal, age_group, onboarding_completed)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        user.email, user.password, user.firstName, user.lastName, user.profileImageUrl,
        user.phoneNumber, user.language, user.knowledgeLevel, user.dailyGoal, user.ageGroup, user.onboardingCompleted
      ]);
      return this.mapUserFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async updateUser(id: number, updates: Partial<IUser>): Promise<IUser | undefined> {
    const client = await pool.connect();
    try {
      const setClause = Object.keys(updates).map((key, index) => `${this.mapUserFieldToDB(key)} = $${index + 2}`).join(', ');
      const values = [id, ...Object.values(updates)];
      
      const result = await client.query(`
        UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, values);
      
      return result.rows[0] ? this.mapUserFromDB(result.rows[0]) : undefined;
    } finally {
      client.release();
    }
  }

  async getTransactions(userId: number): Promise<ITransaction[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
        [userId]
      );
      return result.rows.map(this.mapTransactionFromDB);
    } finally {
      client.release();
    }
  }

  async createTransaction(transaction: Omit<ITransaction, '_id' | 'createdAt'>): Promise<ITransaction> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO transactions (user_id, name, amount, type, category, description, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        transaction.userId, transaction.name, transaction.amount, transaction.type,
        transaction.category, transaction.description, transaction.date || new Date()
      ]);
      return this.mapTransactionFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getTransactionsSummary(userId: number): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          type,
          SUM(amount) as total,
          COUNT(*) as count
        FROM transactions 
        WHERE user_id = $1 
        GROUP BY type
      `, [userId]);
      
      const summary = { income: 0, expense: 0, balance: 0 };
      result.rows.forEach(row => {
        summary[row.type as keyof typeof summary] = parseFloat(row.total);
      });
      summary.balance = summary.income - summary.expense;
      
      return summary;
    } finally {
      client.release();
    }
  }

  async getTasks(userId: number): Promise<ITask[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows.map(this.mapTaskFromDB);
    } finally {
      client.release();
    }
  }

  async createTask(task: Omit<ITask, '_id' | 'createdAt' | 'updatedAt'>): Promise<ITask> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO tasks (user_id, title, description, category, priority, due_date, completed)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        task.userId, task.title, task.description, task.category, task.priority, task.dueDate, task.completed
      ]);
      return this.mapTaskFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async updateTask(id: number, updates: Partial<ITask>): Promise<ITask | undefined> {
    const client = await pool.connect();
    try {
      const setClause = Object.keys(updates).map((key, index) => `${this.mapTaskFieldToDB(key)} = $${index + 2}`).join(', ');
      const values = [id, ...Object.values(updates)];
      
      const result = await client.query(`
        UPDATE tasks SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, values);
      
      return result.rows[0] ? this.mapTaskFromDB(result.rows[0]) : undefined;
    } finally {
      client.release();
    }
  }

  async deleteTask(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM tasks WHERE id = $1', [id]);
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  async getGoals(userId: number): Promise<IFinancialGoal[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows.map(this.mapGoalFromDB);
    } finally {
      client.release();
    }
  }

  async createGoal(goal: Omit<IFinancialGoal, '_id' | 'createdAt' | 'updatedAt'>): Promise<IFinancialGoal> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO goals (user_id, title, description, target_amount, current_amount, target_date, category, completed)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        goal.userId, goal.title, goal.description, goal.targetAmount, goal.currentAmount, goal.targetDate, goal.category, false
      ]);
      return this.mapGoalFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async updateGoal(id: number, updates: Partial<IFinancialGoal>): Promise<IFinancialGoal | undefined> {
    const client = await pool.connect();
    try {
      const setClause = Object.keys(updates).map((key, index) => `${this.mapGoalFieldToDB(key)} = $${index + 2}`).join(', ');
      const values = [id, ...Object.values(updates)];
      
      const result = await client.query(`
        UPDATE goals SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, values);
      
      return result.rows[0] ? this.mapGoalFromDB(result.rows[0]) : undefined;
    } finally {
      client.release();
    }
  }

  async deleteGoal(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM goals WHERE id = $1', [id]);
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  async getCalculatorHistory(userId: number): Promise<ICalculatorHistory[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM calculator_history WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows.map(this.mapCalculatorHistoryFromDB);
    } finally {
      client.release();
    }
  }

  async createCalculatorHistory(history: Omit<ICalculatorHistory, '_id' | 'createdAt'>): Promise<ICalculatorHistory> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO calculator_history (user_id, calculator_type, inputs, results)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [history.userId, history.calculatorType, JSON.stringify(history.inputs), JSON.stringify(history.results)]);
      return this.mapCalculatorHistoryFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getNotifications(userId: number): Promise<INotification[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows.map(this.mapNotificationFromDB);
    } finally {
      client.release();
    }
  }

  async createNotification(notification: Omit<INotification, '_id' | 'createdAt'>): Promise<INotification> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [notification.userId, notification.title, notification.message, notification.type, notification.actionUrl]);
      return this.mapNotificationFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('UPDATE notifications SET read = true WHERE id = $1', [id]);
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  async createQuizAttempt(attempt: any): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct_answers, answers, time_spent, completed)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        attempt.userId, attempt.quizId, attempt.score, attempt.totalQuestions,
        attempt.correctAnswers, JSON.stringify(attempt.answers), attempt.timeSpent, attempt.completed
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateQuizAttempt(id: number, updates: any): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        UPDATE quiz_attempts 
        SET score = $2, correct_answers = $3, answers = $4, time_spent = $5, completed = $6, completed_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, [id, updates.score, updates.correctAnswers, JSON.stringify(updates.answers), updates.timeSpent, updates.completed]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async createChatSession(userId: number, title?: string): Promise<any> {
    const client = await pool.connect();
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const result = await client.query(`
        INSERT INTO ai_chat_sessions (user_id, session_id, title)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [userId, sessionId, title || 'New Chat']);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getChatSessions(userId: number): Promise<any[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM ai_chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC',
        [userId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async createChatMessage(sessionId: number, role: string, content: string): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO ai_chat_messages (session_id, role, content)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [sessionId, role, content]);
      
      // Update session timestamp
      await client.query(
        'UPDATE ai_chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [sessionId]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getChatMessages(sessionId: number): Promise<any[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM ai_chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
        [sessionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Helper methods for mapping database fields
  private mapUserFromDB(row: any): IUser {
    return {
      _id: row.id,
      email: row.email,
      password: row.password,
      firstName: row.first_name,
      lastName: row.last_name,
      profileImageUrl: row.profile_image_url,
      phoneNumber: row.phone_number,
      language: row.language,
      knowledgeLevel: row.knowledge_level,
      dailyGoal: row.daily_goal,
      ageGroup: row.age_group,
      onboardingCompleted: row.onboarding_completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    } as IUser;
  }

  private mapUserFieldToDB(field: string): string {
    const fieldMap: { [key: string]: string } = {
      firstName: 'first_name',
      lastName: 'last_name',
      profileImageUrl: 'profile_image_url',
      phoneNumber: 'phone_number',
      knowledgeLevel: 'knowledge_level',
      dailyGoal: 'daily_goal',
      ageGroup: 'age_group',
      onboardingCompleted: 'onboarding_completed'
    };
    return fieldMap[field] || field;
  }

  private mapTransactionFromDB(row: any): ITransaction {
    return {
      _id: row.id,
      userId: row.user_id,
      name: row.name,
      amount: parseFloat(row.amount),
      type: row.type,
      category: row.category,
      description: row.description,
      date: row.date,
      isRecurring: false,
      createdAt: row.created_at
    } as ITransaction;
  }

  private mapTaskFromDB(row: any): ITask {
    return {
      _id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      category: row.category,
      priority: row.priority,
      dueDate: row.due_date,
      completed: row.completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    } as ITask;
  }

  private mapTaskFieldToDB(field: string): string {
    const fieldMap: { [key: string]: string } = {
      dueDate: 'due_date'
    };
    return fieldMap[field] || field;
  }

  private mapGoalFromDB(row: any): IFinancialGoal {
    return {
      _id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      targetAmount: parseFloat(row.target_amount),
      currentAmount: parseFloat(row.current_amount),
      targetDate: row.target_date,
      category: row.category,
      isActive: !row.completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    } as IFinancialGoal;
  }

  private mapGoalFieldToDB(field: string): string {
    const fieldMap: { [key: string]: string } = {
      targetAmount: 'target_amount',
      currentAmount: 'current_amount',
      targetDate: 'target_date',
      isActive: 'completed'
    };
    return fieldMap[field] || field;
  }

  private mapCalculatorHistoryFromDB(row: any): ICalculatorHistory {
    return {
      _id: row.id,
      userId: row.user_id,
      calculatorType: row.calculator_type,
      inputs: JSON.parse(row.inputs),
      results: JSON.parse(row.results),
      createdAt: row.created_at
    } as ICalculatorHistory;
  }

  private mapNotificationFromDB(row: any): INotification {
    return {
      _id: row.id,
      userId: row.user_id,
      title: row.title,
      message: row.message,
      type: row.type,
      read: row.read,
      actionUrl: row.action_url,
      createdAt: row.created_at
    } as INotification;
  }
}

export const postgresStorage = new PostgreSQLStorage();