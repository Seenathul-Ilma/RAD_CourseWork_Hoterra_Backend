import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorization } from "../middlewares/roles";
import { Role } from "../models/User";
import { deleteRoom, getAllRoom, saveRoom, updateRoom } from "../controllers/room.controller";

const route = Router()

route.get("/", getAllRoom)

route.post("/create", saveRoom)

route.put("/update/:id", updateRoom)

route.delete("/delete/:id", deleteRoom)

export default route