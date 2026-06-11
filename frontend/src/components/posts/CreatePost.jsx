import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createPost } from "../../utils/api";
import { FiImage, FiTag, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import "./CreatePost.css";

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showExtras, setShowExtras] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return toast.error("Write something first!");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (tags.trim()) {
        formData.append("tags", JSON.stringify(tags.split(",").map((t) => t.trim()).filter(Boolean)));
      }
      if (image) formData.append("image", image);

      const res = await createPost(formData);
      onPostCreated(res.data);
      setContent("");
      setTags("");
      setImage(null);
      setPreview(null);
      setShowExtras(false);
      toast.success("Post shared!");
    } catch {
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post card">
      <div className="create-post-header">
        <img
          src={user?.profilePicture}
          alt={user?.name}
          className="avatar"
          style={{ width: 40, height: 40, flexShrink: 0 }}
        />
        <textarea
          className="post-textarea"
          placeholder="What's on your mind? Share an update, project, or idea..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          onFocus={() => setShowExtras(true)}
        />
      </div>

      {showExtras && (
        <div className="create-post-extras fade-in">
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="preview" />
              <button className="remove-image" onClick={() => { setImage(null); setPreview(null); }}>✕</button>
            </div>
          )}
          <div className="tags-input-row">
            <FiTag className="tags-icon" />
            <input
              className="input-field"
              placeholder="Tags: react, nodejs, javascript (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="create-post-footer">
            <label className="btn btn-ghost image-upload-btn">
              <FiImage /> Photo
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
            >
              <FiSend /> {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
