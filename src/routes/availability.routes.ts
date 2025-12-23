import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorization } from "../middlewares/roles";
import { Role } from "../models/User";
import { getAllAvailableRoomsByRoomType, getAllAvailablityByDate } from "../controllers/availability.controller";

const route = Router()

route.get("/", getAllAvailablityByDate)
route.get("/roomtype/:roomtype_id", getAllAvailableRoomsByRoomType)

export default route