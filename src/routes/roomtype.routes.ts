import { Router } from "express";
import { getAllRoomType, saveRoomType } from "../controllers/roomtype.controller";
import { authenticate } from "../middlewares/auth";
import { authorization } from "../middlewares/roles";
import { Role } from "../models/User";

const router = Router()

router.get("/", getAllRoomType)

router.post("/create", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), saveRoomType)


export default router