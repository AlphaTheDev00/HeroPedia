# MongoDB Atlas Setup Guide for HeroPedia

Follow these steps to create a new MongoDB user and update your Netlify environment variables:

## 1. Create a New MongoDB User

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your "HeroPedia" cluster
3. Click on "Database Access" in the left sidebar
4. Click "ADD NEW DATABASE USER"
5. Choose "Password" authentication method
6. Enter these credentials:
   - Username: `netlify_user`
   - Password: `NetlifyHero2025`
   - (Make sure to use this exact password)
7. Under "Database User Privileges", select "Atlas admin" (for testing purposes)
8. Click "Add User"

## 2. Update Network Access

1. Click on "Network Access" in the left sidebar
2. Click "ADD IP ADDRESS"
3. Click "ALLOW ACCESS FROM ANYWHERE" (select 0.0.0.0/0)
4. Click "Confirm"

## 3. Update Netlify Environment Variables

After creating the new user, run these commands in your terminal:

```
netlify env:set MONGO_DB_URI "mongodb+srv://netlify_user:NetlifyHero2025@heropedia.odwlic5.mongodb.net/HeroPEdia-DB?retryWrites=true&w=majority&appName=HeroPedia"
netlify env:set NODE_ENV "production"
netlify env:set APP_URL "https://hero-share-pedia.netlify.app"
```

## 4. Trigger a New Deployment

After updating the environment variables, trigger a new deployment:

```
netlify deploy --trigger
```

## 5. Check Your Site

Visit https://hero-share-pedia.netlify.app/ to see if your site is working with the new MongoDB credentials.
