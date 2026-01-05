import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs"
import multer from "multer";  

import authRouter from "./routes/auth.routes"
import roomTypeRouter from "./routes/roomtype.routes"
import roomRouter from "./routes/room.routes"
import inviteRouter from "./routes/invite.routes"
import amenityRouter from "./routes/amenity.routes"
import bookingRouter from "./routes/booking.routes"
import availabilityRouter from "./routes/availability.routes"

import { Role, Status, User } from "./models/User"

import dotenv from "dotenv";
dotenv.config(); // Config the '.env' file to load environment variables 

const SERVER_PORT = process.env.SERVER_PORT
const MONGO_URI = process.env.MONGO_URI as string

const DEFAULT_ADMIN_FIRSTNAME = process.env.DEFAULT_ADMIN_FIRSTNAME as string
const DEFAULT_ADMIN_LASTNAME = process.env.DEFAULT_ADMIN_LASTNAME
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL as string
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD as string
const DEFAULT_ADMIN_PHONE = process.env.DEFAULT_ADMIN_PHONE as string

// Create an Express app instance to handle routes, middleware, and server configurations
const app = express();

// Register built-in middleware to parse incoming JSON request bodies
app.use(express.json());

// Enable CORS origin for frontend (including preflight OPTIONS requests)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://rad-course-work-hoterra-frontend.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/roomtype", roomTypeRouter)
app.use("/api/v1/room", roomRouter)
app.use("/api/v1/invite", inviteRouter)
app.use("/api/v1/service", amenityRouter)
app.use("/api/v1/booking", bookingRouter)
app.use("/api/v1/available", availabilityRouter)

// Global Multer error handler MUST be after all routes
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "You can upload a maximum of 5 images."
            });
        }

        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File too large. Maximum size is 20MB per image."
            });
        }
    }

    next(err);
});

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
            phone: DEFAULT_ADMIN_PHONE,
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

app.get("/",(req,res) => {
  res.send("Backend is running..!")
})

app.get("/api/v1/health", async (req: Request, res: Response) => {
  const mongoState = mongoose.connection.readyState;
  
  res.status(200).json({
    status: "OK",
    mongoConnected: mongoState === 1,
    mongoState: mongoState === 1 ? "connected" : "disconnected",
    readyState: mongoState, // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Start the server 
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port: ${SERVER_PORT}`);
});

export default app