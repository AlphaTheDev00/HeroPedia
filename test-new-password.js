import mongoose from 'mongoose';

// Test MongoDB connection with new password
const testConnection = async () => {
  try {
    // New connection string with updated password
    const mongoUri = 'mongodb+srv://yasthedev:plICxhKxfBXXEYZM@heropedia.odwlic5.mongodb.net/HeroPEdia-DB?retryWrites=true&w=majority&appName=HeroPedia';
    
    console.log('Attempting to connect to MongoDB with new password...');
    
    // Connection options
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };
    
    await mongoose.connect(mongoUri, options);
    console.log('MongoDB connection successful! The new password works.');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Full error details:', error);
  } finally {
    process.exit(0);
  }
};

testConnection();
