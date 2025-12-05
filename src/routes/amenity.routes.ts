import { Router } from "express";
import { aiGeneratedAmenityDescription } from "../controllers/ai.controller";
import { deleteAmenity, getAllAmenity, saveAmenity, updateAmenity } from "../controllers/amenity.controller";
import { authenticate } from "../middlewares/auth";
import { authorization } from "../middlewares/roles";
import { Role } from "../models/User";


const route = Router()

route.get("/", getAllAmenity)

route.post("/create", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), saveAmenity)

route.post("/ai/generate", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), aiGeneratedAmenityDescription)

route.put("/update/:id", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), updateAmenity)

route.delete("/delete/:id", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), deleteAmenity)

export default route