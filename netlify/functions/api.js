import express from 'express';
import serverless from 'serverless-http';
import path from 'path';

// Initialize express app
const app = express();

// Basic middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static HTML for the main route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HeroPedia - Maintenance Mode</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        h1 {
          color: #2c3e50;
          margin-top: 40px;
        }
        .hero {
          background-color: #3498db;
          color: white;
          padding: 40px 20px;
          border-radius: 10px;
          margin: 30px 0;
        }
        .message {
          background-color: #f8f9fa;
          border-left: 4px solid #3498db;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
        }
        .status {
          display: inline-block;
          background-color: #e74c3c;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="hero">
        <h1>HeroPedia</h1>
        <p>Share your superhero stories with the world</p>
      </div>
      
      <h2>Maintenance Mode</h2>
      <p>We're currently performing database maintenance to improve your experience.</p>
      
      <div class="message">
        <p><strong>Status Update:</strong> Our team is working on resolving a database connection issue. We expect to be back online shortly.</p>
        <p>Thank you for your patience!</p>
      </div>
      
      <p class="status">Database Maintenance in Progress</p>
    </body>
    </html>
  `);
});

// Add a diagnostic route to check environment variables
app.get('/env-check', (req, res) => {
  return res.json({
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL,
    MONGO_DB_URI_EXISTS: !!process.env.MONGO_DB_URI
  });
});

// Add a status route for API clients
app.get('/api/status', (req, res) => {
  return res.json({
    status: 'maintenance',
    message: 'HeroPedia is currently in maintenance mode due to database connectivity issues.',
    expectedResolution: 'Our team is working to resolve this issue as soon as possible.'
  });
});

// Export the serverless handler
export const handler = serverless(app);
