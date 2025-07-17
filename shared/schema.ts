import { Schema, model, Document } from "mongoose";
import { z } from "zod";

// User interface and schema
export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  language: string;
  knowledgeLevel?: string;
  dailyGoal: number;
  ageGroup?: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  profileImageUrl: { type: String },
  phoneNumber: { type: String },
  language: { type: String, default: "english" },
  knowledgeLevel: { type: String },
  dailyGoal: { type: Number, default: 15 },
  ageGroup: { type: String },
  onboardingCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", userSchema);

// Learning progress tracking
export interface IUserProgress extends Document {
  userId: string;
  lessonsCompleted: number;
  modulesInProgress: number;
  quizzesAttempted: number;
  goalsTracked: number;
  currentStreak: number;
  totalPoints: number;
  updatedAt: Date;
}

const userProgressSchema = new Schema<IUserProgress>({
  userId: { type: String, required: true, ref: "User" },
  lessonsCompleted: { type: Number, default: 0 },
  modulesInProgress: { type: Number, default: 0 },
  quizzesAttempted: { type: Number, default: 0 },
  goalsTracked: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export const UserProgress = model<IUserProgress>("UserProgress", userProgressSchema);

// Learning modules and lessons
export interface ILearningModule extends Document {
  title: string;
  description?: string;
  category: string;
  difficulty: string;
  estimatedTime?: number;
  imageUrl?: string;
  content?: any;
  isActive: boolean;
  createdAt: Date;
}

const learningModuleSchema = new Schema<ILearningModule>({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  difficulty: { type: String, default: "beginner" },
  estimatedTime: { type: Number },
  imageUrl: { type: String },
  content: { type: Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const LearningModule = model<ILearningModule>("LearningModule", learningModuleSchema);

// User lesson completion
export interface IUserLesson extends Document {
  userId: string;
  moduleId: string;
  completed: boolean;
  progress: number;
  timeSpent: number;
  lastAccessed: Date;
  completedAt?: Date;
}

const userLessonSchema = new Schema<IUserLesson>({
  userId: { type: String, required: true, ref: "User" },
  moduleId: { type: String, required: true, ref: "LearningModule" },
  completed: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

export const UserLesson = model<IUserLesson>("UserLesson", userLessonSchema);

// Quiz system
export interface IQuiz extends Document {
  title: string;
  description?: string;
  category: string;
  difficulty: string;
  totalQuestions: number;
  timeLimit?: number;
  passingScore: number;
  isActive: boolean;
  createdAt: Date;
}

const quizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  difficulty: { type: String, default: "beginner" },
  totalQuestions: { type: Number, required: true },
  timeLimit: { type: Number },
  passingScore: { type: Number, default: 70 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Quiz = model<IQuiz>("Quiz", quizSchema);

// Quiz questions
export interface IQuizQuestion extends Document {
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
  orderIndex: number;
}

const quizQuestionSchema = new Schema<IQuizQuestion>({
  quizId: { type: String, required: true, ref: "Quiz" },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  explanation: { type: String },
  points: { type: Number, default: 10 },
  orderIndex: { type: Number, required: true },
});

export const QuizQuestion = model<IQuizQuestion>("QuizQuestion", quizQuestionSchema);

// Quiz attempts
export interface IQuizAttempt extends Document {
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent?: number;
  answers?: any;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

const quizAttemptSchema = new Schema<IQuizAttempt>({
  userId: { type: String, required: true, ref: "User" },
  quizId: { type: String, required: true, ref: "Quiz" },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  timeSpent: { type: Number },
  answers: { type: Schema.Types.Mixed },
  completed: { type: Boolean, default: false },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

export const QuizAttempt = model<IQuizAttempt>("QuizAttempt", quizAttemptSchema);

// Task management
export interface ITask extends Document {
  userId: string;
  title: string;
  description?: string;
  category: string;
  dueDate?: Date;
  startTime?: string;
  endTime?: string;
  completed: boolean;
  priority: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  userId: { type: String, required: true, ref: "User" },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: "general" },
  dueDate: { type: Date },
  startTime: { type: String },
  endTime: { type: String },
  completed: { type: Boolean, default: false },
  priority: { type: String, default: "medium" },
  tags: { type: [String] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Task = model<ITask>("Task", taskSchema);

// Financial transactions
export interface ITransaction extends Document {
  userId: string;
  name: string;
  amount: number;
  category: string;
  type: string;
  description?: string;
  date: Date;
  isRecurring: boolean;
  recurringPeriod?: string;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true, ref: "User" },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  isRecurring: { type: Boolean, default: false },
  recurringPeriod: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Transaction = model<ITransaction>("Transaction", transactionSchema);

// Financial goals
export interface IFinancialGoal extends Document {
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const financialGoalSchema = new Schema<IFinancialGoal>({
  userId: { type: String, required: true, ref: "User" },
  title: { type: String, required: true },
  description: { type: String },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  targetDate: { type: Date },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const FinancialGoal = model<IFinancialGoal>("FinancialGoal", financialGoalSchema);

// Notifications
export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, ref: "User" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: "info" },
  read: { type: Boolean, default: false },
  actionUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = model<INotification>("Notification", notificationSchema);

// Calculator history
export interface ICalculatorHistory extends Document {
  userId: string;
  calculatorType: string;
  inputs: any;
  results: any;
  createdAt: Date;
}

const calculatorHistorySchema = new Schema<ICalculatorHistory>({
  userId: { type: String, required: true, ref: "User" },
  calculatorType: { type: String, required: true },
  inputs: { type: Schema.Types.Mixed, required: true },
  results: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const CalculatorHistory = model<ICalculatorHistory>("CalculatorHistory", calculatorHistorySchema);

// Zod validation schemas
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
  phoneNumber: z.string().optional(),
  language: z.string().default("english"),
  knowledgeLevel: z.string().optional(),
  dailyGoal: z.number().default(15),
  ageGroup: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
  phoneNumber: z.string().optional(),
  language: z.string().optional(),
  knowledgeLevel: z.string().optional(),
  dailyGoal: z.number().optional(),
  ageGroup: z.string().optional(),
  onboardingCompleted: z.boolean().optional(),
});

export const insertTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string().default("general"),
  dueDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  priority: z.string().default("medium"),
  tags: z.array(z.string()).optional(),
});

export const insertTransactionSchema = z.object({
  name: z.string(),
  amount: z.number(),
  category: z.string(),
  type: z.string(),
  description: z.string().optional(),
  date: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringPeriod: z.string().optional(),
});

export const insertGoalSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  targetAmount: z.number(),
  currentAmount: z.number().default(0),
  targetDate: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
  category: z.string(),
});

export const insertQuizAttemptSchema = z.object({
  userId: z.string(),
  quizId: z.string(),
  score: z.number(),
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  timeSpent: z.number().optional(),
  answers: z.any().optional(),
  completed: z.boolean().default(false),
});

export const insertCalculatorHistorySchema = z.object({
  calculatorType: z.string(),
  inputs: z.any(),
  results: z.any(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Type exports
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type InsertCalculatorHistory = z.infer<typeof insertCalculatorHistorySchema>;
export type LoginData = z.infer<typeof loginSchema>;