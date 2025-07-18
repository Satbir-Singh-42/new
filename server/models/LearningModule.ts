import mongoose from 'mongoose';
import { LearningModule } from '@shared/schema';

const learningModuleSchema = new mongoose.Schema<LearningModule>({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true, enum: ['budgeting', 'savings', 'investing', 'fraud', 'privacy', 'taxes'] },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  duration: { type: Number, required: true },
  points: { type: Number, default: 0 },
  content: { type: mongoose.Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const LearningModuleModel = mongoose.model('LearningModule', learningModuleSchema);