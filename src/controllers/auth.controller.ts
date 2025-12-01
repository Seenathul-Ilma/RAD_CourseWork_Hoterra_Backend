import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import { IUser, Role, Status, User } from "../models/User"
import { signAccessToken, signRefreshToken } from "../utils/tokens"
import { AuthRequest } from "../middlewares/auth"

import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const register = async (req: Request, res: Response ) => {
    
    try {
        const {firstname, lastname, email, password, role } = req.body

        if(!firstname || !lastname || !email || !password || !role) {
            return res.status(400).json({ message: "Ooopsss.. All fields are required..!" })
        }

        //if( role !== Role.GUEST && role !== Role.PROPERTY_OWNER ) {
        if( role !== Role.GUEST && role !== Role.RECEPTIONIST ) {
            return res.status(400).json({ message: `Oooppss.. ${role} is not a valid role.` })
        }

        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.status(400).json({ message: "Email already exists. Try logging in or use a different email." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        //const accountstatus = role === Role.PROPERTY_OWNER ? Status.PENDING : Status.ACTIVE
        const accountstatus = role === Role.RECEPTIONIST ? Status.PENDING : Status.ACTIVE

        const newUser = new User ({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            roles: [role],
            accountstatus
        })

        await newUser.save()

        res.status(201).json({
            message: 
                //role === Role.PROPERTY_OWNER
                role === Role.RECEPTIONIST
                    ? "Registration successful.! Your receptionist account is under review and will be activated soon."
                    : "Successfully registered..!",
            data: {
                id: newUser._id,
                email: newUser.email,
                roles: newUser.roles,
                accountstatus: newUser.accountstatus
            }
        })

        console.log("Successfully registered..!")

    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

export const refreshAccessToken = async (req: Request, res: Response) => {
    try {

        const { refreshToken } = req.body  // req body eken refreshToken eka eliyta gannnawa
        if(!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required..!" })
        }

        // token eka ethule hangagena hitapu data tika payload ekata araganna
        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
        
        const currentUser = await User.findById(payload.sub)
        if(!currentUser) {
            return res.status(404).json({ message:"Cannot find user..!" })
        }

        const newAccessToken = signAccessToken(currentUser)

        res.status(200).json({
            message: "New access token has been generated successfully..!",
            data: {
                accessToken: newAccessToken
            }
        })

        /* res.status(200).json({
            accessToken: newAccessToken
        }) */
    } catch (err) {
        console.error(err)
        res.status(403).json({ message: "Invalid or expired refresh token..!" })
    }
}

export const login = async (req: Request, res: Response) => {
    try{

        const { email, password } = req.body

        const existingUser = await User.findOne({ email })
        if(!existingUser) {
            return res.status(401).json({ message: "Invalid Credentials..!" })
        }

        const validPassword = await bcrypt.compare(password, existingUser.password)

        if(!validPassword) {
            return res.status(401).json({ message: "Incorrect Password..!" })
        }

        const accessToken = signAccessToken(existingUser)
        const refreshToken = signRefreshToken(existingUser)

        res.status(200).json({
            message: "Login Successful..!",
            data: {
                email: existingUser.email,
                role: existingUser.roles,
                accessToken, // token (accessToken)
                refreshToken // refreshToken
            }
        })

    } catch(err: any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

export const getMyDetails = async (req: AuthRequest, res: Response) => {

    if(!req.user) {
        return res.status(401).json({ message: "Oooppss.. Unauthorized Access..!" })
    }

    const userId = req.user.sub
    const user = ((await User.findById(userId).select("-password")) as IUser) || null

    if(!user) {
        return res.status(404).json({ message: "Cannot find user..!" })
    }

    const { firstname, lastname, email, roles, accountstatus } = user

    res.status(200).json({
        message: "OK",
        data: { firstname, lastname, email, roles, accountstatus }
    })
}

export const adminRegister = async (req: AuthRequest, res: Response) => {
    try {

        if(!req.user) {
            return res.status(403).json({ message: "Oooppss.. Unauthorized Access..!" })
        }

        const { firstname, lastname, email, password } = req.body

        if(!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "Oooppss.. All fields are required..!" })
        }

        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.status(400).json({ message: "Email already exist..!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User ({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            roles: [Role.ADMIN],
            accountstatus: Status.ACTIVE
        })

        await newUser.save()

        res.status(201).json({
            message: "Admin registration successful..!",
            data: {
                id: newUser._id,
                email: newUser.email,
                roles: newUser.roles,
                accountstatus: Status.ACTIVE
            }
        })  
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

