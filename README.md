# 🦸 HeroPedia

## 📝 Description
HeroPedia is a full-stack web application built using Node.js, Express, and MongoDB. This project was developed as part of the General Assembly Software Engineering Immersive course. HeroPedia serves as a platform where users can create accounts, share posts with images, and interact with content from other users. The application demonstrates implementation of authentication, CRUD operations, and responsive design principles.

## 🚀 Deployment Link
[HeroPedia Live Site](https://heropedia.netlify.app)

*Note: You can register for a new account or use the following test credentials:*
- Email: test@example.com
- Password: password123

## 💻 Getting Started/Code Installation
To run this project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/HeroPedia.git
   ```

2. Navigate to the project directory:
   ```
   cd HeroPedia
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_DB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   COOKIE_SECRET=your_cookie_secret
   APP_URL=http://localhost:3000
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## ⏱️ Timeframe & Working Team
This project was completed as a solo project over a two-week sprint. I was responsible for all aspects of the application from planning to deployment.

## 🔧 Technologies Used

### 🖥️ Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Bcrypt.js
- Express-session
- Connect-flash
- Multer
- Nodemailer

### 🎨 Frontend
- EJS (Embedded JavaScript Templates)
- Bootstrap 5
- HTML5
- CSS3
- JavaScript

### 🛠️ Development & Deployment
- Git & GitHub
- Nodemon
- Netlify
- Serverless Functions
- MongoDB Atlas

## 📋 Brief
The project brief required the development of a full-stack application that demonstrates:

- Complete CRUD functionality
- User authentication and authorization
- Responsive design principles
- Data persistence using MongoDB
- Server-side rendering with EJS templates
- Image upload and storage capabilities
- Deployment to a cloud platform

The application needed to provide users with the ability to register, login, create posts with images, view their own posts, edit and delete their content, and browse posts from other users.

## 📊 Planning

### 📐 Entity Relationship Diagram (ERD)
I began by designing the database schema, focusing on the relationship between users and posts:

![ERD Diagram](https://i.imgur.com/example1.png)

### 🖼️ Wireframes
I created wireframes for the main pages to visualize the user interface:

![Wireframe - Home Page](https://i.imgur.com/example2.png)
![Wireframe - Profile Page](https://i.imgur.com/example3.png)

### 👤 User Stories
I developed the following user stories to guide the development process:
- As a user, I want to create an account so that I can access the platform
- As a user, I want to log in to my account to manage my content
- As a user, I want to create posts with images to share with others
- As a user, I want to view all my posts in one place
- As a user, I want to edit or delete my posts
- As a user, I want to browse posts from other users
- As a user, I want to reset my password if I forget it

### 📈 Project Management
I used Trello to organize tasks and track progress throughout the development cycle:

![Trello Board](https://i.imgur.com/example4.png)

## 🔨 Build/Code Process

### 🔐 Authentication System
One of the first components I built was the authentication system. I implemented user registration, login, and password reset functionality:

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
Using EJS for server-side rendering improved my skills in creating dynamic web pages. I learned how to pass data from the server to templates and create reusable components.

### ⚙️ Express Middleware
Developing custom middleware functions enhanced my understanding of the Express.js request-response cycle and how to extend the functionality of the application.

### ⚠️ Error Handling
This project taught me the importance of comprehensive error handling in web applications. I learned how to catch and handle errors gracefully to provide a better user experience.

## 🐛 Bugs

- The password reset link in emails contains a hardcoded URL that may not work in all environments if the APP_URL environment variable is not set.
- There's no validation for empty fields in the post creation form, which could lead to posts with missing content.
- The delete post functionality doesn't check if the user is the owner of the post before deletion.

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
