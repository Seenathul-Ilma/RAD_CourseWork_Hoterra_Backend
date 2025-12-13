import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorization } from "../middlewares/roles";
import { Role } from "../models/User";
import { createBooking, getAllBookings, getBookingById, updateBookingStatus } from "../controllers/booking.controller";

const route = Router()

route.get("/", getAllBookings)

route.get("/:id", getBookingById)

route.post("/create", authenticate, createBooking)

route.put("/update/status/:id", authenticate, updateBookingStatus)

//route.delete("/delete/:id", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), deleteBooking)

export default route