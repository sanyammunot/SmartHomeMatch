const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['customer', 'agency'], required: true },
  // Common fields
  firstName: String,
  lastName: String,
  phone: String,
  // Customer-specific
  address: String,
  budgetRange: { low: Number, high: Number },
  needs: [{
    type: { type: String, enum: ['security', 'lighting', 'climate', 'entertainment'] },
    priority: Number
  }],
  // Agency-specific
  agencyName: String,
  YearsOfExperience: Number,
  services: [{
    type: { type: String, enum: ['security', 'lighting', 'climate', 'entertainment'] }
  }],
  reviews: [{
    rating: Number,
    comment: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);