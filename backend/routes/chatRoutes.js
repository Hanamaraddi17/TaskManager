const express = require('express');
const { getTeamMessages, getUserMessages, sendMessage } = require('../controllers/chatController');
const { verifyAccessToken } = require("../middlewares.js");

const router = express.Router();

// Get all team messages
router.get('/team', verifyAccessToken, getTeamMessages);

// Get private chat messages with a specific user
router.get('/user/:userId', verifyAccessToken, getUserMessages);

// Send a message (team or private)
router.post('/send', verifyAccessToken, sendMessage);

module.exports = router;
