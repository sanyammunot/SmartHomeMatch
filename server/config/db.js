const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); // No options needed for MongoDB Driver v4+
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };