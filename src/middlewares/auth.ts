import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

export interface AuthRequest extends Request {
    user?: any
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization

    if(!authHeader) {
        return res.status(401).json({ message: "No token provided..!" })
    }

    // Bearer eghtjuk7ythtgrd
    const token = authHeader.split(" ")[1] // ["Bearer", "eghtjuk7ythtgrd"]  --> [1] - eghtjuk7ythtgrd  (to get the token only)

    try {
        const payload = jwt.verify(token, JWT_SECRET)
        req.user = payload
        next()
    } catch (err) {
        res.status(401).json({ message: "Token expired or invalid..!" })
        //res.status(403).json({ message: "Token expired or invalid..!" })
    }
}