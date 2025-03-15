const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for team messages
  },
  text: {
    type: String,
    required: true
  },
  chatType: {
    type: String,
    enum: ['team', 'user'], // 'team' for team chat, 'user' for private chat
    required: true
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
