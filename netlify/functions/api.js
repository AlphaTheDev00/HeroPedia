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
import mongoose from 'mongoose';
const app = express();
dotenv.config();

// Log environment variables (without sensitive info)
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI exists:', !!process.env.MONGO_DB_URI);

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
});

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

// Add a diagnostic route to check environment variables
app.get('/env-check', (req, res) => {
  return res.json({
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL,
    MONGO_DB_URI_EXISTS: !!process.env.MONGO_DB_URI
  });
});

// auth route
app.use('/', authRoutes);

// post routes
app.use('/', postRoutes);

export const handler = serverless(app);
