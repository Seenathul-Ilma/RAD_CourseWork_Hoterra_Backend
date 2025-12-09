import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorization } from "../middlewares/roles";
import { Role } from "../models/User";
import { deleteRoom, getAllRoom, saveRoom, updateRoom } from "../controllers/room.controller";

const route = Router()

route.get("/", getAllRoom)

route.post("/create", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), saveRoom)

route.put("/update/:id", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), updateRoom)

route.delete("/delete/:id", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), deleteRoom)

export default route