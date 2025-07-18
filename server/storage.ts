import {
  type User,
  type UserProgress,
  type LearningModule,
  type UserLesson,
  type Quiz,
  type QuizQuestion,
  type QuizAttempt,
  type Task,
  type Transaction,
  type FinancialGoal,
  type Notification,
  type CalculatorHistory,
  type IUser,
  type IUserProgress,
  type ILearningModule,
  type IUserLesson,
  type IQuiz,
  type IQuizQuestion,
  type IQuizAttempt,
  type ITask,
  type ITransaction,
  type IFinancialGoal,
  type INotification,
  type ICalculatorHistory,
  type UpsertUser,
  type UpdateUser,
  type InsertTask,
  type InsertTransaction,
  type InsertGoal,
  type InsertCalculatorHistory,
} from "@shared/schema";
import { UserModel, LearningModuleModel, QuizModel, TaskModel } from "./models";

export interface IStorage {
  // User operations
  createUser(user: UpsertUser): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  updateUser(id: string, updates: UpdateUser): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
  clearAllUsers(): Promise<void>;

  // User progress operations
  getUserProgress(userId: string): Promise<IUserProgress | null>;
  updateUserProgress(userId: string, progress: Partial<IUserProgress>): Promise<IUserProgress | null>;

  // Learning module operations
  getLearningModules(): Promise<ILearningModule[]>;
  getLearningModuleById(id: string): Promise<ILearningModule | null>;
  getLearningModulesByCategory(category: string): Promise<ILearningModule[]>;

  // User lesson operations
  getUserLessons(userId: string): Promise<IUserLesson[]>;
  getUserLesson(userId: string, moduleId: string): Promise<IUserLesson | null>;
  updateUserLesson(userId: string, moduleId: string, updates: Partial<IUserLesson>): Promise<IUserLesson | null>;

  // Quiz operations
  getQuizzes(): Promise<IQuiz[]>;
  getQuizById(id: string): Promise<IQuiz | null>;
  getQuizQuestions(quizId: string): Promise<IQuizQuestion[]>;
  
  // Quiz attempt operations
  createQuizAttempt(attempt: Partial<IQuizAttempt>): Promise<IQuizAttempt>;
  getQuizAttempts(userId: string): Promise<IQuizAttempt[]>;
  updateQuizAttempt(id: string, updates: Partial<IQuizAttempt>): Promise<IQuizAttempt | null>;

  // Task operations
  getTasks(userId: string): Promise<ITask[]>;
  getTaskById(id: string): Promise<ITask | null>;
  createTask(userId: string, task: InsertTask): Promise<ITask>;
  updateTask(id: string, updates: Partial<ITask>): Promise<ITask | null>;
  deleteTask(id: string): Promise<boolean>;

  // Transaction operations
  getTransactions(userId: string): Promise<ITransaction[]>;
  getTransactionById(id: string): Promise<ITransaction | null>;
  createTransaction(userId: string, transaction: InsertTransaction): Promise<ITransaction>;
  updateTransaction(id: string, updates: Partial<ITransaction>): Promise<ITransaction | null>;
  deleteTransaction(id: string): Promise<boolean>;

  // Financial goal operations
  getFinancialGoals(userId: string): Promise<IFinancialGoal[]>;
  getFinancialGoalById(id: string): Promise<IFinancialGoal | null>;
  createFinancialGoal(userId: string, goal: InsertGoal): Promise<IFinancialGoal>;
  updateFinancialGoal(id: string, updates: Partial<IFinancialGoal>): Promise<IFinancialGoal | null>;
  deleteFinancialGoal(id: string): Promise<boolean>;

  // Notification operations
  getNotifications(userId: string): Promise<INotification[]>;
  createNotification(userId: string, notification: Partial<INotification>): Promise<INotification>;
  markNotificationAsRead(id: string): Promise<boolean>;
  deleteNotification(id: string): Promise<boolean>;

  // Calculator history operations
  getCalculatorHistory(userId: string): Promise<ICalculatorHistory[]>;
  createCalculatorHistory(userId: string, history: InsertCalculatorHistory): Promise<ICalculatorHistory>;
  deleteCalculatorHistory(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async createUser(userData: UpsertUser): Promise<IUser> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).exec();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email }).exec();
  }

  async updateUser(id: string, updates: UpdateUser): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).exec();
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async clearAllUsers(): Promise<void> {
    await UserModel.deleteMany({}).exec();
    await TaskModel.deleteMany({}).exec();
  }

  // User progress operations
  async getUserProgress(userId: string): Promise<IUserProgress | null> {
    // For now, return a mock progress object
    return {
      _id: `progress-${userId}`,
      userId,
      moduleId: 'general',
      completed: false,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateUserProgress(userId: string, progressData: Partial<IUserProgress>): Promise<IUserProgress | null> {
    // For now, return a mock updated progress object
    return {
      _id: `progress-${userId}`,
      userId,
      moduleId: 'general',
      completed: false,
      progress: 0,
      ...progressData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Learning module operations
  async getLearningModules(): Promise<ILearningModule[]> {
    return await LearningModuleModel.find({ isActive: true }).exec();
  }

  async getLearningModuleById(id: string): Promise<ILearningModule | null> {
    return await LearningModuleModel.findById(id).exec();
  }

  async getLearningModulesByCategory(category: string): Promise<ILearningModule[]> {
    return await LearningModuleModel.find({ category, isActive: true }).exec();
  }

  // User lesson operations
  async getUserLessons(userId: string): Promise<IUserLesson[]> {
    // For now, return empty array
    return [];
  }

  async getUserLesson(userId: string, moduleId: string): Promise<IUserLesson | null> {
    // For now, return null
    return null;
  }

  async updateUserLesson(userId: string, moduleId: string, updates: Partial<IUserLesson>): Promise<IUserLesson | null> {
    // For now, return a mock lesson object
    return {
      userId,
      moduleId,
      completed: false,
      ...updates,
    };
  }

  // Quiz operations
  async getQuizzes(): Promise<IQuiz[]> {
    return await QuizModel.find({ isActive: true }).exec();
  }

  async getQuizById(id: string): Promise<IQuiz | null> {
    return await QuizModel.findById(id).exec();
  }

  async getQuizQuestions(quizId: string): Promise<IQuizQuestion[]> {
    const quiz = await QuizModel.findById(quizId).exec();
    return quiz?.questions || [];
  }

  // Quiz attempt operations
  async createQuizAttempt(attempt: Partial<IQuizAttempt>): Promise<IQuizAttempt> {
    // For now, return a mock attempt
    return {
      _id: `attempt-${Date.now()}`,
      userId: attempt.userId!,
      quizId: attempt.quizId!,
      score: attempt.score || 0,
      totalQuestions: attempt.totalQuestions || 0,
      answers: attempt.answers || [],
      completedAt: new Date(),
      createdAt: new Date(),
    };
  }

  async getQuizAttempts(userId: string): Promise<IQuizAttempt[]> {
    // For now, return empty array
    return [];
  }

  async updateQuizAttempt(id: string, updates: Partial<IQuizAttempt>): Promise<IQuizAttempt | null> {
    // For now, return null
    return null;
  }

  // Task operations
  async getTasks(userId: string): Promise<ITask[]> {
    return await TaskModel.find({ userId }).exec();
  }

  async getTaskById(id: string): Promise<ITask | null> {
    return await TaskModel.findById(id).exec();
  }

  async createTask(userId: string, task: InsertTask): Promise<ITask> {
    const newTask = new TaskModel({ ...task, userId });
    return await newTask.save();
  }

  async updateTask(id: string, updates: Partial<ITask>): Promise<ITask | null> {
    return await TaskModel.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).exec();
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await TaskModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // Transaction operations
  async getTransactions(userId: string): Promise<ITransaction[]> {
    // For now, return empty array
    return [];
  }

  async getTransactionById(id: string): Promise<ITransaction | null> {
    return null;
  }

  async createTransaction(userId: string, transaction: InsertTransaction): Promise<ITransaction> {
    // For now, return a mock transaction
    return {
      _id: `transaction-${Date.now()}`,
      ...transaction,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateTransaction(id: string, updates: Partial<ITransaction>): Promise<ITransaction | null> {
    return null;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return false;
  }

  // Financial goal operations
  async getFinancialGoals(userId: string): Promise<IFinancialGoal[]> {
    return [];
  }

  async getFinancialGoalById(id: string): Promise<IFinancialGoal | null> {
    return null;
  }

  async createFinancialGoal(userId: string, goal: InsertGoal): Promise<IFinancialGoal> {
    return {
      _id: `goal-${Date.now()}`,
      ...goal,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateFinancialGoal(id: string, updates: Partial<IFinancialGoal>): Promise<IFinancialGoal | null> {
    return null;
  }

  async deleteFinancialGoal(id: string): Promise<boolean> {
    return false;
  }

  // Notification operations
  async getNotifications(userId: string): Promise<INotification[]> {
    return [];
  }

  async createNotification(userId: string, notification: Partial<INotification>): Promise<INotification> {
    return {
      _id: `notification-${Date.now()}`,
      userId,
      title: notification.title || 'New Notification',
      message: notification.message || 'You have a new notification',
      type: notification.type || 'info',
      read: false,
      createdAt: new Date(),
    };
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    return true;
  }

  async deleteNotification(id: string): Promise<boolean> {
    return true;
  }

  // Calculator history operations
  async getCalculatorHistory(userId: string): Promise<ICalculatorHistory[]> {
    return [];
  }

  async createCalculatorHistory(userId: string, history: InsertCalculatorHistory): Promise<ICalculatorHistory> {
    return {
      _id: `history-${Date.now()}`,
      ...history,
      userId,
      createdAt: new Date(),
    };
  }

  async deleteCalculatorHistory(id: string): Promise<boolean> {
    return true;
  }
}

export const storage = new DatabaseStorage();