import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Try to connect to MongoDB
const connectDB = async () => {
  try {
    const connectionString = 'mongodb+srv://yasthedev:yiSNXYziQEfeVbde@heropedia.odwlic5.mongodb.net/?retryWrites=true&w=majority&appName=HeroPedia';
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Full error:', error);
  } finally {
    process.exit(0);
  }
};

connectDB();
