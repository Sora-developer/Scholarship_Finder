const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  course: String,
  gpa: Number,
  location: String,
  interests: [String],
});

module.exports = mongoose.model('Profile', profileSchema);
// This code defines a Mongoose schema for a user profile in a scholarship matching application.