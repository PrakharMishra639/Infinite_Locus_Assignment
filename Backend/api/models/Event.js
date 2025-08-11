import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    min: [Date.now, 'Event date must be in the future']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  // 🆕 Track current number of registrations for quick capacity checks
  registeredCount: {
    type: Number,
    default: 0
  }
}, { collection: "a0_events", timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export { Event };
