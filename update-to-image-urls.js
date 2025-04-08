import mongoose from 'mongoose';
import User from './models/userModel.js';
import Post from './models/postModel.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
async function connectDB() {
  try {
    // Use the MongoDB connection string directly
    const mongoUri = 'mongodb+srv://yasthedev:plICxhKxfBXXEYZM@heropedia.odwlic5.mongodb.net/HeroPEdia-DB?retryWrites=true&w=majority&appName=HeroPedia';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully for updating data');
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    return false;
  }
}

// Superhero data with image URLs
const superheroes = [
  {
    title: "Superman: The Man of Steel",
    imageUrl: "https://i.imgur.com/SLaLCoa.jpg" // Superman image URL
  },
  {
    title: "Batman: The Dark Knight",
    imageUrl: "https://i.imgur.com/Vc1ZVdj.jpg" // Batman image URL
  },
  {
    title: "Spider-Man: With Great Power",
    imageUrl: "https://i.imgur.com/1rqxxQR.jpg" // Spider-Man image URL
  },
  {
    title: "Wonder Woman: Amazon Princess",
    imageUrl: "https://i.imgur.com/jNPYqLY.jpg" // Wonder Woman image URL
  },
  {
    title: "Iron Man: Genius, Billionaire, Philanthropist",
    imageUrl: "https://i.imgur.com/GcFZooN.jpg" // Iron Man image URL
  }
];

// Update the database to use image URLs instead of base64
async function updateDatabase() {
  try {
    // Connect to the database
    const connected = await connectDB();
    if (!connected) return;

    // Update the view-post.ejs template to handle both base64 and URLs
    console.log('Updating posts to use image URLs...');

    // Find all posts
    const posts = await Post.find({});
    console.log(`Found ${posts.length} posts to update`);

    // Update each post with a URL instead of base64
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      
      // Find matching superhero data
      const hero = superheroes.find(h => post.title.includes(h.title.split(':')[0]));
      
      if (hero) {
        console.log(`Updating post: ${post.title} with image URL`);
        
        // Update the post with the image URL
        post.image = hero.imageUrl;
        await post.save();
        console.log(`Updated post: ${post.title}`);
      } else {
        console.log(`No matching hero found for post: ${post.title}`);
      }
    }

    console.log('Database update completed successfully!');
    console.log(`
    -----------------------------------------------
    HeroPedia has been updated to use image URLs!
    -----------------------------------------------
    You can now log in with:
    Email: hero@example.com
    Password: password123
    -----------------------------------------------
    `);

  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Run the update function
updateDatabase();
