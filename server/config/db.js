const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://sanyammunot03:Shree98794@cluster0.5ky8tma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"); // No options needed for MongoDB Driver v4+
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };