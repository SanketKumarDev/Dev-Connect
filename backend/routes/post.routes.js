const express = require("express");
const router = express.Router();
const {
  createPost,
  getFeed,
  getAllPosts,
  getUserPosts,
  likePost,
  addComment,
  deletePost,
  upload,
} = require("../controllers/post.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/feed", protect, getFeed);
router.get("/", protect, getAllPosts);
router.post("/", protect, upload.single("image"), createPost);
router.get("/user/:userId", getUserPosts);
router.put("/:id/like", protect, likePost);
router.post("/:id/comment", protect, addComment);
router.delete("/:id", protect, deletePost);

module.exports = router;
