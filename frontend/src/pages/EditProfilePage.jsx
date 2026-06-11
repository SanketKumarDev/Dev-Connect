import { useState } from "react";
import { updateProfile } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { FiCamera, FiSave } from "react-icons/fi";
import toast from "react-hot-toast";
import "./EditProfilePage.css";

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    skills: user?.skills?.join(", ") || "",
    githubUrl: user?.githubUrl || "",
    linkedinUrl: user?.linkedinUrl || "",
    website: user?.website || "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture || "");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("bio", form.bio);
      formData.append(
        "skills",
        JSON.stringify(form.skills.split(",").map((s) => s.trim()).filter(Boolean))
      );
      formData.append("githubUrl", form.githubUrl);
      formData.append("linkedinUrl", form.linkedinUrl);
      formData.append("website", form.website);
      if (image) formData.append("profilePicture", image);

      const res = await updateProfile(formData);
      updateUser(res.data);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card card">
        <h2 className="edit-title">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="edit-form">
          {/* Avatar upload */}
          <div className="avatar-upload">
            <img
              src={preview}
              alt="Profile"
              className="avatar edit-avatar"
            />
            <label className="avatar-upload-btn">
              <FiCamera />
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio <span className="char-count">({form.bio.length}/200)</span></label>
            <textarea
              className="input-field bio-textarea"
              value={form.bio}
              maxLength={200}
              rows={3}
              placeholder="Tell the world about yourself..."
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input
              className="input-field"
              placeholder="React, Node.js, MongoDB"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub URL</label>
              <input
                className="input-field"
                placeholder="https://github.com/username"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input
                className="input-field"
                placeholder="https://linkedin.com/in/username"
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              className="input-field"
              placeholder="https://yoursite.com"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary save-btn" disabled={loading}>
            <FiSave /> {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
