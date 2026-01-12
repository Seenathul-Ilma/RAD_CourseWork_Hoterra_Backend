import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import { IUser, Role, Status, User } from "../models/User"
import { signAccessToken, signRefreshToken } from "../utils/tokens"
import { AuthRequest } from "../middlewares/auth"
import { Invitation, InviteRole } from "../models/Invitation"

import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const register = async (req: Request, res: Response ) => {
    
    try {
        const {firstname, lastname, email, phone, password, role } = req.body

        if(!firstname || !lastname || !email || !phone || !password || !role) {
            return res.status(400).json({ message: "Ooopsss.. All fields are required..!" })
        }

        //if( role !== Role.GUEST && role !== Role.PROPERTY_OWNER ) {
        //if( role !== Role.GUEST && role !== Role.RECEPTIONIST ) {
        if( role !== Role.GUEST) {
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
            phone,
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

        if (existingUser.accountstatus !== Status.ACTIVE) {
            return res.status(403).json({
                message: "Your account is not active. Please contact admin."
            });
        }

        const accessToken = signAccessToken(existingUser)
        const refreshToken = signRefreshToken(existingUser)

        res.status(200).json({
            message: "Login Successful..!",
            data: {
                email: existingUser.email,
                role: existingUser.roles,
                accountstatus: existingUser.accountstatus, // Include this
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

        const { firstname, lastname, email, phone, password } = req.body

        if(!firstname || !lastname || !email || !phone || !password) {
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
            phone,
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


export const staffRegister = async (req: Request, res: Response) => {
    try {
 
        const { firstname, lastname, email, phone, password, role, token } = req.body

        if(!firstname || !lastname || !email || !password || !role || !token) {
            return res.status(400).json({ message: "Oooppss.. All fields are required..!" })
        }

        console.log("Checking invitation for:", email, token, new Date());

        if( role !== InviteRole.ADMIN && role !== InviteRole.RECEPTIONIST ) {
            return res.status(400).json({ message: `Oooppss.. ${role} is not a valid role.` })
        }

        // Find the invitation by token (regardless of email first)
        const invitation = await Invitation.findOne({ token, isUsed: false, expiryDate: { $gt: new Date() } });

        console.log("Found unused/unexpired invitation (null or !null): ", invitation);

        if (!invitation) {
            return res.status(400).json({ message: "Invalid or expired invitation token." });
        }

        // Validate that the registration email matches the invitation email
        if (invitation.email !== email) {
            return res.status(400).json({ message: "Registration email does not match the invitation email." });
        }

        const existingUser = await User.findOne({ email })
        if(existingUser) {
            //return res.status(400).json({ message: "Email already exist..!" })
            // Only allow if user is currently a 'GUEST'
            if (!existingUser.roles.includes(Role.GUEST)) {
                return res.status(400).json({ message: "This email is already registered with a higher role. Try logging in or use a different one." });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const validInviteRoles = Object.values(InviteRole) as string[];
        //const userRole = validInviteRoles.includes(role) ? role : InviteRole.RECEPTIONIST;

        if (!validInviteRoles.includes(role)) {
            throw new Error("Invalid role");
        }
        const userRole = role;

        // Assign account status based on role
        const user_acc_status = userRole === InviteRole.ADMIN ? Status.ACTIVE : Status.PENDING;

        const newUser = new User ({
            firstname,
            lastname,
            email,
            phone,
            password: hashedPassword,
            roles: [userRole],
            accountstatus: user_acc_status
        })

        await newUser.save()

        // Mark invitation as used
        invitation.isUsed = true;
        invitation.usedAt = new Date();
        await invitation.save();

        res.status(201).json({
            message: 
                //role === Role.PROPERTY_OWNER
                role === InviteRole.RECEPTIONIST
                    ? "Registration successful.! Your receptionist account is under review and will be activated soon."
                    : `${role} registration successful..!`,
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
}

export const getStaffUsers = async (req: AuthRequest, res: Response) => {
  try {

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.user.roles.includes(Role.ADMIN)) {
        return res.status(403).json({ message: "Admin access only" });
    }


    const { role, page = 1, limit = 10 } = req.query;

    if (!role || ![Role.ADMIN, Role.RECEPTIONIST].includes(role as Role)) {
      return res.status(400).json({ message: "Invalid or missing role" });
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const filter = {
      roles: role
    };

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("firstname lastname email phone accountstatus")
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 }),

      User.countDocuments(filter)
    ]);

    const formattedUsers = users.map(user => ({
      id: user._id,
      name: `${user.firstname} ${user.lastname}`,
      email: user.email,
      phone: user.phone,
      status: user.accountstatus
    }));

    res.status(200).json({
      message: "Staff users fetched successfully",
      data: formattedUsers,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const deleteStaffUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.user.roles.includes(Role.ADMIN)) {
        return res.status(403).json({ message: "Admin access only" });
    }


    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting guests or self
    if (!user.roles.includes(Role.ADMIN) && !user.roles.includes(Role.RECEPTIONIST)) {
      return res.status(400).json({ message: "Only staff users can be deleted" });
    }

    if (user._id.toString() === req.user.sub) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "Staff user deleted successfully"
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updatStaffAccountStatus = async (req: AuthRequest, res: Response) => {

    console.log("UPDATE STATUS ROUTE HIT - ID:", req.params.id);  
  console.log("UPDATE STATUS BODY:", req.body);  

    try {
        const { id } = req.params;
        const { status } = req.body;
    
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized access!" });
        }

        if (!req.user.roles.includes(Role.ADMIN)) {
            return res.status(403).json({ message: "Admin access only" });
        }
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid User ID." });
        }
    
        if (!Object.values(Status).includes(status)) {
          return res.status(400).json({ message: "Invalid account status." });
        }
    
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ message: "Staff not found." });
        }
    
       const validTransitions: Record<Status, Status[]> = {
          PENDING: [Status.ACTIVE, Status.BLOCKED],
          ACTIVE: [Status.BLOCKED],
          BLOCKED: [Status.ACTIVE],
        };
    
        if (!validTransitions[user.accountstatus].includes(status)) {
          return res.status(400).json({
            message: `Cannot change status from ${user.accountstatus} to ${status}`,
          });
        }
    
        /* ---------------- UPDATE USER ACCOUNT STATUS ---------------- */
        user.accountstatus = status;
        await user.save();
    
        return res.status(200).json({
          message: "User account status updated successfully",
          data: user,
        });
      } catch (err: any) {
        console.error("Update account status Error:", err);
        return res.status(500).json({ message: err.message });
      }
}