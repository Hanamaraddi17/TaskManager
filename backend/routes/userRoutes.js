const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middlewares.js");
const { getProfile,getAllUsers} = require("../controllers/userControllers.js");


// Routes beginning with
router.get("/profile", verifyAccessToken, getProfile);
router.get('/users', getAllUsers); 

module.exports = router;