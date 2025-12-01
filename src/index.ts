import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs"

import authRouter from "./routes/auth.routes"
import roomTypeRouter from "./routes/roomtype.routes"

import { Role, Status, User } from "./models/User"

import dotenv from "dotenv";
dotenv.config(); // Config the '.env' file to load environment variables 

const SERVER_PORT = process.env.SERVER_PORT
const MONGO_URI = process.env.MONGO_URI as string

const DEFAULT_ADMIN_FIRSTNAME = process.env.DEFAULT_ADMIN_FIRSTNAME as string
const DEFAULT_ADMIN_LASTNAME = process.env.DEFAULT_ADMIN_LASTNAME
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL as string
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD as string

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

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/roomtype", roomTypeRouter)

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(async() => {
    console.log("MongoDB connected");

    try {
        const existingAdmin = await User.findOne({ roles: "ADMIN" })

        if(!existingAdmin) {
          const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)

          const newAdmin = new User({
            firstname: DEFAULT_ADMIN_FIRSTNAME,
            lastname: DEFAULT_ADMIN_LASTNAME,
            email: DEFAULT_ADMIN_EMAIL,
            password: hashedPassword,
            roles: [Role.ADMIN],
            accountstatus: Status.ACTIVE
          })

          await newAdmin.save()
          console.log(`Default admin created with email: ${DEFAULT_ADMIN_EMAIL} & password: ${DEFAULT_ADMIN_PASSWORD}.`);
        } else {
          console.log("Admin already exists. Skipping default admin creation..");
        }

      } catch (err) {
        console.error(`Error creating default admin:, ${err}`);
      }
  })
  .catch((err) => {
    console.error(`Error Connecting MongoDB: ${err}`);
    process.exit(1);
  });

// Start the server 
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port: ${SERVER_PORT}`);
});