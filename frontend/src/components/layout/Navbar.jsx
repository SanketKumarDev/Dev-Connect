import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { searchUsers } from "../../utils/api";
import {
  FiHome, FiCompass, FiUser, FiLogOut, FiSearch, FiSettings
} from "react-icons/fi";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length < 2) return setResults([]);
    setSearching(true);
    try {
      const res = await searchUsers(val);
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/feed" className="navbar-logo">
          <span className="logo-icon">&lt;/&gt;</span>
          <span className="logo-text">DevConnect</span>
        </Link>

        {/* Search */}
        <div className="navbar-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search developers..."
            value={query}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setResults([]), 200)}
          />
          {results.length > 0 && (
            <div className="search-dropdown">
              {results.map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u.username}`}
                  className="search-result"
                  onClick={() => { setResults([]); setQuery(""); }}
                >
                  <img src={u.profilePicture} alt={u.name} className="avatar" style={{ width: 32, height: 32 }} />
                  <div>
                    <p className="result-name">{u.name}</p>
                    <p className="result-username">@{u.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Nav links */}
        <div className="navbar-links">
          <Link to="/feed" className={`nav-link ${isActive("/feed") ? "active" : ""}`}>
            <FiHome /> <span>Feed</span>
          </Link>
          <Link to="/explore" className={`nav-link ${isActive("/explore") ? "active" : ""}`}>
            <FiCompass /> <span>Explore</span>
          </Link>
          <Link to={`/profile/${user?.username}`} className={`nav-link ${location.pathname.includes("/profile") ? "active" : ""}`}>
            <FiUser /> <span>Profile</span>
          </Link>
          <Link to="/settings" className={`nav-link ${isActive("/settings") ? "active" : ""}`}>
            <FiSettings /> <span>Settings</span>
          </Link>
          <button className="nav-link logout-btn" onClick={handleLogout}>
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
