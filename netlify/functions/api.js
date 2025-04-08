import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import serverless from 'serverless-http';

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// Simple route to test if the function is working
app.get('/', async (req, res) => {
  try {
    // Log environment info (without sensitive details)
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI exists:', !!process.env.MONGO_DB_URI);
    
    // Attempt to connect to MongoDB
    const mongoUri = process.env.MONGO_DB_URI;
    if (!mongoUri) {
      return res.status(500).json({ error: 'MongoDB URI is not defined in environment variables' });
    }
    
    // Connect with options
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };
    
    await mongoose.connect(mongoUri, options);
    
    return res.status(200).json({
      message: 'MongoDB connection successful',
      status: 'online'
    });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({
      error: 'Failed to connect to MongoDB',
      message: error.message
    });
  }
});

// Basic middleware for JSON parsing
app.use(express.json());

// Add a diagnostic route to check environment variables
app.get('/env-check', (req, res) => {
  // Only return non-sensitive environment variables
  return res.json({
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL,
    MONGO_DB_URI_EXISTS: !!process.env.MONGO_DB_URI
  });
});

// Add a fallback route
app.use('*', (req, res) => {
  return res.status(200).json({
    message: 'HeroPedia API is running in diagnostic mode',
    path: req.originalUrl
  });
});

// Export the serverless handler
export const handler = serverless(app);
