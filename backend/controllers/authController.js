const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc Register new user using mobile number
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, mobile, password } = req.body;

    // Name + Mobile + Password required
    if (!name || !mobile || !password) {
      return res.status(400).json({
        message: "Please enter name, mobile number and password",
      });
    }

    const cleanMobile = String(mobile).replace(/\D/g, "");

    // Validate Indian 10-digit mobile number
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit mobile number",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check duplicate mobile number
    const userExists = await User.findOne({
      mobile: cleanMobile,
    });

    if (userExists) {
      return res.status(400).json({
        message: "Mobile number already registered",
      });
    }

    // Create user WITHOUT email
    const user = await User.create({
      name: name.trim(),
      mobile: cleanMobile,
      password,
      role: "user",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Mobile number already registered",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Login user with mobile number
// Existing admin email login remains supported
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { mobile, identifier, email, password } = req.body;

    // Supports:
    // New app -> mobile
    // Previous app -> identifier
    // Existing admin -> email
    const loginValue = String(
      mobile || identifier || email || ""
    ).trim();

    if (!loginValue || !password) {
      return res.status(400).json({
        message: "Please enter mobile number and password",
      });
    }

    let user;

    // Keep existing ADMIN email login working
    if (loginValue.includes("@")) {
      user = await User.findOne({
        email: loginValue.toLowerCase(),
        role: "admin",
      });
    } else {
      const cleanMobile = loginValue.replace(/\D/g, "");

      if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
        return res.status(400).json({
          message: "Please enter a valid 10-digit mobile number",
        });
      }

      user = await User.findOne({
        mobile: cleanMobile,
      });
    }

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid mobile number or password",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile || "",
      email: user.email || "",
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Get logged in user's profile
// @route GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "purchasedNotices",
      "title category isPremium"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};