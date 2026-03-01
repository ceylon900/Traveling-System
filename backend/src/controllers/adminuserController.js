const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ accountType: { $ne: "admin" } }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User account suspended successfully" });
  } catch (err) {
    res.status(500).json({ message: "Suspend failed", error: err.message });
  }
};