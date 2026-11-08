import { useEffect, useState } from "react";
import "./App.css";


function App() {
  const [username, setUsername] = useState("");
  const [searchedUsername, setSearchedUsername] = useState("torvalds");
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    setSearchedUsername(username.trim());
    setUsername("");
  }

  useEffect(() => {
    async function fetchGitHubData() {
      setLoading(true);
      setError("");
      setProfile(null);
      setRepos([]);

      try {
        const profileUrl = `https://api.github.com/users/${encodeURIComponent(searchedUsername)}`;

        const reposUrl = `https://api.github.com/users/${encodeURIComponent(searchedUsername)}/repos?sort=updated&per_page=5`;

        const [profileResponse, reposResponse] = await Promise.all([
          fetch(profileUrl),
          fetch(reposUrl),
        ]);

        if (!profileResponse.ok) {
          if (profileResponse.status === 404) {
            throw new Error("GitHub user not found.");
          }
          throw new Error("Unable to fetch GitHub profile");
        }

        if (!reposResponse.ok) {
          throw new Error("Unable to fetch repositories");
        }

        const profileData = await profileResponse.json();
        const reposData = await reposResponse.json();

        setProfile(profileData);
        setRepos(reposData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGitHubData();
  }, [searchedUsername]);

  
return (
  <div className="app-container">
    {/* Background effects */}
    <div className="grid-background"></div>

    {/* Navbar */}
    <nav className="navbar">
      <h2 className="logo">
        GITHUB<span>_</span>FINDER
      </h2>
      <span className="system-status">
        ● SYSTEM ONLINE
      </span>
    </nav>

    {/* Main content */}
    <main className="main-content">
      <section className="hero">
        <p className="eyebrow">// DEVELOPER DATABASE</p>

        <h1>
          FIND YOUR <span>DEVELOPER</span>
        </h1>

        <p className="subtitle">
          Explore GitHub profiles and discover repositories.
        </p>

        <form className="search-form" onSubmit={handleSubmit}>
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button type="submit">SEARCH ↗</button>
        </form>
      </section>

      {loading && (
        <p className="loading-message">
          INITIALIZING SCAN...
        </p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {profile && !loading && (
        <section className="profile-section">
          <div className="profile-card">
            <div className="profile-top">
              <img
                src={profile.avatar_url}
                alt="GitHub profile"
                className="avatar"
              />

              <div className="profile-info">
                <p className="eyebrow">// USER IDENTIFIED</p>

                <h2>{profile.name || profile.login}</h2>

                <p className="username">@{profile.login}</p>

                <p className="bio">
                  {profile.bio || "No bio available"}
                </p>

                <p className="location">
                  LOCATION: {profile.location || "UNKNOWN"}
                </p>

                <a
                  href={profile.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="profile-link"
                >
                  VIEW GITHUB PROFILE ↗
                </a>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <span>FOLLOWERS</span>
                <h3>{profile.followers}</h3>
              </div>

              <div className="stat-box">
                <span>FOLLOWING</span>
                <h3>{profile.following}</h3>
              </div>

              <div className="stat-box">
                <span>REPOSITORIES</span>
                <h3>{profile.public_repos}</h3>
              </div>
            </div>
          </div>

          <div className="repositories-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">// DATA EXPLORER</p>
                <h2>Latest <span>Repositories</span></h2>
              </div>

              <span className="repo-count">
                {repos.length} FOUND
              </span>
            </div>

            {repos.length === 0 ? (
              <p className="empty-message">
                NO PUBLIC REPOSITORIES FOUND.
              </p>
            ) : (
              <div className="repo-grid">
                {repos.map((repo) => (
                  <div className="repo-card" key={repo.id}>
                    <div className="repo-header">
                      <span className="repo-symbol">⌘</span>
                      <span className="repo-stars">
                        ★ {repo.stargazers_count}
                      </span>
                    </div>

                    <h3>{repo.name}</h3>

                    <p className="repo-description">
                      {repo.description ||
                        "No description available."}
                    </p>

                    <div className="repo-footer">
                      <span>
                        ◈ {repo.language || "Unknown"}
                      </span>

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        EXPLORE ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </main>

    <footer className="footer">
      GITHUB FINDER // CYBER INTERFACE v1.0
    </footer>
  </div>
);

}

export default App;
