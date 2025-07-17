import {
  users,
  userProgress,
  learningModules,
  userLessons,
  quizzes,
  quizQuestions,
  quizAttempts,
  tasks,
  transactions,
  financialGoals,
  notifications,
  calculatorHistory,
  type User,
  type UpsertUser,
  type UserProgress,
  type LearningModule,
  type UserLesson,
  type Quiz,
  type QuizQuestion,
  type QuizAttempt,
  type Task,
  type InsertTask,
  type Transaction,
  type InsertTransaction,
  type FinancialGoal,
  type InsertGoal,
  type Notification,
  type CalculatorHistory,
  type InsertCalculatorHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserOnboarding(userId: string, data: Partial<User>): Promise<User>;
  
  // Progress operations
  getUserProgress(userId: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress>;
  
  // Learning operations
  getLearningModules(category?: string): Promise<LearningModule[]>;
  getUserLessons(userId: string): Promise<UserLesson[]>;
  updateLessonProgress(userId: string, moduleId: number, progress: number): Promise<UserLesson>;
  completLesson(userId: string, moduleId: number): Promise<UserLesson>;
  
  // Quiz operations
  getQuizzes(category?: string): Promise<Quiz[]>;
  getQuizById(id: number): Promise<Quiz | undefined>;
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  createQuizAttempt(userId: string, quizId: number): Promise<QuizAttempt>;
  updateQuizAttempt(attemptId: number, updates: Partial<QuizAttempt>): Promise<QuizAttempt>;
  getUserQuizAttempts(userId: string): Promise<QuizAttempt[]>;
  
  // Task operations
  getUserTasks(userId: string): Promise<Task[]>;
  createTask(userId: string, task: InsertTask): Promise<Task>;
  updateTask(taskId: number, updates: Partial<Task>): Promise<Task>;
  deleteTask(taskId: number): Promise<void>;
  
  // Transaction operations
  getUserTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(userId: string, transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;
  
  // Goal operations
  getUserGoals(userId: string): Promise<FinancialGoal[]>;
  createGoal(userId: string, goal: InsertGoal): Promise<FinancialGoal>;
  updateGoal(goalId: number, updates: Partial<FinancialGoal>): Promise<FinancialGoal>;
  
  // Notification operations
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationRead(notificationId: number): Promise<void>;
  createNotification(userId: string, title: string, message: string, type?: string): Promise<Notification>;
  
  // Calculator operations
  saveCalculatorHistory(userId: string, history: InsertCalculatorHistory): Promise<CalculatorHistory>;
  getUserCalculatorHistory(userId: string, type?: string): Promise<CalculatorHistory[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserOnboarding(userId: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Progress operations
  async getUserProgress(userId: string): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    
    if (!progress) {
      // Create initial progress record
      const [newProgress] = await db
        .insert(userProgress)
        .values({ userId })
        .returning();
      return newProgress;
    }
    
    return progress;
  }

  async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const [progress] = await db
      .update(userProgress)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProgress.userId, userId))
      .returning();
    return progress;
  }

  // Learning operations
  async getLearningModules(category?: string): Promise<LearningModule[]> {
    let query = db.select().from(learningModules).where(eq(learningModules.isActive, true));
    
    if (category) {
      query = query.where(eq(learningModules.category, category));
    }
    
    return await query;
  }

  async getUserLessons(userId: string): Promise<UserLesson[]> {
    return await db.select().from(userLessons).where(eq(userLessons.userId, userId));
  }

  async updateLessonProgress(userId: string, moduleId: number, progress: number): Promise<UserLesson> {
    const [lesson] = await db
      .insert(userLessons)
      .values({
        userId,
        moduleId,
        progress,
        lastAccessed: new Date(),
      })
      .onConflictDoUpdate({
        target: [userLessons.userId, userLessons.moduleId],
        set: {
          progress,
          lastAccessed: new Date(),
        },
      })
      .returning();
    return lesson;
  }

  async completLesson(userId: string, moduleId: number): Promise<UserLesson> {
    const [lesson] = await db
      .update(userLessons)
      .set({
        completed: true,
        progress: 100,
        completedAt: new Date(),
      })
      .where(and(eq(userLessons.userId, userId), eq(userLessons.moduleId, moduleId)))
      .returning();
    return lesson;
  }

  // Quiz operations
  async getQuizzes(category?: string): Promise<Quiz[]> {
    let query = db.select().from(quizzes).where(eq(quizzes.isActive, true));
    
    if (category) {
      query = query.where(eq(quizzes.category, category));
    }
    
    return await query;
  }

  async getQuizById(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.orderIndex);
  }

  async createQuizAttempt(userId: string, quizId: number): Promise<QuizAttempt> {
    const [attempt] = await db
      .insert(quizAttempts)
      .values({
        userId,
        quizId,
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
      })
      .returning();
    return attempt;
  }

  async updateQuizAttempt(attemptId: number, updates: Partial<QuizAttempt>): Promise<QuizAttempt> {
    const [attempt] = await db
      .update(quizAttempts)
      .set(updates)
      .where(eq(quizAttempts.id, attemptId))
      .returning();
    return attempt;
  }

  async getUserQuizAttempts(userId: string): Promise<QuizAttempt[]> {
    return await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId))
      .orderBy(desc(quizAttempts.startedAt));
  }

  // Task operations
  async getUserTasks(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async createTask(userId: string, task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values({ ...task, userId })
      .returning();
    return newTask;
  }

  async updateTask(taskId: number, updates: Partial<Task>): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, taskId))
      .returning();
    return task;
  }

  async deleteTask(taskId: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, taskId));
  }

  // Transaction operations
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date));
  }

  async createTransaction(userId: string, transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values({ ...transaction, userId })
      .returning();
    return newTransaction;
  }

  async getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .orderBy(desc(transactions.date));
  }

  // Goal operations
  async getUserGoals(userId: string): Promise<FinancialGoal[]> {
    return await db
      .select()
      .from(financialGoals)
      .where(eq(financialGoals.userId, userId))
      .orderBy(desc(financialGoals.createdAt));
  }

  async createGoal(userId: string, goal: InsertGoal): Promise<FinancialGoal> {
    const [newGoal] = await db
      .insert(financialGoals)
      .values({ ...goal, userId })
      .returning();
    return newGoal;
  }

  async updateGoal(goalId: number, updates: Partial<FinancialGoal>): Promise<FinancialGoal> {
    const [goal] = await db
      .update(financialGoals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(financialGoals.id, goalId))
      .returning();
    return goal;
  }

  // Notification operations
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationRead(notificationId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notificationId));
  }

  async createNotification(userId: string, title: string, message: string, type: string = "info"): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values({ userId, title, message, type })
      .returning();
    return notification;
  }

  // Calculator operations
  async saveCalculatorHistory(userId: string, history: InsertCalculatorHistory): Promise<CalculatorHistory> {
    const [newHistory] = await db
      .insert(calculatorHistory)
      .values({ ...history, userId })
      .returning();
    return newHistory;
  }

  async getUserCalculatorHistory(userId: string, type?: string): Promise<CalculatorHistory[]> {
    let query = db
      .select()
      .from(calculatorHistory)
      .where(eq(calculatorHistory.userId, userId));
    
    if (type) {
      query = query.where(eq(calculatorHistory.calculatorType, type));
    }
    
    return await query.orderBy(desc(calculatorHistory.createdAt));
  }
}

export const storage = new DatabaseStorage();
