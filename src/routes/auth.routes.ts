import { Router } from "express"
import { register, login, refreshAccessToken, adminRegister, getMyDetails } from "../controllers/auth.controller"
import { authenticate } from "../middlewares/auth"
import { authorization } from "../middlewares/roles"
import { Role } from "../models/User"

const router = Router()

// PUBLIC
router.post("/refresh", refreshAccessToken)
router.post("/login", login)
router.post("/register", register)

// PROTECTED
// ADMIN, RECEPTIONIST & GUEST
router.get("/me", authenticate, getMyDetails)

// PROTECTED
// ADMIN ONLY -> need to create middleware for ensure the req is from ADMIN
router.post("/admin/register", authenticate, authorization(Role.ADMIN), adminRegister)

export default router
