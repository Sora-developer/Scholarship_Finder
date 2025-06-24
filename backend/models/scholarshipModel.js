const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: String,
  amount: String,
  deadline: String, // or Date if pre-parsed
  link: String,
  eligibility: String,
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
// This code defines a Mongoose schema for a scholarship in a scholarship matching application.