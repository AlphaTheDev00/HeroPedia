import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Post from './models/postModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to save an image from URL to local file
async function saveImageFromUrl(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const buffer = await response.arrayBuffer();
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`Image saved to ${filepath}`);
    return filename;
  } catch (error) {
    console.error(`Error saving image: ${error.message}`);
    return null;
  }
}

// Superhero data with high-quality images
const superheroes = [
  {
    title: "Superman: The Man of Steel",
    slug: "superman-man-of-steel",
    content: `Superman, born Kal-El on the planet Krypton, was sent to Earth as an infant by his parents before their planet's destruction. Raised as Clark Kent by a farming couple in Smallville, Kansas, he discovered his extraordinary abilities as he grew up.

Superman possesses superhuman strength, speed, and durability. He can fly, has heat vision, freeze breath, and X-ray vision. Beyond his powers, Superman represents hope and embodies the ideal that anyone can use their gifts, whatever they may be, to help others and make the world a better place.

As a member of the Justice League, Superman has saved the Earth countless times from threats both terrestrial and cosmic. Despite his alien origins, his unwavering moral compass and dedication to truth and justice make him one of humanity's greatest champions.`,
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000&auto=format&fit=crop",
    imageName: "superman.jpg"
  },
  {
    title: "Wonder Woman: Amazon Princess",
    slug: "wonder-woman-amazon-princess",
    content: `Wonder Woman, also known as Diana Prince, is a founding member of the Justice League and one of the world's greatest heroes. Born to Queen Hippolyta on the hidden island of Themyscira, Diana was raised among the immortal Amazons, women warriors created by the Greek gods.

Blessed by the gods with incredible strength, speed, and durability, Diana also wields magical artifacts including her indestructible bracelets, the Lasso of Truth, and a tiara that serves as a projectile weapon. Her combat skills, honed over centuries of training, make her one of the most formidable warriors on Earth.

Wonder Woman came to "Man's World" as an ambassador of peace, fighting for justice, love, and equality. Her compassion is as powerful as her strength, and she believes in redemption and the inherent goodness in humanity. As both a warrior and a diplomat, Wonder Woman represents the perfect balance of strength and wisdom.`,
    imageUrl: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?q=80&w=1000&auto=format&fit=crop",
    imageName: "wonder-woman.jpg"
  },
  {
    title: "Batman: The Dark Knight",
    slug: "batman-dark-knight",
    content: `Batman, the alter ego of billionaire Bruce Wayne, was born from tragedy when young Bruce witnessed his parents' murder in Gotham City's Crime Alley. Vowing to rid his city of the evil that took his parents, Bruce spent years training his mind and body to perfection.

Unlike many superheroes, Batman possesses no superhuman abilities. Instead, he relies on his genius intellect, detective skills, martial arts expertise, and an arsenal of advanced technology and gadgets. His Batsuit provides protection and intimidation, while his vehicles like the Batmobile give him mobility and tactical advantages.

Operating from the Batcave beneath Wayne Manor, Batman strikes fear into criminals as he patrols Gotham's streets. Despite his intimidating presence, Batman adheres to a strict moral code, refusing to kill and often working alongside the Gotham City Police Department, particularly Commissioner James Gordon.

Batman's rogues gallery includes some of the most iconic villains in comic history, including the Joker, Catwoman, the Riddler, and the Penguin. As a founding member of the Justice League, Batman provides tactical leadership and a grounded perspective among his superpowered colleagues.`,
    imageUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1000&auto=format&fit=crop",
    imageName: "batman.jpg"
  },
  {
    title: "Spider-Man: With Great Power",
    slug: "spider-man-great-power",
    content: `Spider-Man's story began when high school student Peter Parker was bitten by a radioactive spider during a science demonstration. The bite gave him superhuman strength, speed, agility, and the ability to cling to walls. He also developed a "spider-sense" that warns him of imminent danger.

After initially using his powers for personal gain, Peter learned a tragic lesson about responsibility when his inaction led to his Uncle Ben's death. Inspired by his uncle's belief that "with great power comes great responsibility," Peter dedicated himself to fighting crime as Spider-Man.

Using his scientific genius, Peter created web-shooters that allow him to swing between buildings and capture criminals. His quick wit and humor during battles have become his trademark, often masking the burden of responsibility he carries.

Over the years, Spider-Man has faced numerous villains including the Green Goblin, Doctor Octopus, and Venom. He has been a member of the Avengers and has worked alongside other heroes to protect New York City and the world. Through it all, Peter Parker remains relatable as he balances his superhero duties with everyday challenges like relationships, education, and financial struggles.`,
    imageUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1000&auto=format&fit=crop",
    imageName: "spiderman.jpg"
  },
  {
    title: "Black Panther: Protector of Wakanda",
    slug: "black-panther-wakanda",
    content: `Black Panther is the title held by T'Challa, king of the technologically advanced African nation of Wakanda. The mantle of the Black Panther is passed down through generations of Wakandan royalty, with each holder serving as both the nation's leader and its primary protector.

T'Challa inherited the throne after his father's death and underwent a series of trials to prove his worthiness to become the Black Panther. As part of the ceremony, he consumed the heart-shaped herb, which enhanced his strength, speed, agility, and senses to superhuman levels.

The Black Panther's suit, made from vibranium—a rare metal found almost exclusively in Wakanda—absorbs kinetic energy and can release it as a powerful force. This technology, along with other advanced Wakandan innovations, makes Black Panther one of the most formidable heroes in the world.

As king, T'Challa balances his responsibilities to his people with his duties as a global protector. After centuries of isolation, T'Challa made the historic decision to reveal Wakanda's true nature to the world, offering to share their knowledge and resources for the greater good. This decision marked a new era for both Wakanda and global politics in the superhero world.`,
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=1000&auto=format&fit=crop",
    imageName: "black-panther.jpg"
  }
];

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

    // Create posts with saved images
    for (const hero of superheroes) {
      // Save the image locally
      const imageName = await saveImageFromUrl(hero.imageUrl, hero.imageName);
      
      if (imageName) {
        // Create the post
        const post = await Post.create({
          title: hero.title,
          slug: hero.slug,
          content: hero.content,
          image: imageName,
          createdAt: new Date(),
          user: testUser._id
        });

        // Add post to user's posts array
        testUser.posts.push(post._id);
        console.log(`Created post: ${post.title}`);
      }
    }

    // Save the updated user
    await testUser.save();
    console.log('Added posts to user');

    console.log('Database seeding completed successfully!');
    console.log(`
    -----------------------------------------------
    HeroPedia has been seeded with sample data!
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
