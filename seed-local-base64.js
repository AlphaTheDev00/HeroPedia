import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';
import Post from './models/postModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
async function connectDB() {
  try {
    // Use the MongoDB connection string directly
    const mongoUri = 'mongodb+srv://yasthedev:plICxhKxfBXXEYZM@heropedia.odwlic5.mongodb.net/HeroPEdia-DB?retryWrites=true&w=majority&appName=HeroPedia';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully for seeding data');
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    return false;
  }
}

// Function to create a simple colored image as base64
function createColoredImageBase64(width, height, color) {
  // Create a canvas in memory
  const canvas = {
    width,
    height,
    data: Buffer.alloc(width * height * 4) // 4 bytes per pixel (RGBA)
  };
  
  // Fill the canvas with the specified color
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  for (let i = 0; i < width * height; i++) {
    const offset = i * 4;
    canvas.data[offset] = r;     // R
    canvas.data[offset + 1] = g; // G
    canvas.data[offset + 2] = b; // B
    canvas.data[offset + 3] = 255; // A (fully opaque)
  }
  
  // Convert to base64
  return canvas.data.toString('base64');
}

// Superhero data with colors for generated images
const superheroes = [
  {
    title: "Superman: The Man of Steel",
    slug: "superman-man-of-steel",
    content: `Superman, born Kal-El on the planet Krypton, was sent to Earth as an infant by his parents before their planet's destruction. Raised as Clark Kent by a farming couple in Smallville, Kansas, he discovered his extraordinary abilities as he grew up.

Superman possesses superhuman strength, speed, and durability. He can fly, has heat vision, freeze breath, and X-ray vision. Beyond his powers, Superman represents hope and embodies the ideal that anyone can use their gifts, whatever they may be, to help others and make the world a better place.`,
    color: "#0074D9" // Blue color for Superman
  },
  {
    title: "Batman: The Dark Knight",
    slug: "batman-dark-knight",
    content: `Batman, the alter ego of billionaire Bruce Wayne, was born from tragedy when young Bruce witnessed his parents' murder in Gotham City's Crime Alley. Vowing to rid his city of the evil that took his parents, Bruce spent years training his mind and body to perfection.

Unlike many superheroes, Batman possesses no superhuman abilities. Instead, he relies on his genius intellect, detective skills, martial arts expertise, and an arsenal of advanced technology and gadgets. His Batsuit provides protection and intimidation, while his vehicles like the Batmobile give him mobility and tactical advantages.`,
    color: "#111111" // Black color for Batman
  },
  {
    title: "Spider-Man: With Great Power",
    slug: "spider-man-great-power",
    content: `Spider-Man's story began when high school student Peter Parker was bitten by a radioactive spider during a science demonstration. The bite gave him superhuman strength, speed, agility, and the ability to cling to walls. He also developed a "spider-sense" that warns him of imminent danger.

After initially using his powers for personal gain, Peter learned a tragic lesson about responsibility when his inaction led to his Uncle Ben's death. Inspired by his uncle's belief that "with great power comes great responsibility," Peter dedicated himself to fighting crime as Spider-Man.`,
    color: "#FF4136" // Red color for Spider-Man
  },
  {
    title: "Wonder Woman: Amazon Princess",
    slug: "wonder-woman-amazon-princess",
    content: `Wonder Woman, also known as Diana Prince, is a founding member of the Justice League and one of the world's greatest heroes. Born to Queen Hippolyta on the hidden island of Themyscira, Diana was raised among the immortal Amazons, women warriors created by the Greek gods.

Blessed by the gods with incredible strength, speed, and durability, Diana also wields magical artifacts including her indestructible bracelets, the Lasso of Truth, and a tiara that serves as a projectile weapon. Her combat skills, honed over centuries of training, make her one of the most formidable warriors on Earth.`,
    color: "#B10DC9" // Purple color for Wonder Woman
  },
  {
    title: "Iron Man: Genius, Billionaire, Philanthropist",
    slug: "iron-man-genius",
    content: `Tony Stark, the man behind the Iron Man armor, represents the pinnacle of human achievement through technology and innovation. Born into wealth as the son of industrialist Howard Stark, Tony inherited Stark Industries and transformed it into the world's leading weapons manufacturer before a life-changing experience redirected his genius.

After being captured by terrorists and sustaining a severe chest injury, Tony built the first Iron Man suit as a means of escape. The experience changed him profoundly, leading him to redirect Stark Industries away from weapons development and toward clean energy and advanced technology for the greater good.`,
    color: "#FF851B" // Orange/Gold color for Iron Man
  }
];

// Seed the database with test user and superhero posts
async function seedDatabase() {
  try {
    // Connect to the database
    const connected = await connectDB();
    if (!connected) return;

    // Clear existing data (optional)
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await User.create({
      name: 'Hero Enthusiast',
      email: 'hero@example.com',
      password: hashedPassword,
      createdAt: new Date()
    });
    console.log(`Created test user: ${testUser.name} (${testUser.email})`);

    // Create posts with generated base64 images
    for (const hero of superheroes) {
      // Generate a colored image as base64
      console.log(`Generating image for ${hero.title}...`);
      const base64Image = createColoredImageBase64(800, 600, hero.color);
      
      // Create the post with base64-encoded image
      const post = await Post.create({
        title: hero.title,
        slug: hero.slug,
        content: hero.content,
        image: base64Image, // Store the base64-encoded image
        createdAt: new Date(),
        user: testUser._id
      });

      // Add post to user's posts array
      testUser.posts.push(post._id);
      console.log(`Created post: ${post.title}`);
    }

    // Save the updated user
    await testUser.save();
    console.log('Added posts to user');

    console.log('Database seeding completed successfully!');
    console.log(`
    -----------------------------------------------
    HeroPedia has been seeded with base64-encoded images!
    -----------------------------------------------
    You can now log in with:
    Email: hero@example.com
    Password: password123
    -----------------------------------------------
    `);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase();
