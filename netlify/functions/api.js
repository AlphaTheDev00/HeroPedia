import express from 'express';
import mongoose from 'mongoose';
import serverless from 'serverless-http';

// Initialize express app
const app = express();

// Basic middleware for JSON parsing
app.use(express.json());

// Simple route to test if the function is working
app.get('/', async (req, res) => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI exists:', !!process.env.MONGO_DB_URI);
    
    // Attempt to connect to MongoDB with the new credentials
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
    console.log('MongoDB connected successfully!');
    
    return res.status(200).json({
      message: 'HeroPedia is back online!',
      status: 'connected',
      mongodb: 'connected'
    });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return res.status(500).json({
      error: 'Failed to connect to MongoDB',
      message: error.message
    });
  }
});

// Add a diagnostic route to check environment variables
app.get('/env-check', (req, res) => {
  return res.json({
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL,
    MONGO_DB_URI_EXISTS: !!process.env.MONGO_DB_URI
  });
});

// Export the serverless handler
export const handler = serverless(app);
