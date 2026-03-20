const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    // Return user data with JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      resumeUrl: user.resumeUrl,
      education: user.education,
      workExperience: user.workExperience,
      skills: user.skills,
      projects: user.projects,
      contact: user.contact,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (Requires JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  console.log(
    "[updateUserProfile] called with body:",
    JSON.stringify(req.body),
  );
  console.log(
    "[updateUserProfile] user from token:",
    req.user?.id || req.user?._id,
  );
  try {
    const {
      name,
      profileImageUrl,
      resumeUrl,
      education,
      workExperience,
      skills,
      projects,
      contact,
    } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name) {
      user.name = name;
    }
    if (profileImageUrl !== undefined) {
      user.profileImageUrl = profileImageUrl;
    }
    if (resumeUrl !== undefined) {
      user.resumeUrl = resumeUrl;
    }
    if (education !== undefined) {
      user.education = education;
    }
    if (workExperience !== undefined) {
      user.workExperience = workExperience;
    }
    if (skills !== undefined) {
      user.skills = skills;
    }
    if (projects !== undefined) {
      user.projects = projects;
    }
    if (contact !== undefined) {
      user.contact = contact;
    }
    await user.save();
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      resumeUrl: user.resumeUrl,
      education: user.education,
      workExperience: user.workExperience,
      skills: user.skills,
      projects: user.projects,
      contact: user.contact,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("[updateUserProfile] ERROR:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
