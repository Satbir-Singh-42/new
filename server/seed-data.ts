import {
  type LearningModule,
  type Quiz,
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
    const modules = [
      {
        title: "OTP Scam Explainer",
        description: "Learn how to identify and protect yourself from OTP-based scams",
        category: "fraud",
        difficulty: "easy",
        duration: 15,
        points: 50,
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
        difficulty: "easy",
        duration: 20,
        points: 75,
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
        difficulty: "medium",
        duration: 30,
        points: 100,
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
        difficulty: "easy",
        duration: 25,
        points: 60,
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
    const quizzes = [
      {
        title: "Financial Literacy Basics",
        description: "Test your knowledge of basic financial concepts",
        category: "budgeting",
        difficulty: "easy",
        duration: 5,
        points: 100,
        questions: [
          {
            question: "What is the recommended percentage of income to save each month?",
            options: ["5%", "10%", "20%", "30%"],
            correct: 2,
            explanation: "Financial experts recommend saving at least 20% of your income.",
          },
          {
            question: "Which of the following is considered a good debt?",
            options: ["Credit card debt", "Car loan", "Student loan", "Personal loan"],
            correct: 2,
            explanation: "Student loans are considered good debt because they're an investment in your future earning potential.",
          },
          {
            question: "What is compound interest?",
            options: [
              "Interest paid only on the principal amount",
              "Interest calculated on both principal and previously earned interest",
              "Interest that changes every month",
              "Interest paid by banks to customers"
            ],
            correct: 1,
            explanation: "Compound interest is interest calculated on the initial principal plus all previously earned interest.",
          }
        ],
        isActive: true,
      },
      {
        title: "Fraud Prevention Quiz",
        description: "Assess your ability to identify and prevent fraud",
        category: "fraud",
        difficulty: "medium",
        duration: 3,
        points: 150,
        questions: [
          {
            question: "What should you do if you receive an OTP request from your bank?",
            options: [
              "Share it immediately",
              "Never share OTP with anyone",
              "Call the number they provided",
              "Send it via SMS"
            ],
            correct: 1,
            explanation: "Banks never ask for OTP over phone or SMS. Never share your OTP with anyone.",
          },
          {
            question: "Which is a common sign of a phishing email?",
            options: [
              "Official logo",
              "Urgent action required",
              "Proper grammar",
              "Company letterhead"
            ],
            correct: 1,
            explanation: "Phishing emails often create false urgency to pressure victims into quick action.",
          }
        ],
        isActive: true,
      }
    ];

    const createdQuizzes = await QuizModel.insertMany(quizzes);
    console.log(`Created ${createdQuizzes.length} quizzes`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}