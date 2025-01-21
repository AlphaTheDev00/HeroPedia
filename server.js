import express from "express";
import connectDB from "./db.js";

const app = express();
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
