import { Router } from "express"
import { register, login, refreshAccessToken, adminRegister, getMyDetails } from "../controllers/auth.controller"

const router = Router()

// PUBLIC
router.post("/refresh", refreshAccessToken)
router.post("/login", login)
router.post("/register", register)

// PROTECTED
// ADMIN, PROPERTY_OWNER & GUEST
router.get("/me", getMyDetails)

// PROTECTED
// ADMIN ONLY -> need to create middleware for ensure the req is from ADMIN
router.post("/admin/register", adminRegister)

export default router
