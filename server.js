import express from "express";
import connectDB from "./db.js";
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(express.json());

connectDB();

//set template engine to ejs
app.set("view engine", "ejs");

// home route
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});