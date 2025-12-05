import { Router } from "express";
import { getAllRoomType, saveRoomType, updateRoomType, deleteRoomType } from "../controllers/roomtype.controller";
import { authenticate } from "../middlewares/auth";
import { authorization } from "../middlewares/roles";
import { upload } from "../middlewares/upload";
import { Role } from "../models/User";
import { aiGeneratedRoomDescription } from "../controllers/ai.controller";

const route = Router()

route.get("/", getAllRoomType)

// image urls in an array & maxcount 5
route.post("/create", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), upload.array("image", 5), saveRoomType)

route.post("/ai/generate", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), aiGeneratedRoomDescription)

route.put("/update/:id", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), upload.array("image", 5), updateRoomType)

route.delete("/delete/:id", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), deleteRoomType)

export default route