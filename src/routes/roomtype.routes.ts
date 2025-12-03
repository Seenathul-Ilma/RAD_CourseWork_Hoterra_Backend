import { Router } from "express";
import { getAllRoomType, saveRoomType, updateRoomType, deleteRoomType } from "../controllers/roomtype.controller";
import { authenticate } from "../middlewares/auth";
import { authorization } from "../middlewares/roles";
import { upload } from "../middlewares/upload";
import { Role } from "../models/User";

const router = Router()

router.get("/", getAllRoomType)

// image urls in an array & maxcount 5
router.post("/create", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), upload.array("image", 5), saveRoomType)

router.post("/update", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), updateRoomType)

router.post("/delete", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), deleteRoomType)

export default router