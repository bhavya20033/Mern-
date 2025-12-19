const express = require('express');
const router = express.Router();
const {
  rsvpToEvent,
  cancelRSVP,
  getMyRSVPs,
  checkRSVP
} = require('../controllers/rsvpController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:eventId', protect, rsvpToEvent);
router.delete('/:eventId', protect, cancelRSVP);
router.get('/my-rsvps', protect, getMyRSVPs);
router.get('/check/:eventId', protect, checkRSVP);

module.exports = router;
