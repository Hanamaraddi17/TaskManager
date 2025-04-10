const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

app.use(express.json());
app.use(cors());

// ✅ MongoDB connection
const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/taskmanager";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => {
  if (err) throw err;
  console.log("✅ MongoDB connected...");
});

// ✅ Route imports
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/employees", employeeRoutes);

// ✅ Hardcoded admin login route
app.post('/api/admin-login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    return res.status(200).json({ message: 'Admin login successful', isAdmin: true });
  } else {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../frontend/build/index.html")));
}

// ✅ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Backend is running on port ${port}`);
});
