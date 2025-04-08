import mongoose from 'mongoose';

// Try to connect to MongoDB with explicit database name
const connectDB = async () => {
  try {
    const connectionString = 'mongodb+srv://yasthedev:yiSNXYziQEfeVbde@heropedia.odwlic5.mongodb.net/HeroPEdia-DB?retryWrites=true&w=majority&appName=HeroPedia';
    console.log('Attempting to connect to MongoDB with database name...');
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
