import express from "express";
import connectToMongo from "./db/db.js";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/authRoutes.js";
import axios from "axios"; // Import axios

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

// Function to log the server's public IP
const logServerIp = async () => {
  try {
    const response = await axios.get('https://ifconfig.me');
    console.log(`Server is running with public IP: ${response.data}`);
  } catch (error) {
    console.error('Failed to fetch public IP:', error.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Log the public IP address
  logServerIp();
});
