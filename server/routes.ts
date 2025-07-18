import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import { authenticate, optionalAuth, hashPassword, comparePassword, generateToken, type AuthenticatedRequest } from "./auth";
import { connectDB, getMongodUri } from "./db";
import { z } from "zod";
import {
  insertTaskSchema,
  insertTransactionSchema,
  insertGoalSchema,
  insertCalculatorHistorySchema,
  insertQuizAttemptSchema,
  insertUserSchema,
  updateUserSchema,
  loginSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB
  await connectDB();

  // Session configuration
  const sessionSecret = process.env.SESSION_SECRET || "change-this-secret-in-production";
  const MemoryStoreSession = MemoryStore(session);
  
  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: false, // Set to false for development
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }));

  // AI Chat routes
  app.post('/api/ai/chat/session', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const { title } = req.body;
      const userId = req.userId!;
      
      // Create new chat session (stored in memory for now)
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      res.json({
        sessionId,
        title: title || 'New Chat',
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error creating chat session:', error);
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  app.post('/api/ai/chat/message', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const { sessionId, message } = req.body;
      const userId = req.userId!;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          message: "AI service is not configured. Please provide an OpenAI API key." 
        });
      }

      // Import AI service
      const { aiService } = await import('./ai-service');
      
      // Get user context for better responses
      const user = await storage.getUserById(userId);
      const userContext = {
        dailyGoal: user?.dailyGoal,
        knowledgeLevel: user?.knowledgeLevel,
        ageGroup: user?.ageGroup,
        recentLessons: 0, // Would be calculated from user progress
        activeGoals: 0 // Would be calculated from active goals
      };

      // Generate AI response
      const response = await aiService.generateResponse([
        { role: 'user', content: message }
      ], userContext);

      res.json({
        sessionId,
        response,
        timestamp: new Date()
      });
    } catch (error: any) {
      console.error('Error processing chat message:', error);
      res.status(500).json({ 
        message: error.message || "Failed to process message" 
      });
    }
  });

  app.get('/api/ai/financial-advice', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.userId!;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          message: "AI service is not configured" 
        });
      }

      // Get user's financial data
      const [transactions, goals] = await Promise.all([
        storage.getTransactions(userId),
        storage.getFinancialGoals(userId)
      ]);

      const transactionsSummary = transactions.reduce((acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        if (t.type === 'expense') acc.expenses += t.amount;
        return acc;
      }, { income: 0, expenses: 0 });

      const userFinancialData = {
        income: transactionsSummary.income,
        expenses: transactionsSummary.expenses,
        savings: transactionsSummary.income - transactionsSummary.expenses,
        goals: goals,
        debts: 0 // Would be calculated from debt transactions
      };

      const { aiService } = await import('./ai-service');
      const advice = await aiService.generateFinancialAdvice(userFinancialData);

      res.json({
        advice,
        financialSummary: userFinancialData,
        generatedAt: new Date()
      });
    } catch (error: any) {
      console.error('Error generating financial advice:', error);
      res.status(500).json({ 
        message: error.message || "Failed to generate financial advice" 
      });
    }
  });

  app.get('/api/ai/budget-suggestions', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.userId!;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          message: "AI service is not configured" 
        });
      }

      const transactions = await storage.getTransactions(userId);
      const { aiService } = await import('./ai-service');
      const suggestions = await aiService.generateBudgetSuggestions(transactions);

      res.json({
        suggestions,
        basedOnTransactions: transactions.length,
        generatedAt: new Date()
      });
    } catch (error: any) {
      console.error('Error generating budget suggestions:', error);
      res.status(500).json({ 
        message: error.message || "Failed to generate budget suggestions" 
      });
    }
  });

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate token
      const token = generateToken(user._id.toString());
      
      // Store token in session
      (req.session as any).token = token;
      (req.session as any).userId = user._id.toString();

      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          language: user.language,
          onboardingCompleted: user.onboardingCompleted,
        },
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = generateToken(user._id.toString());
      
      // Store token in session
      (req.session as any).token = token;
      (req.session as any).userId = user._id.toString();

      res.json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          language: user.language,
          onboardingCompleted: user.onboardingCompleted,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/user', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user;
      res.json({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        onboardingCompleted: user.onboardingCompleted,
        dailyGoal: user.dailyGoal,
        knowledgeLevel: user.knowledgeLevel,
        ageGroup: user.ageGroup,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Onboarding routes
  app.patch('/api/onboarding', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const updates = updateUserSchema.parse(req.body);
      
      const user = await storage.updateUser(userId, {
        ...updates,
        onboardingCompleted: true,
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error updating onboarding:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update onboarding" });
    }
  });

  // Progress routes
  app.get('/api/progress', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Learning module routes
  app.get('/api/modules', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const { category } = req.query;
      const modules = category 
        ? await storage.getLearningModulesByCategory(category as string)
        : await storage.getLearningModules();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.get('/api/lessons', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const lessons = await storage.getUserLessons(userId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.patch('/api/lessons/:moduleId', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const { moduleId } = req.params;
      const updates = req.body;
      
      const lesson = await storage.updateUserLesson(userId, moduleId, updates);
      res.json(lesson);
    } catch (error) {
      console.error("Error updating lesson:", error);
      res.status(500).json({ message: "Failed to update lesson" });
    }
  });

  // Quiz routes
  app.get('/api/quizzes', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const quizzes = await storage.getQuizzes();
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  app.get('/api/quizzes/:id', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const quiz = await storage.getQuizById(id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      const questions = await storage.getQuizQuestions(id);
      res.json({ ...quiz.toObject(), questions });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  app.post('/api/quiz-attempts', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const attemptData = insertQuizAttemptSchema.parse(req.body);
      
      const attempt = await storage.createQuizAttempt({
        ...attemptData,
        userId,
      });
      
      res.status(201).json(attempt);
    } catch (error) {
      console.error("Error creating quiz attempt:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quiz attempt" });
    }
  });

  app.get('/api/quiz-attempts', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const attempts = await storage.getQuizAttempts(userId);
      res.json(attempts);
    } catch (error) {
      console.error("Error fetching quiz attempts:", error);
      res.status(500).json({ message: "Failed to fetch quiz attempts" });
    }
  });

  // Task routes
  app.get('/api/tasks', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const taskData = insertTaskSchema.parse(req.body);
  // Convert date string to Date object if provided
  if (taskData.dueDate) {
    taskData.dueDate = new Date(taskData.dueDate);
  }
      
      const task = await storage.createTask(userId, taskData);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch('/api/tasks/:id', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const task = await storage.updateTask(id, updates);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete('/api/tasks/:id', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTask(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Transaction routes
  app.get('/api/transactions', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/transactions', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const transactionData = insertTransactionSchema.parse(req.body);
    // Convert date string to Date object if provided
    if (transactionData.date) {
      transactionData.date = new Date(transactionData.date);
    }
      
      const transaction = await storage.createTransaction(userId, transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.patch('/api/transactions/:id', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const transaction = await storage.updateTransaction(id, updates);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });

  app.delete('/api/transactions/:id', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTransaction(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });

  // Financial goals routes
  app.get('/api/goals', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const goals = await storage.getFinancialGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post('/api/goals', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const goalData = insertGoalSchema.parse(req.body);
      
      const goal = await storage.createFinancialGoal(userId, goalData);
      res.status(201).json(goal);
    } catch (error) {
      console.error("Error creating goal:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  app.patch('/api/goals/:id', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const goal = await storage.updateFinancialGoal(id, updates);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      res.json(goal);
    } catch (error) {
      console.error("Error updating goal:", error);
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  app.delete('/api/goals/:id', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteFinancialGoal(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      res.json({ message: "Goal deleted successfully" });
    } catch (error) {
      console.error("Error deleting goal:", error);
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // Notifications routes
  app.get('/api/notifications', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post('/api/notifications', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const notification = await storage.createNotification(userId, req.body);
      res.status(201).json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.patch('/api/notifications/:id/read', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.markNotificationAsRead(id);
      
      if (!updated) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Calculator history routes
  app.get('/api/calculator-history', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const history = await storage.getCalculatorHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching calculator history:", error);
      res.status(500).json({ message: "Failed to fetch calculator history" });
    }
  });

  app.post('/api/calculator-history', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const historyData = insertCalculatorHistorySchema.parse(req.body);
      
      const history = await storage.createCalculatorHistory(userId, historyData);
      res.status(201).json(history);
    } catch (error) {
      console.error("Error creating calculator history:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create calculator history" });
    }
  });

  // User profile routes
  app.get('/api/user/profile', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put('/api/user/profile', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const userData = updateUserSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(userId, userData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(updatedUser);
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: 'Invalid input',
          errors: error.errors 
        });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Onboarding API endpoints
  app.patch('/api/onboarding', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user._id.toString();
      const updateData = req.body;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(updatedUser);
    } catch (error: any) {
      console.error('Error updating onboarding:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  const server = createServer(app);
  return server;
}