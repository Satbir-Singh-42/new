import mongoose from 'mongoose';
import { Task } from '@shared/schema';

const taskSchema = new mongoose.Schema<Task>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
}, {
  timestamps: true,
});

export const TaskModel = mongoose.model('Task', taskSchema);