const express = require('express');
const router = express.Router();
const Scholarship = require('../models/scholarshipModel');
const { matchScholarships } = require('../controllers/matchController');
// This route handles POST requests to match scholarships based on user profile criteria

// router.post('/', async (req, res) => {
//   const { course, gpa, location, interests } = req.body;
//   try {
//     const scholarships = await Scholarship.find({
//       $or: [
//         { course }, 
//         { location }, 
//         { gpa: { $lte: gpa } }, 
//         { interests: { $in: interests } }
//       ]
//     });
//     res.status(200).json({ matched: scholarships });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.post('/', matchScholarships);

module.exports = router;
// This code defines a route for matching scholarships based on user profile criteria in a scholarship matching application.