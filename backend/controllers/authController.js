const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc Register new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // New registrations require all 4 fields
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.replace(/\D/g, "");

    // Basic 10-digit Indian mobile validation
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit mobile number",
      });
    }

    // Check duplicate email OR mobile
    const userExists = await User.findOne({
      $or: [
        { email: cleanEmail },
        { mobile: cleanMobile },
      ],
    });

    if (userExists) {
      if (userExists.email === cleanEmail) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }

      return res.status(400).json({
        message: "Mobile number already registered",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      password,
      role: "user",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    // Duplicate index protection
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email or mobile number already registered",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Login using email OR mobile number
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, identifier, password } = req.body;

    // Supports new frontend "identifier"
    // and old frontend "email" for backward compatibility
    const loginValue = String(identifier || email || "").trim();

    if (!loginValue || !password) {
      return res.status(400).json({
        message: "Please enter email/mobile number and password",
      });
    }

    let user;

    // If input looks like an email
    if (loginValue.includes("@")) {
      user = await User.findOne({
        email: loginValue.toLowerCase(),
      });
    } else {
      // Otherwise treat it as mobile number
      const cleanMobile = loginValue.replace(/\D/g, "");

      user = await User.findOne({
        mobile: cleanMobile,
      });
    }

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid email/mobile number or password",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || "",
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