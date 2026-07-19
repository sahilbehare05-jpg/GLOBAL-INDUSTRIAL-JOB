const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

// Save Expo push notification token
router.post("/push-token", protect, async (req, res) => {
  try {
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({
        message: "Push token is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.pushToken = pushToken;
    await user.save();

    res.json({
      message: "Push token saved successfully",
    });
  } catch (error) {
    console.error("PUSH TOKEN SAVE ERROR:", error);

    res.status(500).json({
      message: "Unable to save push token",
    });
  }
});

module.exports = router;