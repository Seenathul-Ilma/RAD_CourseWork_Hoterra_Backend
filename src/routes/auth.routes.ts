import { Router } from "express"
import { register, login, refreshAccessToken, getMyDetails, staffRegister } from "../controllers/auth.controller"
import { authenticate } from "../middlewares/auth"
import { authorization } from "../middlewares/roles"
import { Role } from "../models/User"

const router = Router()

// PUBLIC
router.post("/refresh", refreshAccessToken)
router.post("/login", login)
router.post("/register", register)

router.post("/staff/register", staffRegister)

// PROTECTED
// ADMIN, RECEPTIONIST & GUEST
router.get("/me", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), getMyDetails)

// PROTECTED
// ADMIN ONLY -> need to create middleware for ensure the req is from ADMIN
//router.post("/admin/register", authenticate, authorization(Role.ADMIN), adminRegister)

export default router
