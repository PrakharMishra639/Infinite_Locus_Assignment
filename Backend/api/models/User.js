// models/User.js
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['STUDENT', 'ORGANIZER', 'ADMIN'],
    default: 'STUDENT'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection :"a0_users", timestamps: true });

const User = mongoose.model('User', userSchema);
export {User} ;