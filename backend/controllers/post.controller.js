const Post = require("../models/Post");
const { upload } = require("../config/cloudinary");

// @desc   Create post
// @route  POST /api/posts
// @access Private
const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;
    if (!content) return res.status(400).json({ message: "Content required" });

    const postData = {
      user: req.user._id,
      content,
      tags: tags ? JSON.parse(tags) : [],
    };
    if (req.file) postData.image = req.file.path;

    const post = await Post.create(postData);
    const populated = await post.populate("user", "name username profilePicture");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get feed (posts from followed users + own)
// @route  GET /api/posts/feed
// @access Private
const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const following = req.user.following;
    const feedUsers = [...following, req.user._id];

    const posts = await Post.find({ user: { $in: feedUsers } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name username profilePicture")
      .populate("comments.user", "name username profilePicture");

    const total = await Post.countDocuments({ user: { $in: feedUsers } });

    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all posts (explore)
// @route  GET /api/posts
// @access Private
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name username profilePicture")
      .populate("comments.user", "name username profilePicture");

    const total = await Post.countDocuments();
    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get posts by user
// @route  GET /api/posts/user/:userId
// @access Public
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("user", "name username profilePicture")
      .populate("comments.user", "name username profilePicture");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Like / Unlike post
// @route  PUT /api/posts/:id/like
// @access Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !isLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Add comment
// @route  POST /api/posts/:id/comment
// @access Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user._id, text });
    await post.save();

    const updated = await Post.findById(post._id)
      .populate("user", "name username profilePicture")
      .populate("comments.user", "name username profilePicture");

    res.status(201).json(updated.comments[updated.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete post
// @route  DELETE /api/posts/:id
// @access Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getFeed,
  getAllPosts,
  getUserPosts,
  likePost,
  addComment,
  deletePost,
  upload,
};
