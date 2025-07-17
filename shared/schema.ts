import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phoneNumber: varchar("phone_number"),
  language: varchar("language").default("english"),
  knowledgeLevel: varchar("knowledge_level"),
  dailyGoal: integer("daily_goal").default(15), // minutes
  ageGroup: varchar("age_group"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning progress tracking
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonsCompleted: integer("lessons_completed").default(0),
  modulesInProgress: integer("modules_in_progress").default(0),
  quizzesAttempted: integer("quizzes_attempted").default(0),
  goalsTracked: integer("goals_tracked").default(0),
  currentStreak: integer("current_streak").default(0),
  totalPoints: integer("total_points").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning modules and lessons
export const learningModules = pgTable("learning_modules", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  difficulty: varchar("difficulty").default("beginner"),
  estimatedTime: integer("estimated_time"), // minutes
  imageUrl: varchar("image_url"),
  content: jsonb("content"), // Rich content structure
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User lesson completion
export const userLessons = pgTable("user_lessons", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  moduleId: integer("module_id").references(() => learningModules.id).notNull(),
  completed: boolean("completed").default(false),
  progress: integer("progress").default(0), // percentage
  timeSpent: integer("time_spent").default(0), // minutes
  lastAccessed: timestamp("last_accessed").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Quiz system
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  difficulty: varchar("difficulty").default("beginner"),
  totalQuestions: integer("total_questions").notNull(),
  timeLimit: integer("time_limit"), // minutes
  passingScore: integer("passing_score").default(70), // percentage
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // Array of options
  correctAnswer: integer("correct_answer").notNull(), // Index of correct option
  explanation: text("explanation"),
  points: integer("points").default(10),
  orderIndex: integer("order_index").notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  timeSpent: integer("time_spent"), // seconds
  answers: jsonb("answers"), // User's answers
  completed: boolean("completed").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Task management
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").default("general"),
  dueDate: date("due_date"),
  startTime: varchar("start_time"),
  endTime: varchar("end_time"),
  completed: boolean("completed").default(false),
  priority: varchar("priority").default("medium"),
  tags: jsonb("tags"), // Array of tags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Financial transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(),
  type: varchar("type").notNull(), // income, expense
  description: text("description"),
  date: timestamp("date").defaultNow(),
  isRecurring: boolean("is_recurring").default(false),
  recurringPeriod: varchar("recurring_period"), // monthly, weekly, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Financial goals
export const financialGoals = pgTable("financial_goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0"),
  targetDate: date("target_date"),
  category: varchar("category").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").default("info"), // info, warning, success, error
  read: boolean("read").default(false),
  actionUrl: varchar("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Calculator history
export const calculatorHistory = pgTable("calculator_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  calculatorType: varchar("calculator_type").notNull(),
  inputs: jsonb("inputs").notNull(),
  results: jsonb("results").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  progress: one(userProgress),
  lessons: many(userLessons),
  quizAttempts: many(quizAttempts),
  tasks: many(tasks),
  transactions: many(transactions),
  goals: many(financialGoals),
  notifications: many(notifications),
  calculatorHistory: many(calculatorHistory),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
}));

export const learningModulesRelations = relations(learningModules, ({ many }) => ({
  userLessons: many(userLessons),
}));

export const userLessonsRelations = relations(userLessons, ({ one }) => ({
  user: one(users, {
    fields: [userLessons.userId],
    references: [users.id],
  }),
  module: one(learningModules, {
    fields: [userLessons.moduleId],
    references: [learningModules.id],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(quizQuestions),
  attempts: many(quizAttempts),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const financialGoalsRelations = relations(financialGoals, ({ one }) => ({
  user: one(users, {
    fields: [financialGoals.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const calculatorHistoryRelations = relations(calculatorHistory, ({ one }) => ({
  user: one(users, {
    fields: [calculatorHistory.userId],
    references: [users.id],
  }),
}));

// Schema exports for forms
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).partial();

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertGoalSchema = createInsertSchema(financialGoals).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertCalculatorHistorySchema = createInsertSchema(calculatorHistory).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type LearningModule = typeof learningModules.$inferSelect;
export type UserLesson = typeof userLessons.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type FinancialGoal = typeof financialGoals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Notification = typeof notifications.$inferSelect;
export type CalculatorHistory = typeof calculatorHistory.$inferSelect;
export type InsertCalculatorHistory = z.infer<typeof insertCalculatorHistorySchema>;
