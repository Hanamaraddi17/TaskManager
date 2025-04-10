const User = require("../models/User");
const Task = require("../models/Task");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json(user);
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  const data = await Promise.all(users.map(async (u) => {
    const taskCount = await Task.countDocuments({ user: u._id });
    return {
      _id: u._id,
      name: u.name,
      email: u.email,
      taskCount,
    };
  }));
  res.json(data);
};
