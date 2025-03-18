#!/bin/bash

# HeroPedia Deployment Script
# This script helps deploy your HeroPedia application to Netlify

echo "🚀 Starting HeroPedia deployment process..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️ .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "⚠️ Please edit the .env file with your actual values before continuing."
        exit 1
    else
        echo "❌ .env.example file not found. Please create a .env file manually."
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for MongoDB connection
echo "🔍 Checking MongoDB connection..."
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

async function checkConnection() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('✅ MongoDB connection successful!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

checkConnection();
"

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Deployment process completed!"
echo "📝 Please check the DEPLOYMENT_CHECKLIST.md file for post-deployment verification steps."
