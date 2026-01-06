import { Router } from "express"
import { register, login, refreshAccessToken, getMyDetails, staffRegister, getStaffUsers, deleteStaffUser } from "../controllers/auth.controller"
import { authenticate } from "../middlewares/auth"
import { authorization } from "../middlewares/roles"
import { Role } from "../models/User"

const router = Router()

// PUBLIC
router.post("/refresh", refreshAccessToken)
router.post("/login", login)

// GUEST ONLY
router.post("/register", register)

// ADMIN & RECEPTIONIST
router.post("/staff/register", staffRegister)

// PROTECTED
// ADMIN, RECEPTIONIST & GUEST
//router.get("/me", authenticate, authorization(Role.ADMIN, Role.RECEPTIONIST), getMyDetails)
router.get("/me", authenticate, getMyDetails)

router.get("/staff", authenticate, authorization(Role.ADMIN), getStaffUsers)

router.delete("/staff/:id", authenticate, authorization(Role.ADMIN), deleteStaffUser)

// PROTECTED
// ADMIN ONLY -> need to create middleware for ensure the req is from ADMIN
//router.post("/admin/register", authenticate, authorization(Role.ADMIN), adminRegister)

export default router
