# HeroPedia Deployment Checklist

This document provides a comprehensive checklist for deploying your HeroPedia application to Netlify.

## Environment Variables

Create a `.env` file in your project root with the following variables:

```
# Database Configuration
MONGO_DB_URI=your_mongodb_connection_string

# Authentication Secrets
SESSION_SECRET=your_session_secret
COOKIE_SECRET=your_cookie_secret

# Application Settings
APP_URL=https://your-netlify-app-name.netlify.app
NODE_ENV=production

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
EMAIL_FROM="HeroPedia <noreply@example.com>"
```

## Netlify Configuration

Your project already includes a `netlify.toml` file and serverless function setup, which is good. Make sure to:

1. Set up all environment variables in Netlify's deployment settings
2. Connect your GitHub repository to Netlify for continuous deployment
3. Configure build settings:
   - Build command: `npm install`
   - Publish directory: `.`

## Code Improvements

The following code improvements should be made before deployment:

### 1. Update Email Configuration

In `routes/authRoutes.js`:
- Add `import crypto from 'crypto';` at the top of the file
- Replace the simple token generation with: `const token = crypto.randomBytes(32).toString('hex');`
- Use environment variables for email configuration

### 2. Add Form Validation

In `routes/postRoutes.js`:
- Add validation for empty title and content fields in the post creation form
- Ensure all user inputs are properly sanitized

### 3. Improve Authorization Checks

In `routes/postRoutes.js`:
- Add proper authorization checks for post deletion to ensure only the post owner can delete their posts
- Clean up references in the user's posts array when a post is deleted

## Database Setup

1. Create a MongoDB Atlas cluster if you haven't already
2. Set up network access to allow connections from Netlify
3. Create a database user with appropriate permissions
4. Get your connection string and add it to your environment variables

## Testing Before Deployment

1. Test all functionality locally with the production environment variables
2. Verify that authentication works correctly
3. Test CRUD operations for posts
4. Ensure password reset functionality works with the correct APP_URL
5. Check that image uploads are working properly

## Post-Deployment Checks

After deploying to Netlify, verify:

1. The application loads correctly
2. User registration and login work
3. Password reset emails are sent with the correct link
4. Posts can be created, viewed, edited, and deleted
5. Images are displayed correctly
6. Session persistence works across page refreshes

## Future Improvements

Consider implementing these improvements for a more robust application:

1. Use AWS S3 or similar for image storage instead of storing in MongoDB
2. Add pagination for posts to improve performance
3. Implement a more comprehensive error handling system
4. Add user profile management functionality
5. Set up monitoring and error tracking with a service like Sentry

## Security Considerations

1. Ensure all API keys and secrets are stored as environment variables
2. Implement rate limiting for authentication endpoints
3. Set secure and HTTP-only flags for cookies in production
4. Use HTTPS for all communication
5. Regularly update dependencies to patch security vulnerabilities
