const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: { type: String },
      dateTime: { type: Date, required: true },
      location: { type: String },
      organizer: { type: String },
      status: { type: String, enum: ['Upcoming', 'In Progress', 'Completed'] },
      eventType: { type: String }
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model('Event', EventSchema);
