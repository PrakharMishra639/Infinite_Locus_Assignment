// models/Registration.js
import mongoose from 'mongoose';

const registrationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, { collection :"a0_registrations", timestamps: true });

const Registration = mongoose.model('Registration', registrationSchema);
export { Registration };