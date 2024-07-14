const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.sendResponse(400, "Username already exists", []);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.sendResponse(201, "User registered", user);
  } catch (err) {
    res.sendResponse(500, "Server error", []);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.sendResponse(400, "Invalid credentials", []);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.sendResponse(400, "Invalid credentials", []);
    }
    if (!user.isApproved) {
      return res.sendResponse(403, `${user.username} is not approved`, user._id);
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.sendResponse(200, "Login successful", {username: user.username, userId:user.id, token: token});
  } catch (err) {
    res.sendResponse(500, "Server error", []);
  }
};

exports.approveUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.sendResponse(403, 'Access denied', [])
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!user) {
      return res.sendResponse(404, "User not found", []);
    }
    res.sendResponse(200, "User approved", {username: user.username, user });
  } catch (err) {
    res.sendResponse(500, "Server error", []);
  }
};
