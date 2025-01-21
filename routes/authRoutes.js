import express from 'express';

const router = express.Router();

// route for login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login Page' });
});

// route for register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register Page' });
});

// route for forgot password page
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { title: 'Forgot Password Page' });
});

// route for reset password page
router.get('/reset-password', (req, res) => {
  res.render('reset-password', { title: 'Reset Password Page' });
});

export default router;
