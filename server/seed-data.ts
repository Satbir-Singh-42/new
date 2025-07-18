import {
  type LearningModule,
  type Quiz,
  type QuizQuestion,
  type Notification,
  type ILearningModule,
  type IQuiz,
  type IQuizQuestion,
} from "@shared/schema";
import { LearningModuleModel, QuizModel } from "./models";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingModules = await LearningModuleModel.countDocuments();
    if (existingModules > 0) {
      console.log("Seed data already exists, skipping...");
      return;
    }

    console.log("Seeding database with initial data...");

    // Create learning modules
    const modules: Partial<ILearningModule>[] = [
      {
        title: "OTP Scam Explainer",
        description: "Learn how to identify and protect yourself from OTP-based scams",
        category: "fraud",
        difficulty: "beginner",
        estimatedTime: 15,
        content: {
          sections: [
            {
              title: "What is an OTP Scam?",
              content: "OTP (One-Time Password) scams trick people into sharing their verification codes with fraudsters...",
            },
            {
              title: "How to Identify OTP Scams",
              content: "Never share your OTP with anyone, even if they claim to be from your bank...",
            }
          ]
        },
        isActive: true,
      },
      {
        title: "Budgeting Basics",
        description: "Master the fundamentals of personal budgeting",
        category: "budgeting",
        difficulty: "beginner",
        estimatedTime: 20,
        content: {
          sections: [
            {
              title: "Creating Your First Budget",
              content: "A budget is a plan for your money that helps you track income and expenses...",
            }
          ]
        },
        isActive: true,
      },
      {
        title: "Investment Fundamentals",
        description: "Learn the basics of investing and building wealth",
        category: "savings",
        difficulty: "intermediate",
        estimatedTime: 30,
        content: {
          sections: [
            {
              title: "Types of Investments",
              content: "Understand different investment options including stocks, bonds, and mutual funds...",
            }
          ]
        },
        isActive: true,
      },
      {
        title: "Data Privacy Protection",
        description: "Protect your personal information online",
        category: "privacy",
        difficulty: "beginner",
        estimatedTime: 25,
        content: {
          sections: [
            {
              title: "Personal Data Security",
              content: "Learn how to protect your personal information from cyber threats...",
            }
          ]
        },
        isActive: true,
      }
    ];

    const createdModules = await LearningModuleModel.insertMany(modules);
    console.log(`Created ${createdModules.length} learning modules`);

    // Create quizzes
    const quizzes: Partial<IQuiz>[] = [
      {
        title: "Financial Literacy Basics",
        description: "Test your knowledge of basic financial concepts",
        category: "general",
        difficulty: "beginner",
        totalQuestions: 3,
        timeLimit: 300,
        passingScore: 70,
        isActive: true,
      },
      {
        title: "Fraud Prevention Quiz",
        description: "Assess your ability to identify and prevent fraud",
        category: "fraud",
        difficulty: "intermediate",
        totalQuestions: 2,
        timeLimit: 180,
        passingScore: 80,
        isActive: true,
      }
    ];

    const createdQuizzes = await QuizModel.insertMany(quizzes);
    console.log(`Created ${createdQuizzes.length} quizzes`);

    // Create quiz questions
    const questions: Partial<IQuizQuestion>[] = [
      // Financial Literacy Basics Quiz
      {
        quizId: createdQuizzes[0]._id.toString(),
        question: "What is the recommended percentage of income to save each month?",
        options: ["5%", "10%", "20%", "30%"],
        correctAnswer: 2,
        explanation: "Financial experts recommend saving at least 20% of your income.",
        points: 10,
        orderIndex: 1,
      },
      {
        quizId: createdQuizzes[0]._id.toString(),
        question: "Which of the following is considered a good debt?",
        options: ["Credit card debt", "Car loan", "Student loan", "Personal loan"],
        correctAnswer: 2,
        explanation: "Student loans are considered good debt because they're an investment in your future earning potential.",
        points: 10,
        orderIndex: 2,
      },
      {
        quizId: createdQuizzes[0]._id.toString(),
        question: "What is compound interest?",
        options: [
          "Interest paid only on the principal amount",
          "Interest calculated on both principal and previously earned interest",
          "Interest that changes every month",
          "Interest paid by banks to customers"
        ],
        correctAnswer: 1,
        explanation: "Compound interest is interest calculated on the initial principal plus all previously earned interest.",
        points: 10,
        orderIndex: 3,
      },
      // Fraud Prevention Quiz
      {
        quizId: createdQuizzes[1]._id.toString(),
        question: "What should you do if someone asks for your OTP over the phone?",
        options: [
          "Share it if they know your name",
          "Ask for their employee ID first",
          "Never share it with anyone",
          "Only share the first 3 digits"
        ],
        correctAnswer: 2,
        explanation: "Never share your OTP with anyone. Banks and legitimate companies will never ask for your OTP.",
        points: 15,
        orderIndex: 1,
      },
      {
        quizId: createdQuizzes[1]._id.toString(),
        question: "Which of these is a red flag for a phishing email?",
        options: [
          "Urgent language demanding immediate action",
          "Professional company logo",
          "Proper grammar and spelling",
          "Clear subject line"
        ],
        correctAnswer: 0,
        explanation: "Phishing emails often use urgent language to pressure you into acting quickly without thinking.",
        points: 15,
        orderIndex: 2,
      }
    ];

    const createdQuestions = await QuizQuestion.insertMany(questions);
    console.log(`Created ${createdQuestions.length} quiz questions`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}