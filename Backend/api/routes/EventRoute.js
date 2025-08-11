import express from 'express';
import {
  registerForEvent,
  createEvent,
  setEventApproval,
  getEventsForStudent,
  getEventsForOrganizer,
  getEventsForAdmin
} from '../controllers/EventController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

/* ===== STUDENT ===== */
// View approved events
router.get('/events', protect, authorize('student'), getEventsForStudent);

// Register for an event
router.post('/events/:eventId/register', protect, authorize('student'), registerForEvent);

/* ===== ORGANIZER ===== */
// Create event
router.post('/createEvent', protect, authorize('organizer'), createEvent);

// View own events + registrations
router.get('/events/organizer', protect, authorize('organizer'), getEventsForOrganizer);

/* ===== ADMIN ===== */
// Approve/reject event
router.patch('/events/:eventId/approval', protect, authorize('admin'), setEventApproval);

// View all events + registrations
router.get('/events/admin', protect, authorize('admin'), getEventsForAdmin);

export default router;
