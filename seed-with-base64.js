import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';
import Post from './models/postModel.js';

// Superhero data with direct image URLs (these will work on Netlify)
const superheroes = [
  {
    title: "Superman: The Man of Steel",
    slug: "superman-man-of-steel",
    content: `Superman, born Kal-El on the planet Krypton, was sent to Earth as an infant by his parents before their planet's destruction. Raised as Clark Kent by a farming couple in Smallville, Kansas, he discovered his extraordinary abilities as he grew up.

Superman possesses superhuman strength, speed, and durability. He can fly, has heat vision, freeze breath, and X-ray vision. Beyond his powers, Superman represents hope and embodies the ideal that anyone can use their gifts, whatever they may be, to help others and make the world a better place.

As a member of the Justice League, Superman has saved the Earth countless times from threats both terrestrial and cosmic. Despite his alien origins, his unwavering moral compass and dedication to truth and justice make him one of humanity's greatest champions.`,
    image: "https://i.imgur.com/SLaHFBF.jpg" // Direct image URL
  },
  {
    title: "Wonder Woman: Amazon Princess",
    slug: "wonder-woman-amazon-princess",
    content: `Wonder Woman, also known as Diana Prince, is a founding member of the Justice League and one of the world's greatest heroes. Born to Queen Hippolyta on the hidden island of Themyscira, Diana was raised among the immortal Amazons, women warriors created by the Greek gods.

Blessed by the gods with incredible strength, speed, and durability, Diana also wields magical artifacts including her indestructible bracelets, the Lasso of Truth, and a tiara that serves as a projectile weapon. Her combat skills, honed over centuries of training, make her one of the most formidable warriors on Earth.

Wonder Woman came to "Man's World" as an ambassador of peace, fighting for justice, love, and equality. Her compassion is as powerful as her strength, and she believes in redemption and the inherent goodness in humanity. As both a warrior and a diplomat, Wonder Woman represents the perfect balance of strength and wisdom.`,
    image: "https://i.imgur.com/iyLGzTG.jpg" // Direct image URL
  },
  {
    title: "Batman: The Dark Knight",
    slug: "batman-dark-knight",
    content: `Batman, the alter ego of billionaire Bruce Wayne, was born from tragedy when young Bruce witnessed his parents' murder in Gotham City's Crime Alley. Vowing to rid his city of the evil that took his parents, Bruce spent years training his mind and body to perfection.

Unlike many superheroes, Batman possesses no superhuman abilities. Instead, he relies on his genius intellect, detective skills, martial arts expertise, and an arsenal of advanced technology and gadgets. His Batsuit provides protection and intimidation, while his vehicles like the Batmobile give him mobility and tactical advantages.

Operating from the Batcave beneath Wayne Manor, Batman strikes fear into criminals as he patrols Gotham's streets. Despite his intimidating presence, Batman adheres to a strict moral code, refusing to kill and often working alongside the Gotham City Police Department, particularly Commissioner James Gordon.

Batman's rogues gallery includes some of the most iconic villains in comic history, including the Joker, Catwoman, the Riddler, and the Penguin. As a founding member of the Justice League, Batman provides tactical leadership and a grounded perspective among his superpowered colleagues.`,
    image: "https://i.imgur.com/jFR5j8P.jpg" // Direct image URL
  },
  {
    title: "Spider-Man: With Great Power",
    slug: "spider-man-great-power",
    content: `Spider-Man's story began when high school student Peter Parker was bitten by a radioactive spider during a science demonstration. The bite gave him superhuman strength, speed, agility, and the ability to cling to walls. He also developed a "spider-sense" that warns him of imminent danger.

After initially using his powers for personal gain, Peter learned a tragic lesson about responsibility when his inaction led to his Uncle Ben's death. Inspired by his uncle's belief that "with great power comes great responsibility," Peter dedicated himself to fighting crime as Spider-Man.

Using his scientific genius, Peter created web-shooters that allow him to swing between buildings and capture criminals. His quick wit and humor during battles have become his trademark, often masking the burden of responsibility he carries.

Over the years, Spider-Man has faced numerous villains including the Green Goblin, Doctor Octopus, and Venom. He has been a member of the Avengers and has worked alongside other heroes to protect New York City and the world. Through it all, Peter Parker remains relatable as he balances his superhero duties with everyday challenges like relationships, education, and financial struggles.`,
    image: "https://i.imgur.com/kSEDcKK.jpg" // Direct image URL
  },
  {
    title: "Black Panther: Protector of Wakanda",
    slug: "black-panther-wakanda",
    content: `Black Panther is the title held by T'Challa, king of the technologically advanced African nation of Wakanda. The mantle of the Black Panther is passed down through generations of Wakandan royalty, with each holder serving as both the nation's leader and its primary protector.

T'Challa inherited the throne after his father's death and underwent a series of trials to prove his worthiness to become the Black Panther. As part of the ceremony, he consumed the heart-shaped herb, which enhanced his strength, speed, agility, and senses to superhuman levels.

The Black Panther's suit, made from vibranium—a rare metal found almost exclusively in Wakanda—absorbs kinetic energy and can release it as a powerful force. This technology, along with other advanced Wakandan innovations, makes Black Panther one of the most formidable heroes in the world.

As king, T'Challa balances his responsibilities to his people with his duties as a global protector. After centuries of isolation, T'Challa made the historic decision to reveal Wakanda's true nature to the world, offering to share their knowledge and resources for the greater good. This decision marked a new era for both Wakanda and global politics in the superhero world.`,
    image: "https://i.imgur.com/4Mw7MYK.jpg" // Direct image URL
  },
  {
    title: "Iron Man: Genius, Billionaire, Philanthropist",
    slug: "iron-man-genius",
    content: `Tony Stark, the man behind the Iron Man armor, represents the pinnacle of human achievement through technology and innovation. Born into wealth as the son of industrialist Howard Stark, Tony inherited Stark Industries and transformed it into the world's leading weapons manufacturer before a life-changing experience redirected his genius.

After being captured by terrorists and sustaining a severe chest injury, Tony built the first Iron Man suit as a means of escape. The experience changed him profoundly, leading him to redirect Stark Industries away from weapons development and toward clean energy and advanced technology for the greater good.

The Iron Man suit is a marvel of engineering, providing superhuman strength, flight capabilities, repulsor technology, and an advanced AI interface. Tony continuously improves his designs, creating specialized armors for different situations and threats.

Beyond his technological achievements, Tony's journey is one of personal redemption. Once a self-centered playboy, he evolved into a hero willing to sacrifice everything to protect the world. His genius is matched only by his wit, and his complex personality—combining arrogance, charm, and deep-seated insecurities—makes him one of the most fascinating characters in the superhero pantheon.`,
    image: "https://i.imgur.com/HUwQWuN.jpg" // Direct image URL
  },
  {
    title: "Captain America: The First Avenger",
    slug: "captain-america-first-avenger",
    content: `Steve Rogers, a frail young man from Brooklyn, volunteered for an experimental program during World War II that transformed him into the peak of human physical perfection. As Captain America, he led the fight against Hydra, a Nazi science division led by the Red Skull.

After sacrificing himself to save the world and spending decades frozen in ice, Steve awoke in the modern era, where he continued his mission as both a symbol of hope and a frontline warrior. Armed with his virtually indestructible vibranium shield and unparalleled tactical mind, Captain America became the natural leader of the Avengers.

What makes Captain America extraordinary isn't just his enhanced strength, speed, and durability, but his unwavering moral compass. In a world of shifting values and complex ethical dilemmas, Steve Rogers stands as a beacon of integrity, always fighting for freedom, justice, and the protection of the innocent.

His famous shield, a unique combination of vibranium, steel, and unknown catalysts, is both his primary weapon and a symbol of protection. In Captain America's hands, it becomes an offensive weapon of remarkable versatility, capable of impossible ricochets that defy the laws of physics.`,
    image: "https://i.imgur.com/aeKzOtF.jpg" // Direct image URL
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

    // Create posts with direct image URLs
    for (const hero of superheroes) {
      // Create the post with direct image URL
      const post = await Post.create({
        title: hero.title,
        slug: hero.slug,
        content: hero.content,
        image: hero.image, // Using direct image URL
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
