import mongoose from 'mongoose';
import { Quiz } from '@shared/schema';

const quizSchema = new mongoose.Schema<Quiz>({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true, enum: ['budgeting', 'savings', 'investing', 'fraud', 'privacy', 'taxes'] },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  duration: { type: Number, required: true },
  points: { type: Number, default: 0 },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct: { type: Number, required: true },
    explanation: { type: String },
  }],
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const QuizModel = mongoose.model('Quiz', quizSchema);