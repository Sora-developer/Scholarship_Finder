const express = require('express');
const router = express.Router();
const Profile = require('../models/profilemodel');

router.post('/', async (req, res) => {
  try {
    const profile = new Profile(req.body);
    await profile.save();
    res.status(200).json({ message: 'Profile saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
