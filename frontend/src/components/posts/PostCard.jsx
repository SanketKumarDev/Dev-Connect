import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { FiHeart, FiMessageCircle, FiTrash2, FiSend } from "react-icons/fi";
import { likePost, addComment, deletePost } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./PostCard.css";

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLike = async () => {
    try {
      const res = await likePost(post._id);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch {
      toast.error("Failed to like post");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await addComment(post._id, commentText);
      setComments((prev) => [...prev, res.data]);
      setCommentText("");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(post._id);
      onDelete(post._id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="post-card card fade-in">
      {/* Header */}
      <div className="post-header">
        <Link to={`/profile/${post.user.username}`} className="post-user">
          <img
            src={post.user.profilePicture}
            alt={post.user.name}
            className="avatar"
            style={{ width: 40, height: 40 }}
          />
          <div>
            <p className="post-username">{post.user.name}</p>
            <p className="post-handle">
              @{post.user.username} · {format(post.createdAt)}
            </p>
          </div>
        </Link>
        {user?._id === post.user._id && (
          <button className="btn btn-ghost delete-btn" onClick={handleDelete}>
            <FiTrash2 />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="post-content">{post.content}</p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      {/* Image */}
      {post.image && (
        <img src={post.image} alt="post" className="post-image" />
      )}

      {/* Actions */}
      <div className="post-actions">
        <button
          className={`action-btn ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <FiHeart className={liked ? "filled-heart" : ""} />
          <span>{likes}</span>
        </button>
        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <FiMessageCircle />
          <span>{comments.length}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="comments-section">
          {comments.map((c) => (
            <div key={c._id} className="comment">
              <Link to={`/profile/${c.user.username}`}>
                <img
                  src={c.user.profilePicture}
                  alt={c.user.name}
                  className="avatar"
                  style={{ width: 28, height: 28 }}
                />
              </Link>
              <div className="comment-body">
                <span className="comment-name">{c.user.name}</span>
                <span className="comment-text">{c.text}</span>
              </div>
            </div>
          ))}
          <form className="comment-form" onSubmit={handleComment}>
            <input
              className="input-field"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
