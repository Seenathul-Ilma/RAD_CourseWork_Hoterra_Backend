import { Response, NextFunction } from "express"
import { Role } from "../models/User"
import { AuthRequest } from "./auth"

/* export interface AuthorizationRequest extends Request {
    user?: any
} */

export const authorization = (...allowedRoles: string[]) => {
    //return ( req: AuthorizationRequest, res: Response, next: NextFunction ) => {
    return ( req: AuthRequest, res: Response, next: NextFunction ) => {

        try {
            const userRoles = req.user?.roles

            if(!userRoles || !req.user){
                return res.status(401).json({ message: "Unauthenticated user.." })
            }

            const isAllowedUser = userRoles.some((userRole:string) => 
                allowedRoles.includes(userRole)
            )

            if (isAllowedUser) {
                next()
            } else {
                return res.status(403).json({ message: `Forbidden: Only users with roles [${allowedRoles.join(', ')}] have access.` })
            }
        } catch (err) {
            return res.status(500).json({ message: `Authorization error: ${err}` })
        }
    }
}