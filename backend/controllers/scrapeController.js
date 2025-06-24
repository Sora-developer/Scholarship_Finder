const { exec } = require('child_process');
const path = require('path');

exports.runScraper = (req, res) => {
  const scraperPath = path.join(__dirname, '../../backend/scrapers/scrape_scholarships.py');

  exec(`python ${scraperPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }
    res.status(200).json({ message: 'Scraping complete', output: stdout });
  });
};
// This function runs the Python scraper script and returns the output or error.
// It uses the exec function from the child_process module to execute the script.