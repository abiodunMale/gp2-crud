const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        visibility: { type: String }, //positions
        targetAudience: { type: String }, // assembly
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model('Announcement', AnnouncementSchema);
