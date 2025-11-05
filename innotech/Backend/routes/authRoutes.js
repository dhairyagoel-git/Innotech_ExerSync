const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Profile = require("../models/profile");
const protect = require("../middleware/authMiddleware"); // ✅ import middleware
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  const newUserProfile = new Profile({
    name,
    email,
    coins: 50,
    xp: 0,
    workouts: [],
  });
  await newUser.save();
  await newUserProfile.save();
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    message: "Signup successful",
    token,
    user: { name, email },
  });
});

//  LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email & Password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  const profile = await Profile.findOne({ email });
  res.json({
    message: "Login successful",
    token,
    user: {
      name: user.name,
      email: user.email,
      coins: profile.coins,
      xp: profile.xp,
      workouts: profile.workouts,
    },
  });
});

//  PROTECTED ROUTE — Add here
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  console.log(user);
  res.json({
    message: "Profile fetched successfully",
    user,
  });
});

router.post("/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential)
    return res.status(400).json({ error: "No credential provided" });

  try {
    // Verify token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: "261268913069-cvesjicpg1g6j8iugttelnigeeopl8f0.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ email });
    let profile = await Profile.findOne({ email });

    if (!user) {
      user = new User({ name, email, picture });
      await user.save();
      console.log("New user created:", email);
    } else {
      const changed = user.name !== name || user.picture !== picture;
      if (changed) {
        user.name = name;
        user.picture = picture;
        await user.save();
      }
      console.log("Existing user login:", email);
    }

    if (!profile) {
      profile = new Profile({
        name,
        email,
        coins: 50,
        xp: 0,
        workouts: [],
      });
      await profile.save();
      console.log("New Profile created.");
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        coins: profile.coins,
        xp: profile.xp,
        workouts: profile.workouts,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(400).json({ error: "Invalid Google token" });
  }
});

module.exports = router;