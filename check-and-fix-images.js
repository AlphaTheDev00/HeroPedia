import mongoose from 'mongoose';
import User from './models/userModel.js';
import Post from './models/postModel.js';

// Connect to MongoDB
async function connectDB() {
  try {
    // Use the MongoDB connection string directly
    const mongoUri = 'mongodb+srv://yasthedev:plICxhKxfBXXEYZM@heropedia.odwlic5.mongodb.net/HeroPEdia-DB?retryWrites=true&w=majority&appName=HeroPedia';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    return false;
  }
}

// Superhero data with image URLs
const superheroes = [
  {
    title: "Superman",
    imageUrl: "https://i.imgur.com/SLaLCoa.jpg" // Superman image URL
  },
  {
    title: "Batman",
    imageUrl: "https://i.imgur.com/Vc1ZVdj.jpg" // Batman image URL
  },
  {
    title: "Spider-Man",
    imageUrl: "https://i.imgur.com/1rqxxQR.jpg" // Spider-Man image URL
  },
  {
    title: "Wonder Woman",
    imageUrl: "https://i.imgur.com/jNPYqLY.jpg" // Wonder Woman image URL
  },
  {
    title: "Iron Man",
    imageUrl: "https://i.imgur.com/GcFZooN.jpg" // Iron Man image URL
  }
];

// Check and fix the database
async function checkAndFixDatabase() {
  try {
    // Connect to the database
    const connected = await connectDB();
    if (!connected) return;

    // Find all posts
    const posts = await Post.find({});
    console.log(`Found ${posts.length} posts in the database`);

    // Check and log each post's image field
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      console.log(`Post ${i+1}: ${post.title}`);
      console.log(`Image starts with: ${post.image.substring(0, 30)}...`);
      
      // Find matching superhero data
      const hero = superheroes.find(h => post.title.includes(h.title));
      
      if (hero) {
        console.log(`Updating post: ${post.title} with direct image URL`);
        
        // Update the post with the direct image URL
        post.image = hero.imageUrl;
        await post.save();
        console.log(`Updated post: ${post.title} with URL: ${hero.imageUrl}`);
      } else {
        console.log(`No matching hero found for post: ${post.title}`);
      }
    }

    console.log('Database check and fix completed successfully!');

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Run the check and fix function
checkAndFixDatabase();
