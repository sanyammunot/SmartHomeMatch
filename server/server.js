require('dotenv').config();
const express = require('express');
const {connectDB} = require('./config/db');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

const app = express();

// Middleware
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://smart-home-match.vercel.app'],
//   credentials: true
// }));
// app.use(express.json());
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://smart-home-match-p7rj.vercel.app',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Vary', 'Origin'); // Important for multiple origins
  
  // Immediately respond to OPTIONS requests
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  
  next();
});
app.use(express.json());
// Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));