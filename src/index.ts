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
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 5000
const MONGO_URI = process.env.MONGO_URI as string
const FRONTEND_URL = process.env.FRONTEND_URL || "https://rad-course-work-hoterra-frontend.vercel.app"
const NODE_ENV = process.env.NODE_ENV || "production"

const DEFAULT_ADMIN_FIRSTNAME = process.env.DEFAULT_ADMIN_FIRSTNAME as string
const DEFAULT_ADMIN_LASTNAME = process.env.DEFAULT_ADMIN_LASTNAME
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL as string
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD as string
const DEFAULT_ADMIN_PHONE = process.env.DEFAULT_ADMIN_PHONE as string

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS - More robust configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    FRONTEND_URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  maxAge: 86400 // Cache preflight for 24 hours
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Health check endpoint (for keeping warm)
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1,
    environment: NODE_ENV
  });
});

// Ping endpoint for external services to keep backend warm
app.get("/api/v1/ping", (req: Request, res: Response) => {
  res.status(200).json({ 
    message: "pong",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/roomtype", roomTypeRouter)
app.use("/api/v1/room", roomRouter)
app.use("/api/v1/invite", inviteRouter)
app.use("/api/v1/service", amenityRouter)
app.use("/api/v1/booking", bookingRouter)
app.use("/api/v1/available", availabilityRouter)

// 404 handler with CORS headers
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler (MUST be last)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);

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

    // MongoDB errors
    if (err.name === "MongoError" || err.name === "MongoServerError") {
      return res.status(500).json({
        message: "Database error occurred"
      });
    }

    // Default error
    res.status(500).json({
      message: "Internal server error",
      ...(NODE_ENV === "development" && { error: err.message })
    });

});

// MongoDB Connection with retry logic
let mongoConnected = false;
let connectionRetries = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000;

const connectMongo = async (retries = MAX_RETRIES) => {
  try {

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
      retryWrites: true,
      w: "majority"
    });

    mongoConnected = true;
    connectionRetries = 0;
    console.log("✓ MongoDB connected successfully");

    await createDefaultAdmin();

  } catch (err) {
    console.error(`MongoDB connection failed (attempt ${connectionRetries}/${MAX_RETRIES}): ${err}`);
    
    if (retries > 0) {
      console.log(`Retrying in ${RETRY_DELAY}ms... (${retries - 1} retries left)`);
      setTimeout(() => connectMongo(retries - 1), RETRY_DELAY);

    } else {
      console.error("Failed to connect to MongoDB after all retries");
      process.exit(1);
    }
  }
};

const createDefaultAdmin = async () => {

  // Create default admin
    try {
      const existingAdmin = await User.findOne({ roles: "ADMIN" });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

        const newAdmin = new User({
          firstname: DEFAULT_ADMIN_FIRSTNAME,
          lastname: DEFAULT_ADMIN_LASTNAME,
          email: DEFAULT_ADMIN_EMAIL,
          password: hashedPassword,
          phone: DEFAULT_ADMIN_PHONE,
          roles: [Role.ADMIN],
          accountstatus: Status.ACTIVE
        });

        await newAdmin.save();
        console.log(`✓ Default admin created with email: ${DEFAULT_ADMIN_EMAIL}`);
      
      } else {
        console.log("! Admin already exists. Skipping default admin creation.");
      }


    } catch (err) {
      console.error(`Error with admin creation: ${err}`);
    }

}

// Handle MongoDB disconnection
mongoose.connection.on("disconnected", () => {
  mongoConnected = false;
  console.warn("⚠ MongoDB disconnected. Attempting to reconnect...");
  connectMongo();
});

mongoose.connection.on("error", (err) => {
  console.error("⚠ MongoDB connection error:", err);
});

mongoose.connection.on("reconnected", () => {
  mongoConnected = true;
  console.log("✓ MongoDB reconnected");
});

// Initialize Connection
connectMongo();

// Start server
const server = app.listen(SERVER_PORT, () => {
  console.log(`✓ Server running on port: ${SERVER_PORT}`);
  console.log(`Environment: ${NODE_ENV}`)
});

// ============ GRACEFUL SHUTDOWN ============
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(async () => {
    try {
      await mongoose.disconnect();
      console.log("✓ MongoDB disconnected");
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(async () => {
    try {
      await mongoose.disconnect();
      console.log("✓ MongoDB disconnected");
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });
});

export default app;