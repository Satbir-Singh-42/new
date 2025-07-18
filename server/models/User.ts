import mongoose from 'mongoose';
import { User } from '@shared/schema';

const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  language: { type: String, enum: ['en', 'hi', 'pa'], default: 'en' },
  onboardingCompleted: { type: Boolean, default: false, required: false },
  knowledgeLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  dailyGoal: { type: Number, min: 5, max: 120 },
  ageGroup: { type: String, enum: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'] },
  totalPoints: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export const UserModel = mongoose.model('User', userSchema);