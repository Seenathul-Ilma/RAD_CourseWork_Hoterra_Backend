import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // Config the '.env' file to load environment variables 

const SERVER_PORT = process.env.SERVER_PORT;
const MONGO_URI = process.env.MONGO_URI as string;

// Create an Express app instance to handle routes, middleware, and server configurations
const app = express();

// Register built-in middleware to parse incoming JSON request bodies
app.use(express.json());

// Enable CORS origin for frontend (including preflight OPTIONS requests)
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error(`Error Connecting MongoDB: ${err}`);
    process.exit(1);
  });

// Start the server 
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port: ${SERVER_PORT}`);
});
