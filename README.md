# 🦸 HeroPedia - Superhero Content Sharing Platform

<div align="center">
  <img src="https://i.imgur.com/SLaHFBF.jpg" alt="HeroPedia Banner" width="600px">
  <p><em>Share your superhero knowledge with the world</em></p>
</div>

## 📝 Description

HeroPedia is a full-stack web application built using Node.js, Express, and MongoDB that allows superhero enthusiasts to share content about their favorite heroes. This project was developed as part of my portfolio to demonstrate my skills in full-stack development. 

The application features user authentication, image uploads, dark/light mode toggle, responsive design, and complete CRUD functionality. Users can create accounts, share posts with images, search for content, and interact with posts from other users.

## 🚀 Deployment Link

**Live Site**: [HeroPedia](https://hero-share-pedia.netlify.app/)

*You can register for a new account or use the following test credentials:*
- 📧 Email: hero@example.com
- 🔑 Password: password123

## 💻 Getting Started/Code Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AlphaTheDev00/HeroPedia.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd HeroPedia
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Create a `.env` file** in the root directory with the following variables:
   ```
   MONGO_DB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   COOKIE_SECRET=your_cookie_secret
   APP_URL=http://localhost:3000
   ```

5. **Seed the database with sample data** (optional):
   ```bash
   node seed-local-demo-images.js
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser** and navigate to `http://localhost:3000`

## ⏱️ Timeframe & Working Team

⌛ This project was completed as a **solo project** over a one-week sprint. I was responsible for all aspects of the application from planning to deployment, including debugging and feature enhancement.

## 🔧 Technologies Used

### 🖥️ Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool
- **Bcrypt.js** - Password hashing
- **Express-session** - Session management
- **Connect-flash** - Flash messages
- **Multer** - File/image upload handling
- **Method-override** - HTTP method override for RESTful forms

### 🎨 Frontend
- **EJS** (Embedded JavaScript Templates) - Server-side templating
- **Bootstrap 5** - CSS framework for responsive design
- **Bootstrap Icons** - Icon library
- **HTML5** - Markup language
- **CSS3** - Styling
- **JavaScript** - Client-side scripting
- **LocalStorage** - Client-side storage for theme preferences

### 🛠️ Development & Deployment
- **Git & GitHub** - Version control
- **Nodemon** - Development server with auto-reload
- **Netlify** - Deployment platform
- **Serverless Functions** - Backend API hosting
- **MongoDB Atlas** - Cloud database service
- **Connect-mongo** - MongoDB session store

## 📋 Brief

The project brief required the development of a superhero-themed content sharing platform with the following requirements:

- ✅ **Complete CRUD functionality** for user posts
- 🔐 **User authentication and authorization** system
- 📱 **Responsive design** for all device sizes
- 💾 **Data persistence** using MongoDB
- 🖥️ **Server-side rendering** with EJS templates
- 📸 **Image upload and storage** capabilities
- 🌐 **Deployment** to a cloud platform
- 🔍 **Search functionality** for finding posts
- 🌓 **Dark/light mode toggle** for improved user experience

The application needed to provide users with the ability to register, login, create posts with images, view their own posts, edit and delete their content, and browse posts from other users.

## 📊 Planning

### 📐 Data Modeling

I began by designing the database schema, focusing on the relationship between users and posts:

```javascript
// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  createdAt: { type: Date, default: Date.now },
});

// Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});
```

### 🖼️ Feature Planning

I created a list of core features to implement:

1. **User Authentication**
   - Registration with validation
   - Login/logout functionality
   - Protected routes

2. **Post Management**
   - Create posts with image uploads
   - View all posts (homepage)
   - View individual posts
   - Edit/update posts
   - Delete posts
   - My posts page

3. **UI/UX Features**
   - Responsive design
   - Search functionality
   - Pagination
   - Flash messages
   - Dark/light mode toggle

### 👤 User Flow

I mapped out the user journey through the application:

```
Homepage → Register/Login → Browse Posts → View Post Details → Create Post → Manage Posts
```

### 📈 Development Approach

I adopted an iterative development approach:

1. **Setup Phase** - Project structure, dependencies, database connection
2. **Core Functionality** - Authentication, basic CRUD operations
3. **UI Development** - Templates, styling, responsive design
4. **Feature Enhancement** - Search, pagination, image handling
5. **Testing & Debugging** - Fix image display issues, search functionality
6. **Deployment** - Netlify setup with serverless functions

## 🔨 Build/Code Process

The development of HeroPedia involved several key components and features. Here's a detailed look at the most significant parts of the implementation:

### 🌓 Dark Mode Implementation

One of the most recent features I added was a dark/light mode toggle that enhances user experience. The implementation uses Bootstrap 5's built-in theming system with custom JavaScript and CSS:

```javascript
// Dark mode functionality
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const htmlElement = document.documentElement;
  
  // Check if user previously enabled dark mode
  const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
  
  // Set initial state based on localStorage
  if (isDarkMode) {
    enableDarkMode();
  }
  
  // Toggle dark mode when button is clicked
  darkModeToggle.addEventListener('click', () => {
    // Check if dark mode is currently enabled
    const isDarkMode = htmlElement.getAttribute('data-bs-theme') === 'dark';
    
    if (isDarkMode) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });
  
  // Function to enable dark mode
  function enableDarkMode() {
    htmlElement.setAttribute('data-bs-theme', 'dark');
    updateIcon(true);
    localStorage.setItem('darkMode', 'enabled');
  }
  
  // Function to disable dark mode
  function disableDarkMode() {
    htmlElement.setAttribute('data-bs-theme', 'light');
    updateIcon(false);
    localStorage.setItem('darkMode', 'disabled');
  }
  
  // Update the icon based on current mode
  function updateIcon(isDark) {
    const iconElement = darkModeToggle.querySelector('i');
    if (isDark) {
      iconElement.classList.remove('bi-moon');
      iconElement.classList.add('bi-sun');
    } else {
      iconElement.classList.remove('bi-sun');
      iconElement.classList.add('bi-moon');
    }
  }
});
```

The dark mode toggle is integrated into the navbar with a simple button and icon:

```html
<li class="nav-item">
  <button id="darkModeToggle" class="btn btn-link nav-link" aria-label="Toggle dark mode">
    <i class="bi bi-moon"></i>
  </button>
</li>
```

I also added custom CSS to enhance the dark mode experience with smooth transitions:

```css
/* Dark mode transitions and custom styles */
:root {
  --transition-speed: 0.3s;
}

body {
  transition: background-color var(--transition-speed), color var(--transition-speed);
}

.card, .navbar, .btn {
  transition: background-color var(--transition-speed), 
              color var(--transition-speed), 
              border-color var(--transition-speed);
}

/* Improved card styling in dark mode */
[data-bs-theme="dark"] .card {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3) !important;
}
```

### 📸 Image Handling and Display

One of the core challenges I solved was properly handling and displaying images in different formats. I implemented a solution that works with both base64-encoded images and direct image URLs:

```javascript
// Handle image upload in the post creation route
router.post(
  '/create-post',
  protectedRoute,
  upload.single('image'),
  async (req, res) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        req.flash('error', 'Image is required!');
        return res.redirect('/create-post');
      }
      
      // Convert image to base64
      const image = req.file.buffer.toString('base64');
      
      // Create new post with the base64 image
      const post = new Post({ 
        title: req.body.title, 
        slug, 
        content: req.body.content, 
        image, 
        user 
      });
      
      await post.save();
      // Rest of the code...
    } catch (error) {
      // Error handling...
    }
  }
);
```

In the EJS templates, I implemented a conditional rendering approach to handle both base64 images and direct URLs:

```html
<img 
  src="<%= post.image.startsWith('http') ? post.image : `data:image/jpeg;base64,${post.image}` %>"
  class="img-fluid card-img-top"
  alt="<%= post.title %>"
  style="height: 200px; object-fit: cover;"
/>
```

This ternary operator checks if the image is a URL (starts with 'http') or a base64 string and renders it accordingly. This solution ensures that images display correctly regardless of their source.

### 🔐 Authentication System

The authentication system includes user registration, login, and session management:

```javascript
// User registration route
router.post('/register', guestRoute, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      req.flash('error', 'User already exists with this email!');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    req.flash('success', 'User registered successfully, you can login now!');
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong, try again!');
    res.redirect('/register');
  }
});
```

For the password reset functionality, I implemented a token-based system using Nodemailer:

```javascript
// Forgot password route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'User not found with this email');
      return res.redirect('/forgot-password');
    }
    const token = Math.random().toString(36).slice(2);
    user.token = token;
    await user.save();
    const info = await transport.sendMail({
      from: '"HeroPedia" <fordev77@gmail.com>',
      to: email,
      subject: 'Password Reset',
      text: 'Reset your password',
      html: `<p>Click this link to reset your password: <a href="${process.env.APP_URL || 'http://localhost:3000'}/reset-password/${token}">Reset Password</a><br>Thank you!</p>`,
    });

    if (info.messageId) {
      req.flash('success', 'Password reset link has been sent to your email!');
      res.redirect('/forgot-password');
    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong, try again!');
    res.redirect('/forgot-password');
  }
});
```

### 📝 Post Management System
The core functionality of the application is the post management system. I implemented CRUD operations for posts, including image uploads using Multer:

```javascript
// Create post route
router.post(
  '/create-post',
  protectedRoute,
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const slug = title.replace(/\s+/g, '-').toLowerCase();
      const user = await User.findById(req.session.user._id);
      
      // Check if file was uploaded
      if (!req.file) {
        req.flash('error', 'Image is required!');
        return res.redirect('/create-post');
      }
      
      const image = req.file.buffer.toString('base64');

      // Create new post
      const post = new Post({ title, slug, content, image, user });

      // Save post in user posts array
      await User.updateOne(
        { _id: req.session.user._id },
        { $push: { posts: post._id } }
      );
      await post.save();
      req.flash('success', 'Post created successfully!');
      res.redirect('/my-posts');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Something went wrong!');
      res.redirect('/create-post');
    }
  }
);
```

For image handling, I used Multer's memory storage to store images as base64 strings in the database:

```javascript
// Initialize upload variable with the storage engine
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // Limit file size to 1MB
});
```

### Middleware Implementation
I created middleware functions to protect routes and manage user sessions:

```javascript
// Protect routes middleware function
export const protectedRoute = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Guest routes middleware function
export const guestRoute = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/profile');
  }
  next();
};
```

### Frontend Development
For the frontend, I used EJS templates with Bootstrap 5 to create a responsive design. Here's an example of the home page template:

```html
<%- include('partials/header') %>
<div class="container my-4">
  <div class="row g-4">
    <% if (posts && posts.length > 0) { %> <% posts.forEach(post => { %>
    <div class="col-lg-6">
      <div class="card shadow">
        <img
          src="data:image/jpeg;base64,<%= post.image %>"
          class="img-fluid card-img-top"
          alt="wallpaper"
        />
        <div class="card-body p-4">
          <h2 class="card-title fw-bold text-secondary"><%= post.title %></h2>
          <p class="card-text"><%= post.content.substring(0, 100) %>...</p>
          <div>
            <a href="/post/<%= post._id %>" class="btn btn-primary"
              >Read More</a
            >
          </div>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between align-items-center">
            <div>Author: <%= post.user.name %></div>
            <div>
              Created: <%= new Date(post.createdAt).toLocaleDateString() %>
            </div>
          </div>
        </div>
      </div>
    </div>
    <% }); %> <% } else { %>
    <p>No posts available at this time.</p>
    <% } %>
  </div>
</div>
<%- include('partials/footer') %>
```

### 📍 Deployment Configuration
For deployment to Netlify, I configured serverless functions:

```javascript
// netlify/functions/api.js
import express from 'express';
import connectDB from '../../db.js';
import authRoutes from '../../routes/authRoutes.js';
import postRoutes from '../../routes/postRoutes.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import path from 'path';
import MongoStore from 'connect-mongo';
import serverless from 'serverless-http';
import methodOverride from 'method-override';

const app = express();
dotenv.config();

connectDB();

// middlewares
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// make uploads directory as static
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// cookie middleware
app.use(cookieParser(process.env.COOKIE_SECRET));

// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60 * 24 * 7, // 1Week
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_URI,
      collectionName: 'sessions',
    }),
  })
);

// flash messages middleware
app.use(flash());

// store flash message for views
app.use(function (req, res, next) {
  res.locals.message = req.flash();
  next();
});

// store authenticated user's sessions data for view
app.use(function (req, res, next) {
  res.locals.user = req.session.user || null;
  next();
});

//set template engine to ejs
app.set('view engine', 'ejs');

// auth route
app.use('/', authRoutes);

// post routes
app.use('/', postRoutes);

export const handler = serverless(app);
```

## 💥 Challenges

### 📷 Image Upload and Storage
One of the significant challenges was implementing image upload functionality. Initially, I planned to use a cloud storage service like AWS S3, but due to time constraints, I opted for storing images as base64 strings in the MongoDB database. This approach had limitations with larger files, so I implemented file size and type restrictions using Multer:

```javascript
// File filter to allow only JPEG
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only JPEG files are allowed!'), false); // Reject the file
  }
};

// Initialize upload variable with the storage engine
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // Limit file size to 1MB
});
```

### ⚠️ Error Handling
Implementing comprehensive error handling was challenging but crucial for a good user experience. I used try-catch blocks and flash messages to provide feedback to users:

```javascript
try {
  // Code that might throw an error
} catch (error) {
  console.error(error);
  req.flash('error', 'Something went wrong, try again!');
  res.redirect('/appropriate-route');
}
```

### 🔒 Session Management
Managing user sessions across the application required careful implementation, especially when deploying to Netlify. I had to configure the session store to use MongoDB:

```javascript
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60 * 24 * 7, // 1Week
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_URI,
      collectionName: 'sessions',
    }),
  })
);
```

## 🎉 Wins

### 📱 Responsive Design
I'm particularly proud of the responsive design implementation using Bootstrap 5. The application looks and functions well on both desktop and mobile devices, providing a consistent user experience across platforms.

### 🔄 Password Reset Functionality
Implementing a complete password reset flow with email notifications was a significant achievement. This feature enhances the security and usability of the application.

### ✅ Image Upload Validation
The image upload system with validation for file types and sizes was a technical win. It ensures that only appropriate content is uploaded to the platform and prevents potential issues with large files.

### 💬 Flash Messages
The implementation of flash messages throughout the application provides immediate feedback to users, enhancing the overall user experience:

```javascript
// Flash message middleware
app.use(flash());

// Store flash message for views
app.use(function (req, res, next) {
  res.locals.message = req.flash();
  next();
});
```

## 📖 Key Learnings/Takeaways

### 💾 MongoDB and Mongoose
Working with MongoDB and Mongoose deepened my understanding of NoSQL databases and ODM (Object Document Mapping). I learned how to create schemas, establish relationships between collections, and perform CRUD operations efficiently.

### 🔐 Authentication and Security
Implementing user authentication from scratch gave me valuable insights into security best practices, including password hashing, session management, and protected routes.

### 🗺️ EJS Templating
EJS allows dynamic rendering of hero data by embedding JavaScript into HTML. It makes it easier to create interactive and data-driven pages by passing server-side data into the front-end templates. Common elements such as headers and footers are modularized using EJS partials.

## 💥 Challenges

### Image Display Issues

One of the most significant challenges I faced was properly displaying images that were stored as base64 strings in the database. Initially, the images weren't rendering correctly in the templates.

**Problem:** The base64-encoded images weren't displaying because they lacked the proper data URL prefix needed by browsers to interpret the image data.

**Solution:** I implemented a conditional rendering approach in the EJS templates that checks whether the image is a URL or a base64 string and formats it accordingly:

```html
<img src="<%= post.image.startsWith('http') ? post.image : `data:image/jpeg;base64,${post.image}` %>" class="img-fluid" alt="wallpaper" />
```

This solution ensures that images display correctly regardless of their source, making the application more robust and flexible.

### Deployment to Netlify with Serverless Functions

Deploying a full-stack Node.js application to Netlify presented challenges since Netlify primarily hosts static sites.

**Problem:** Traditional Express.js applications don't work out-of-the-box on Netlify's platform.

**Solution:** I restructured the application to use Netlify's serverless functions approach:

1. Created a serverless function that wraps the Express app
2. Configured redirects in the netlify.toml file
3. Added MongoDB connection pooling for better performance in a serverless environment

```javascript
// netlify/functions/api.js
import serverless from 'serverless-http';
import express from 'express';
// ... other imports

const app = express();
// ... app configuration

export const handler = serverless(app);
```

## 🏆 Wins

### Successful Implementation of Dark Mode

Implementing a fully functional dark/light mode toggle that persists user preferences was a significant win. The feature enhances user experience by providing a comfortable viewing option in different lighting conditions.

The implementation uses Bootstrap 5's theming system combined with custom CSS transitions for a smooth experience. The user's preference is saved to localStorage, ensuring it persists between visits.

### Responsive Design Across All Devices

The application is fully responsive and works well on devices of all sizes, from mobile phones to desktop computers. This was achieved using Bootstrap 5's grid system and custom CSS media queries.

### Efficient Image Handling

Developing a solution that handles both base64-encoded images and direct URLs was a significant achievement. This approach provides flexibility in how images are stored and displayed, making the application more versatile.

## 📚 Key Learnings/Takeaways

### Full-Stack Development Integration

This project reinforced my understanding of how frontend and backend components work together in a full-stack application. I gained valuable experience in:

- Connecting a Node.js/Express backend with a frontend using EJS templates
- Managing user sessions and authentication across the application
- Handling file uploads and storage in a database

### MongoDB and Mongoose

Working with MongoDB and Mongoose deepened my understanding of NoSQL databases and ODM (Object Data Modeling). I learned how to:

- Design efficient schema structures
- Implement relationships between collections
- Perform CRUD operations with Mongoose
- Handle database errors gracefully

### Deployment and DevOps

Deploying to Netlify with serverless functions taught me about modern deployment strategies for full-stack applications. I gained experience with:

- Configuring serverless functions
- Setting up environment variables for different environments
- Managing database connections in a serverless context
- Continuous deployment workflows

## 💡 Future Improvements

### Feature Enhancements

- **User Profiles**: Add more detailed user profiles with avatars and bio information
- **Comments System**: Implement a comments system for posts to increase user engagement
- **Social Sharing**: Add social media sharing buttons for posts
- **Categories/Tags**: Implement a categorization system for better content organization
- **Rich Text Editor**: Upgrade the post creation form with a rich text editor for better formatting options

### Technical Improvements

- **Image Optimization**: Implement server-side image optimization to reduce storage requirements and improve loading times
- **API Refactoring**: Refactor the backend to provide a RESTful API that could be consumed by a separate frontend application
- **Testing**: Add comprehensive unit and integration tests
- **Performance Optimization**: Implement caching strategies for frequently accessed data
- **Progressive Web App**: Convert the application to a PWA for offline capabilities

### ⚠️ Error Handling
This project taught me the importance of comprehensive error handling in web applications. I learned how to catch and handle errors gracefully to provide a better user experience.

## 🐛 Bugs

- The password reset link in emails contains a hardcoded URL that may not work in all environments if the APP_URL environment variable is not set.
- There's no validation for empty fields in the post creation form, which could lead to posts with missing content.
- The delete post functionality doesn't check if the user is the owner of the post before deletion.
- - **Search Pagination Issue**: When searching with a query that returns multiple pages of results, the pagination links don't maintain the search query parameter, causing the search context to be lost when navigating between pages.

- **Mobile Menu Toggle**: On some mobile devices, the navbar toggle button requires double-tapping to open the menu.

## 🚀 Deployment Instructions

To deploy this application to Netlify, follow these steps:

1. Clone the repository to your local machine
2. Create a `.env` file in the root directory with the required environment variables (see `.env.example`)
3. Set up a MongoDB Atlas cluster and get your connection string
4. Run the deployment script:
   ```
   ./deploy.sh
   ```
5. Follow the prompts from the Netlify CLI
6. After deployment, verify all functionality using the checklist in `DEPLOYMENT_CHECKLIST.md`

Alternatively, you can deploy manually:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: `npm install`
   - Publish directory: `.`
4. Set up all environment variables in Netlify's deployment settings
5. Deploy your site

## ⬆️ Future Improvements

- Implement a more robust image storage solution using AWS S3 or similar cloud storage services
- Add user profile pictures and the ability to update profile information
- Implement a commenting system for posts to enhance user interaction
- Add pagination for the home page and my posts page to handle a large number of posts
- Implement social login options (Google, Facebook, etc.)
- Add a search functionality to find posts by title or content
- Implement a tagging system for posts to categorize content
- Create an admin dashboard for content moderation
- Add unit and integration tests to ensure code quality and prevent regressions
- Implement a more secure token generation method for password reset
