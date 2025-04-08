import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Add connection options to handle MongoDB Atlas connectivity
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };
    
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_DB_URI, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('Full error details:', error);
    // Don't exit the process in production, just log the error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
