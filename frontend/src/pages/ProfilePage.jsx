import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserByUsername, getUserPosts, followUser } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/posts/PostCard";
import { FiGithub, FiLinkedin, FiGlobe, FiUserPlus, FiUserCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [profileRes, postsRes] = await Promise.all([
        getUserByUsername(username),
        getUserByUsername(username).then((r) => getUserPosts(r.data._id)),
      ]);
      setProfile(profileRes.data);
      setPosts(postsRes.data);
      setFollowing(profileRes.data.followers.includes(currentUser?._id));
    } catch {
      toast.error("Profile not found");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await followUser(profile._id);
      setFollowing(res.data.following);
      setProfile((prev) => ({
        ...prev,
        followers: res.data.following
          ? [...prev.followers, currentUser._id]
          : prev.followers.filter((id) => id !== currentUser._id),
      }));
    } catch {
      toast.error("Failed");
    }
  };

  const handlePostDeleted = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!profile) return <div className="profile-error">Profile not found</div>;

  const isOwnProfile = currentUser?._id === profile._id;

  return (
    <div className="profile-page">
      {/* Banner */}
      <div className="profile-header-banner" />

      <div className="profile-page-inner">
        <div className="profile-top">
          <img
            src={profile.profilePicture}
            alt={profile.name}
            className="avatar profile-page-avatar"
          />
          <div className="profile-top-info">
            <div className="profile-name-row">
              <h1>{profile.name}</h1>
              <p className="profile-page-handle">@{profile.username}</p>
            </div>
            {profile.bio && <p className="profile-page-bio">{profile.bio}</p>}

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <div className="skills-row">
                {profile.skills.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            )}

            {/* Social links */}
            <div className="social-links">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="social-link">
                  <FiGithub /> GitHub
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-link">
                  <FiLinkedin /> LinkedIn
                </a>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="social-link">
                  <FiGlobe /> Website
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="profile-actions">
            {!isOwnProfile && (
              <button
                className={`btn ${following ? "btn-outline" : "btn-primary"}`}
                onClick={handleFollow}
              >
                {following ? <><FiUserCheck /> Following</> : <><FiUserPlus /> Follow</>}
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats-bar card">
          <div className="stat-item">
            <span>{posts.length}</span><small>Posts</small>
          </div>
          <div className="stat-item">
            <span>{profile.followers.length}</span><small>Followers</small>
          </div>
          <div className="stat-item">
            <span>{profile.following.length}</span><small>Following</small>
          </div>
        </div>

        {/* Posts */}
        <div className="profile-posts">
          {posts.length === 0 ? (
            <div className="empty-feed card">
              <p>No posts yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
