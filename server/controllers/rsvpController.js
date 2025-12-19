const Event = require('../models/Event');

// @desc    RSVP to an event
// @route   POST /api/rsvp/:eventId
// @access  Private
const rsvpToEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    // Atomic update
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        attendees: { $ne: userId },
        $expr: { $lt: ['$currentAttendees', '$capacity'] }
      },
      {
        $push: { attendees: userId },
        $inc: { currentAttendees: 1 }
      },
      { new: true }
    );

    if (!event) {
      const checkEvent = await Event.findById(eventId);
      if (!checkEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      if (checkEvent.attendees.includes(userId)) {
        return res.status(400).json({ message: 'You have already RSVPed to this event' });
      }
      
      if (checkEvent.currentAttendees >= checkEvent.capacity) {
        return res.status(400).json({ message: 'Event is fully booked' });
      }
      
      return res.status(400).json({ message: 'RSVP failed' });
    }

    res.status(200).json({ message: 'RSVP successful', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel RSVP
// @route   DELETE /api/rsvp/:eventId
// @access  Private
const cancelRSVP = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        attendees: userId
      },
      {
        $pull: { attendees: userId },
        $inc: { currentAttendees: -1 }
      },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found or you have not RSVPed' });
    }

    res.status(200).json({ message: 'RSVP cancelled successfully', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my RSVPs
// @route   GET /api/rsvp/my-rsvps
// @access  Private
const getMyRSVPs = async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.user.id }).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if user RSVPed to specific event
// @route   GET /api/rsvp/check/:eventId
// @access  Private
const checkRSVP = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isRsvped = event.attendees.includes(req.user.id);
    res.status(200).json({ hasRSVP: isRsvped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  rsvpToEvent,
  cancelRSVP,
  getMyRSVPs,
  checkRSVP
};
