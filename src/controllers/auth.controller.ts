import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { Role, Status, User } from "../models/User"

export const register = async (req: Request, res: Response ) => {
    try {
        const {firstname, lastname, email, password, role } = req.body

        if(!firstname || !lastname || !email || !password || !role) {
            res.status(400).json({ message: "Ooopsss.. All fields are required..!" })
        }

        if( role !== Role.GUEST && role !== Role.PROPERTY_OWNER) {
            res.status(400).json({ message: `Oooppss.. ${role} is not a valid role.` })
        }

        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.status(400).json({ message: "Email already exists. Try logging in or use a different email." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const accountstatus = role === Role.PROPERTY_OWNER ? Status.PENDING : Status.ACTIVE

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
                role === Role.PROPERTY_OWNER
                    ? "Registration successful.! Your Property Owner account is under review and will be activated soon."
                    : "Successfully registered..!",
            data: {
                id: newUser._id,
                email: newUser.email,
                roles: newUser.roles,
                accountstatus: newUser.accountstatus
            }
        })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }

    console.log("Successfully registered..!")
}

export const login = async (req: Request, res: Response) => {

}

export const getMyDetails = async (req: Request, res: Response) => {

}

export const adminRegister = async (req: Request, res: Response) => {

}

