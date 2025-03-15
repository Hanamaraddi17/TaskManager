const User = require('../models/User');
const Message = require("../models/message");

// Get team chat messages
exports.getTeamMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatType: 'team' }).populate('sender', 'name');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get private messages between users
exports.getUserMessages = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id; // Assume req.user injected from auth middleware

  console.log(`📥 API Call: Fetching messages between user [${currentUserId}] and user [${userId}]`);

  try {
    const messages = await Message.find({
      chatType: 'user',
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
      .populate('sender', 'name')
      .populate('receiver', 'name');

    console.log(`✅ Found ${messages.length} messages between user [${currentUserId}] and user [${userId}]`);
    console.log(messages);
    res.json(messages);
  } catch (error) {
    console.error(`❌ Error fetching messages between user [${currentUserId}] and user [${userId}]:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

// Send a message (team or private)
exports.sendMessage = async (req, res) => {
  const { text, chatType, receiverId } = req.body;
  const senderId = req.user.id;
  try {
    const message = new Message({
      sender: senderId,
      text,
      chatType,
      receiver: chatType === 'user' ? receiverId : null
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
