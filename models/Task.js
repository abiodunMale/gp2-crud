const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: { type: String },
      dueDate: { type: Date },
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
      status: { type: String, enum: ['Pending', 'In Progress', 'Completed'] },
      priority: { type: String, enum: ['High', 'Medium', 'Low'] },

    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model('Task', TaskSchema);


