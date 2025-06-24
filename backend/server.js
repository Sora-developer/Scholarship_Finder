const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const profileRoutes = require('./routes/profile');
const matchroutes = require('./routes/match');
const bodyParser = require('body-parser');
const scrapeRoutes = require('./routes/scrape');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the frontend
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

app.use('/api/profiles', profileRoutes);
app.use('/api/match', matchroutes);
app.use('/api/scrape', scrapeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const { exec } = require('child_process');
exec('python ./scrapers/scrape_scholarships.py', (err, stdout, stderr) => {
  if (err) console.error(stderr);
  else console.log('🔁 Scraper ran on startup');
});
