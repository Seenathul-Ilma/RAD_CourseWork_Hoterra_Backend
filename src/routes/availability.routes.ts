import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorization } from "../middlewares/roles";
import { Role } from "../models/User";
import { deleteRoom, getAllRoom, getRoomById, saveRoom, updateRoom } from "../controllers/room.controller";
import { getAllAvailableRoomTypesByDate } from "../controllers/availability.controller";

const route = Router()

route.get("/", getAllAvailableRoomTypesByDate)

export default route