const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
  matchScore: Number  // AI-generated score (0-100)
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);