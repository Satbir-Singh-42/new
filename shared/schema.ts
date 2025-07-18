import { z } from 'zod';

// User Schema
export const userSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email(),
  username: z.string().min(3).max(100),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
  passwordHash: z.string().min(6),
  language: z.enum(['en', 'hi', 'pa']).default('en'),
  onboardingCompleted: z.boolean().default(false),
  knowledgeLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  dailyGoal: z.number().min(5).max(120).optional(),
  ageGroup: z.enum(['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']).optional(),
  totalPoints: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Learning Module Schema
export const learningModuleSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.enum(['budgeting', 'savings', 'investing', 'fraud', 'privacy', 'taxes']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  duration: z.number().min(1).max(180),
  points: z.number().default(0),
  content: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// User Progress Schema
export const userProgressSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  moduleId: z.string(),
  completed: z.boolean().default(false),
  progress: z.number().min(0).max(100).default(0),
  completedAt: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Quiz Schema
export const quizSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.enum(['budgeting', 'savings', 'investing', 'fraud', 'privacy', 'taxes']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  duration: z.number().min(1).max(60),
  points: z.number().default(0),
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    correct: z.number(),
    explanation: z.string().optional(),
  })),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Quiz Attempt Schema
export const quizAttemptSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  quizId: z.string(),
  score: z.number().default(0),
  totalQuestions: z.number().default(0),
  answers: z.array(z.object({
    questionIndex: z.number(),
    selectedAnswer: z.number(),
    correct: z.boolean(),
  })),
  completedAt: z.date().default(() => new Date()),
  createdAt: z.date().default(() => new Date()),
});

// Task Schema
export const taskSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.date().optional(),
  completed: z.boolean().default(false),
  completedAt: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Calculator History Schema
export const calculatorHistorySchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  calculatorType: z.enum(['budget', 'tax', 'emi', 'investment']),
  inputs: z.record(z.any()),
  results: z.record(z.any()),
  createdAt: z.date().default(() => new Date()),
});

// Additional schemas for legacy compatibility
export const transactionSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1).max(255),
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  category: z.string().max(100),
  description: z.string().optional(),
  date: z.date().default(() => new Date()),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const financialGoalSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  targetAmount: z.number().min(0),
  currentAmount: z.number().default(0),
  targetDate: z.date(),
  category: z.string().max(100),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  completed: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const notificationSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  type: z.enum(['info', 'warning', 'success', 'error']).default('info'),
  read: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});

// Insert schemas (for creating new records)
export const insertUserSchema = userSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLearningModuleSchema = learningModuleSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizSchema = quizSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = taskSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserProgressSchema = userProgressSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizAttemptSchema = quizAttemptSchema.omit({
  _id: true,
  createdAt: true,
});

export const insertCalculatorHistorySchema = calculatorHistorySchema.omit({
  _id: true,
  createdAt: true,
});

export const insertTransactionSchema = transactionSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFinancialGoalSchema = financialGoalSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = notificationSchema.omit({
  _id: true,
  createdAt: true,
});

// Additional legacy schema exports for compatibility
export const insertGoalSchema = insertFinancialGoalSchema;
export const updateUserSchema = userSchema.omit({ 
  _id: true, 
  createdAt: true, 
  updatedAt: true, 
  passwordHash: true 
}).partial();
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LearningModule = z.infer<typeof learningModuleSchema>;
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UserProgress = z.infer<typeof userProgressSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type QuizAttempt = z.infer<typeof quizAttemptSchema>;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type CalculatorHistory = z.infer<typeof calculatorHistorySchema>;
export type InsertCalculatorHistory = z.infer<typeof insertCalculatorHistorySchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type FinancialGoal = z.infer<typeof financialGoalSchema>;
export type InsertFinancialGoal = z.infer<typeof insertFinancialGoalSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Legacy interface names for compatibility
export type IUser = User;
export type ILearningModule = LearningModule;
export type IQuiz = Quiz;
export type ITask = Task;
export type IUserProgress = UserProgress;
export type IQuizAttempt = QuizAttempt;
export type ICalculatorHistory = CalculatorHistory;
export type ITransaction = Transaction;
export type IFinancialGoal = FinancialGoal;
export type INotification = Notification;

// Additional legacy types
export type UpsertUser = InsertUser;
export type UpdateUser = Partial<InsertUser>;
export type UserLesson = { userId: string; moduleId: string; completed: boolean };
export type IUserLesson = UserLesson;
export type QuizQuestion = { question: string; options: string[]; correct: number; explanation?: string };
export type IQuizQuestion = QuizQuestion;
export type InsertGoal = InsertFinancialGoal;