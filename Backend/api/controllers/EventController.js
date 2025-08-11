import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';

// Student registers for approved event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.isApproved) return res.status(403).json({ message: 'Event is not approved yet' });

    const already = await Registration.findOne({ event: eventId, user: userId });
    if (already) return res.status(400).json({ message: 'Already registered' });

    await Registration.create({
      event: eventId,
      user: userId,
      status: 'pending'
    });

    event.registeredCount += 1;
    await event.save();

    res.json({ message: 'Registration request submitted, awaiting organizer approval' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Organizer approves/rejects a registration
export const approveRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { approve } = req.body; // true = approve, false = reject
    const organizerId = req.user.id;

    const registration = await Registration.findById(registrationId).populate('event');
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    // Ensure this organizer owns the event
    if (registration.event.organizer.toString() !== organizerId) {
      return res.status(403).json({ message: 'Not authorized to approve this registration' });
    }

    registration.status = approve ? 'approved' : 'rejected';
    await registration.save();

    res.json({ message: `Registration ${approve ? 'approved' : 'rejected'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Organizer creates event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, bannerUrl } = req.body;
    const userId = req.user.id;

    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      organizer: userId,
      bannerUrl,
      isApproved: false // waiting admin approval
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin approves/rejects event
export const setEventApproval = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { approve } = req.body;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { isApproved: approve },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student fetch → only approved events
export const getEventsForStudent = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: true }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Organizer fetch → all their events + registrations
export const getEventsForOrganizer = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ organizer: userId }).lean();

    for (let ev of events) {
      ev.registrations = await Registration.find({ event: ev._id })
        .populate('user', 'name email status');
    }

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin fetch → all events + registrations
export const getEventsForAdmin = async (req, res) => {
  try {
    const events = await Event.find({})
      .populate('organizer', 'name email')
      .lean();

    for (let ev of events) {
      ev.registrations = await Registration.find({ event: ev._id })
        .populate('user', 'name email status');
    }

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
