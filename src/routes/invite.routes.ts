import { Router } from "express"
import { authenticate } from "../middlewares/auth"
import { authorization } from "../middlewares/roles"
import { Role } from "../models/User"
import { createInvitation } from "../controllers/invite.controller"

const router = Router()


// PROTECTED
// ADMIN ONLY -> need to create middleware for ensure the req is from ADMIN
router.post("/staff", authenticate, authorization(Role.ADMIN), createInvitation)

export default router
