require('dotenv').config();
const express = require('express');
const {connectDB} = require('./config/db');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));