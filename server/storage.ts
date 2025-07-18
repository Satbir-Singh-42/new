import {
  User,
  UserProgress,
  LearningModule,
  UserLesson,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Task,
  Transaction,
  FinancialGoal,
  Notification,
  CalculatorHistory,
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

export class MongoStorage implements IStorage {
  // User operations
  async createUser(userData: UpsertUser): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).exec();
  }

  async updateUser(id: string, updates: UpdateUser): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).exec();
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async clearAllUsers(): Promise<void> {
    await User.deleteMany({}).exec();
    await UserProgress.deleteMany({}).exec();
    await UserLesson.deleteMany({}).exec();
    await QuizAttempt.deleteMany({}).exec();
    await Task.deleteMany({}).exec();
    await Transaction.deleteMany({}).exec();
    await FinancialGoal.deleteMany({}).exec();
    await Notification.deleteMany({}).exec();
    await CalculatorHistory.deleteMany({}).exec();
  }

  // User progress operations
  async getUserProgress(userId: string): Promise<IUserProgress | null> {
    let progress = await UserProgress.findOne({ userId }).exec();
    if (!progress) {
      progress = new UserProgress({ userId });
      await progress.save();
    }
    return progress;
  }

  async updateUserProgress(userId: string, progressData: Partial<IUserProgress>): Promise<IUserProgress | null> {
    return await UserProgress.findOneAndUpdate(
      { userId },
      { ...progressData, updatedAt: new Date() },
      { new: true, upsert: true }
    ).exec();
  }

  // Learning module operations
  async getLearningModules(): Promise<ILearningModule[]> {
    return await LearningModule.find({ isActive: true }).exec();
  }

  async getLearningModuleById(id: string): Promise<ILearningModule | null> {
    return await LearningModule.findById(id).exec();
  }

  async getLearningModulesByCategory(category: string): Promise<ILearningModule[]> {
    return await LearningModule.find({ category, isActive: true }).exec();
  }

  // User lesson operations
  async getUserLessons(userId: string): Promise<IUserLesson[]> {
    return await UserLesson.find({ userId }).exec();
  }

  async getUserLesson(userId: string, moduleId: string): Promise<IUserLesson | null> {
    return await UserLesson.findOne({ userId, moduleId }).exec();
  }

  async updateUserLesson(userId: string, moduleId: string, updates: Partial<IUserLesson>): Promise<IUserLesson | null> {
    return await UserLesson.findOneAndUpdate(
      { userId, moduleId },
      { ...updates, lastAccessed: new Date() },
      { new: true, upsert: true }
    ).exec();
  }

  // Quiz operations
  async getQuizzes(): Promise<IQuiz[]> {
    return await Quiz.find({ isActive: true }).exec();
  }

  async getQuizById(id: string): Promise<IQuiz | null> {
    return await Quiz.findById(id).exec();
  }

  async getQuizQuestions(quizId: string): Promise<IQuizQuestion[]> {
    return await QuizQuestion.find({ quizId }).sort({ orderIndex: 1 }).exec();
  }

  // Quiz attempt operations
  async createQuizAttempt(attemptData: Partial<IQuizAttempt>): Promise<IQuizAttempt> {
    const attempt = new QuizAttempt(attemptData);
    return await attempt.save();
  }

  async getQuizAttempts(userId: string): Promise<IQuizAttempt[]> {
    return await QuizAttempt.find({ userId }).sort({ startedAt: -1 }).exec();
  }

  async updateQuizAttempt(id: string, updates: Partial<IQuizAttempt>): Promise<IQuizAttempt | null> {
    return await QuizAttempt.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  // Task operations
  async getTasks(userId: string): Promise<ITask[]> {
    return await Task.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async getTaskById(id: string): Promise<ITask | null> {
    return await Task.findById(id).exec();
  }

  async createTask(userId: string, taskData: InsertTask): Promise<ITask> {
    const task = new Task({ ...taskData, userId });
    return await task.save();
  }

  async updateTask(id: string, updates: Partial<ITask>): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).exec();
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await Task.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // Transaction operations
  async getTransactions(userId: string): Promise<ITransaction[]> {
    return await Transaction.find({ userId }).sort({ date: -1 }).exec();
  }

  async getTransactionById(id: string): Promise<ITransaction | null> {
    return await Transaction.findById(id).exec();
  }

  async createTransaction(userId: string, transactionData: InsertTransaction): Promise<ITransaction> {
    const transaction = new Transaction({ ...transactionData, userId });
    return await transaction.save();
  }

  async updateTransaction(id: string, updates: Partial<ITransaction>): Promise<ITransaction | null> {
    return await Transaction.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const result = await Transaction.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // Financial goal operations
  async getFinancialGoals(userId: string): Promise<IFinancialGoal[]> {
    return await FinancialGoal.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async getFinancialGoalById(id: string): Promise<IFinancialGoal | null> {
    return await FinancialGoal.findById(id).exec();
  }

  async createFinancialGoal(userId: string, goalData: InsertGoal): Promise<IFinancialGoal> {
    const goal = new FinancialGoal({ ...goalData, userId });
    return await goal.save();
  }

  async updateFinancialGoal(id: string, updates: Partial<IFinancialGoal>): Promise<IFinancialGoal | null> {
    return await FinancialGoal.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).exec();
  }

  async deleteFinancialGoal(id: string): Promise<boolean> {
    const result = await FinancialGoal.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // Notification operations
  async getNotifications(userId: string): Promise<INotification[]> {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async createNotification(userId: string, notificationData: Partial<INotification>): Promise<INotification> {
    const notification = new Notification({ ...notificationData, userId });
    return await notification.save();
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const result = await Notification.findByIdAndUpdate(id, { read: true }, { new: true }).exec();
    return result !== null;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await Notification.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // Calculator history operations
  async getCalculatorHistory(userId: string): Promise<ICalculatorHistory[]> {
    return await CalculatorHistory.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async createCalculatorHistory(userId: string, historyData: InsertCalculatorHistory): Promise<ICalculatorHistory> {
    const history = new CalculatorHistory({ ...historyData, userId });
    return await history.save();
  }

  async deleteCalculatorHistory(id: string): Promise<boolean> {
    const result = await CalculatorHistory.findByIdAndDelete(id).exec();
    return result !== null;
  }
}

export const storage = new MongoStorage();