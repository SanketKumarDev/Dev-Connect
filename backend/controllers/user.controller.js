const User = require("../models/User");
const { cloudinary, upload } = require("../config/cloudinary");

// @desc   Get user by username
// @route  GET /api/users/:username
// @access Public
const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, githubUrl, linkedinUrl, website } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (skills) updateData.skills = JSON.parse(skills);
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (website !== undefined) updateData.website = website;
    if (req.file) updateData.profilePicture = req.file.path;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Follow / Unfollow user
// @route  PUT /api/users/:id/follow
// @access Private
const followUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.user._id },
      });
      res.json({ message: "Unfollowed successfully", following: false });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $push: { followers: req.user._id },
      });
      res.json({ message: "Followed successfully", following: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Search users
// @route  GET /api/users/search?q=query
// @access Private
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ],
    })
      .select("name username profilePicture bio")
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get suggested users (people not followed)
// @route  GET /api/users/suggestions
// @access Private
const getSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const users = await User.find({
      _id: {
        $nin: [...currentUser.following, currentUser._id],
      },
    })
      .select("name username profilePicture bio")
      .limit(5);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserByUsername,
  updateProfile,
  followUser,
  searchUsers,
  getSuggestions,
  upload,
};
