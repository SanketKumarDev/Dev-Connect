const express = require("express");
const router = express.Router();
const {
  getUserByUsername,
  updateProfile,
  followUser,
  searchUsers,
  getSuggestions,
  upload,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/search", protect, searchUsers);
router.get("/suggestions", protect, getSuggestions);
router.get("/:username", getUserByUsername);
router.put("/profile", protect, upload.single("profilePicture"), updateProfile);
router.put("/:id/follow", protect, followUser);

module.exports = router;
