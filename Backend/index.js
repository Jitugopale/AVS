import express from "express";
// import connectDB from "./config/db.js";
import connectToMongo from "./db/db.js";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/authRoutes.js";

// import authRoutes from "./routes/authRoutes.js";
// import topicRoutes from "./routes/topicRoutes.js";
// import quizRoutes from "./routes/quizRoutes.js";
// import leaderboardRoutes from "./routes/leaderboardRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectToMongo();

app.use("/api/auth", router);


 app.get('/', (req, res) => {
     res.send('<h1>Server is running</h1>');   });

  // app.use('/api/auth',router);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
