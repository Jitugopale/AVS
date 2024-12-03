import express from "express";
import connectToMongo from "./db/db.js";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToMongo();

// Routes for authentication and Aadhaar
app.use("/api/auth", router);           // Auth routes
app.use("/api/adhar", router);     // Aadhaar routes

// Health check route
app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
