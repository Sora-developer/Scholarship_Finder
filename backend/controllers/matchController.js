const Scholarship = require('../models/scholarshipModel');

function calculateMatchScore(scholarship, keywords) {
  const text = `${scholarship.name} ${scholarship.eligibility || ""}`.toLowerCase();
  return keywords.reduce((score, keyword) => text.includes(keyword) ? score + 1 : score, 0);
}

function isUpcoming(deadline) {
  const today = new Date();
  const parsed = new Date(deadline);
  return parsed.toString() !== 'Invalid Date' && parsed >= today;
}

function deadlineWeight(deadline) {
  const today = new Date();
  const parsed = new Date(deadline);
  if (parsed.toString() === 'Invalid Date') return 0;

  const daysLeft = Math.max(1, (parsed - today) / (1000 * 60 * 60 * 24)); // avoid div by zero
  return 1 / daysLeft;  // closer deadlines = higher weight
}

exports.matchScholarships = async (req, res) => {
  console.log("Received match request:", req.body);
  const { course, gpa, location, interests } = req.body;
  const keywords = [...(interests || []), course, location].map(k => k.toLowerCase());

  try {
    const allScholarships = await Scholarship.find({});

    const ranked = allScholarships
      .filter(sch => isUpcoming(sch.deadline))  
      .map(sch => {
        const matchScore = calculateMatchScore(sch, keywords);
        const deadlineBoost = deadlineWeight(sch.deadline);
        const finalScore = matchScore + deadlineBoost;

        return { ...sch._doc, matchScore: finalScore.toFixed(3) };
      })
      .filter(sch => sch.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore); 

    res.status(200).json({ matched: ranked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Matching failed' });
  }
};

// This code defines a function to match scholarships based on user profile criteria in a scholarship matching application.
// It retrieves all scholarships from the database and filters them based on keywords derived from the user's interests, course, and location.