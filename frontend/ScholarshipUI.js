import { useState, useEffect } from "react";

export default function ScholarshipFinderApp() {
  const [profile, setProfile] = useState({ course: "", gpa: "", location: "", interests: "" });
  const [submitted, setSubmitted] = useState(false);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("deadline");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [selected, setSelected] = useState(null);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch("http://localhost:5000/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...profile,
        gpa: parseFloat(profile.gpa),
        interests: profile.interests.split(",").map((i) => i.trim()),
      }),
    });
    setSubmitted(true);
  };

useEffect(() => {
  const fetchScholarships = async () => {
    const res = await fetch("http://localhost:5000/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...profile,
        gpa: parseFloat(profile.gpa),
        interests: profile.interests.split(",").map((i) => i.trim()),
      }),
    });
    const data = await res.json();
    setScholarships(data.matched);
    setLoading(false);
  };

  if (submitted) fetchScholarships();
}, [submitted]);

  const filteredScholarships = scholarships
    .filter((s) => s.name.toLowerCase().includes(filterKeyword.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === "amount") return b.amount.localeCompare(a.amount);
      if (sortBy === "score") return parseFloat(b.matchScore) - parseFloat(a.matchScore);
      return 0;
    });

  return (
    <div className="container">
      <header>
        <h1>Scholarship Finder Tool</h1>
        <p>Get personalized scholarships by filling in your details below.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <input name="course" placeholder="Course of Study" onChange={handleChange} required />
        <input name="gpa" placeholder="GPA" type="number" step="0.01" onChange={handleChange} required />
        <input name="location" placeholder="Location" onChange={handleChange} required />
        <input name="interests" placeholder="Interests (comma-separated)" onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? "Finding Scholarships..." : "Find Scholarships"}
        </button>
      </form>

      {scholarships.length > 0 && (
        <section>
          <h2 className="text-center">Matched Scholarships</h2>

          <div className="controls">
            <input
              placeholder="Search by keyword"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="deadline">Sort by Deadline</option>
              <option value="amount">Sort by Amount</option>
              <option value="score">Sort by Match Score</option>
            </select>
          </div>

          <div className="scholarship-grid">
            {filteredScholarships.map((sch, index) => (
              <div
                key={index}
                className="scholarship-card"
                onClick={() => setSelected(sch)}
              >
                <h3>{sch.name}</h3>
                <p>Amount: {sch.amount}</p>
                <p>Deadline: {sch.deadline}</p>
                <p><strong>Match Score: </strong>{sch.matchScore}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {selected && (
        <div className="dialog-backdrop" onClick={() => setSelected(null)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selected.name}</h3>
            <p><strong>Amount:</strong> {selected.amount}</p>
            <p><strong>Deadline:</strong> {selected.deadline}</p>
            <p><strong>Eligibility:</strong> {selected.eligibility || "Not specified"}</p>
            <a href={selected.link} target="_blank" rel="noopener noreferrer">Apply Now</a>
          </div>
        </div>
      )}

      <footer>
        © 2025 Scholarship Finder. Built with ❤️ for IITG.
      </footer>
    </div>
  );
}