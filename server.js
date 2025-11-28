require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const { initSocket } = require('./notifications/socket');

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/admin', require('./routes/admin'));

// Health check endpoint
app.get('/', (req, res) => {
  res.send("LMS backend running");
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log("Server started on port", PORT)
);

// Initialize Socket.io
initSocket(server);
