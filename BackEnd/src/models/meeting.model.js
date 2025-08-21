const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  host:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // teacher/admin
  roomName: { type: String, required: true, unique: true }, // e.g. GuzoStudy-<course>-<rand>
  title: { type: String, required: true }, // e.g. "Week 3: Functions"
  description: { type: String },

  // schedule
  scheduledStart: { type: Date, required: true },
  scheduledEnd:   { type: Date }, // optional

  // runtime
  status: { type: String, enum: ['scheduled', 'live', 'ended', 'canceled'], default: 'scheduled' },
  startedAt: { type: Date },
  endedAt:   { type: Date },

  // access policy
  allowGuests: { type: Boolean, default: false }, // if true, non-enrolled can join

  
  settings: {
    lobby: { type: Boolean, default: false },            // waiting room (self-host feature)
    muteOnStart: { type: Boolean, default: true },
    disableScreenShare: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
