# MongoDB Atlas User Setup Instructions

Follow these steps to create a new database user in MongoDB Atlas and update your Netlify environment variables:

## 1. Log in to MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in with your credentials

## 2. Create a New Database User

1. Select your project
2. Click on "Database Access" in the left sidebar
3. Click "ADD NEW DATABASE USER"
4. Choose "Password" authentication method
5. Enter a new username (e.g., `heropedia_user`)
6. Enter a simple password without special characters (e.g., `HeroPedia123456`)
7. Under "Database User Privileges", select "Atlas admin" (for testing purposes)
8. Click "Add User"

## 3. Update Network Access

1. Click on "Network Access" in the left sidebar
2. Click "ADD IP ADDRESS"
3. Click "ALLOW ACCESS FROM ANYWHERE" (for testing purposes)
4. Click "Confirm"

## 4. Get Your New Connection String

Your new connection string will look like this:
```
mongodb+srv://heropedia_user:HeroPedia123456@heropedia.odwlic5.mongodb.net/HeroPEdia-DB?retryWrites=true&w=majority&appName=HeroPedia
```

## 5. Update Netlify Environment Variables

After creating the new user, come back here and we'll update your Netlify environment variables with the new connection string.
