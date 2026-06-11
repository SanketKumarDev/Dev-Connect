import { useState, useEffect } from "react";
import { getFeed, getSuggestions, followUser } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import PostCard from "../components/posts/PostCard";
import CreatePost from "../components/posts/CreatePost";
import toast from "react-hot-toast";
import "./FeedPage.css";

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadFeed();
    loadSuggestions();
  }, []);

  const loadFeed = async (p = 1) => {
    try {
      const res = await getFeed(p);
      if (p === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts((prev) => [...prev, ...res.data.posts]);
      }
      setHasMore(p < res.data.pages);
    } catch {
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const res = await getSuggestions();
      setSuggestions(res.data);
    } catch {}
  };

  const handleFollow = async (id) => {
    try {
      await followUser(id);
      setSuggestions((prev) => prev.filter((u) => u._id !== id));
      toast.success("Followed!");
    } catch {
      toast.error("Failed");
    }
  };

  const handlePostCreated = (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handlePostDeleted = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadFeed(next);
  };

  return (
    <div className="feed-layout">
      {/* Left: Profile Card */}
      <aside className="feed-sidebar left-sidebar">
        <div className="profile-card card">
          <div className="profile-banner" />
          <img
            src={user?.profilePicture}
            alt={user?.name}
            className="avatar profile-avatar"
          />
          <div className="profile-info">
            <Link to={`/profile/${user?.username}`}>
              <h3>{user?.name}</h3>
            </Link>
            <p className="profile-handle">@{user?.username}</p>
            {user?.bio && <p className="profile-bio">{user.bio}</p>}
          </div>
          <div className="profile-stats">
            <div className="stat">
              <span>{user?.following?.length || 0}</span>
              <small>Following</small>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span>{user?.followers?.length || 0}</span>
              <small>Followers</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Center: Feed */}
      <main className="feed-main">
        <CreatePost onPostCreated={handlePostCreated} />

        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <div className="empty-feed card">
            <p>🌱 No posts yet. Follow some developers or create your first post!</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
            ))}
            {hasMore && (
              <button className="btn btn-outline load-more" onClick={loadMore}>
                Load more
              </button>
            )}
          </>
        )}
      </main>

      {/* Right: Suggestions */}
      {suggestions.length > 0 && (
        <aside className="feed-sidebar right-sidebar">
          <div className="suggestions card">
            <h4 className="suggestions-title">Developers to follow</h4>
            {suggestions.map((u) => (
              <div key={u._id} className="suggestion-item">
                <Link to={`/profile/${u.username}`} className="suggestion-user">
                  <img
                    src={u.profilePicture}
                    alt={u.name}
                    className="avatar"
                    style={{ width: 36, height: 36 }}
                  />
                  <div>
                    <p className="sug-name">{u.name}</p>
                    <p className="sug-handle">@{u.username}</p>
                  </div>
                </Link>
                <button
                  className="btn btn-outline sug-follow"
                  onClick={() => handleFollow(u._id)}
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
