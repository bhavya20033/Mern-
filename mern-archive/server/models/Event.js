const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    time: {
      type: String,
      required: [true, 'Please add a time'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please add capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      default: 'Other',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    currentAttendees: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
