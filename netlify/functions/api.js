import express from 'express';
import connectDB from '.../db.js';
import authRoutes from '.../routes/authRoutes.js';
import postRoutes from '.../routes/postRoutes.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import path from 'path';
import MongoStore from 'connect-mongo';
import serverless from 'serverless-http';
const app = express();
dotenv.config();

connectDB();

// middlewares
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
      mongoUrl: process.env.MONGODB_URI,
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
