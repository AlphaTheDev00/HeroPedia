// Simple script to encode the password for MongoDB URI
const password = "yiSNXYziQEfeVbde";
const encodedPassword = encodeURIComponent(password);
console.log("Original password:", password);
console.log("Encoded password:", encodedPassword);
console.log("Full connection string:");
console.log(`mongodb+srv://yasthedev:${encodedPassword}@heropedia.odwlic5.mongodb.net/HeroPEdia-DB?retryWrites=true&w=majority&appName=HeroPedia`);
