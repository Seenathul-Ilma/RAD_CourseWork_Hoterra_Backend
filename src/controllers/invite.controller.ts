import crypto from "crypto";
import { Role, User } from "../models/User";
import { Invitation, InviteRole } from "../models/invitation";
import { Request, Response } from "express";
import transporter from "../config/transporter";

import dotenv from "dotenv"
import { AuthRequest } from "../middlewares/auth";
dotenv.config()

const HOTERRA_EMAIL_ADDRESS = process.env.HOTERRA_EMAIL_ADDRESS as string

export const createInvitation = async (req: AuthRequest, res: Response) => {
  try {

    if (!req.user || !req.user.roles.includes(Role.ADMIN)) {
      return res.status(403).json({ message: "Unauthorized! Admins only." });
    }

    const { email, inviterole } = req.body;

    if (!email || !inviterole) {
      return res.status(400).json({ message: "Email & role are required!" });
    }

    console.log("inviterole body: "+ inviterole)

    const allowedRoles = Object.values(InviteRole);
    if (!allowedRoles.includes(inviterole)) {
      return res.status(400).json({
        message: `${inviterole} is not an allowed invite role.`,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        // Only allow if user is currently a 'GUEST'
        if (!userExists.roles.includes(Role.GUEST)) {
            return res.status(400).json({ message: "This user already has an account and cannot be invited!" });
        }
    }

    /* const existingInvitation = await Invitation.findOne({ email, isUsed: false, expiryDate: { $gt: new Date() } });
    if (existingInvitation) {
        return res.status(400).json({ message: "An active invitation already exists for this email." });
    } */

    // Delete old invitations for same email
    await Invitation.deleteMany({ email, isUsed: false });

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Create invite (7 days expiration)
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    //const roleToInvite = inviterole || InviteRole.RECEPTIONIST;

    const invitation = new Invitation({
        email,
        inviterole,
        token,
        expiryDate,
        isUsed: false
    })

    await invitation.save()

    console.log("roleToInvite: "+ inviterole)

    // Registration URL (React Frontend - User opens registration with token)
    //const registrationUrl = `http://localhost:5173/register?role=${inviterole}&token=${token}`;
    const registrationUrl = `http://localhost:5173/register?role=${encodeURIComponent(inviterole)}&token=${token}`;

    try {
        const emailInfo = await transporter.sendMail({
            from: HOTERRA_EMAIL_ADDRESS,
            to: email,
            subject: "You’ve been invited to join Hoterra",
            // HTML Content (fully supported)
            html: `
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2 style="color: #e17612ff;">Welcome to Hoterra! 🎉</h2>
                        <p>Hello <strong>Member</strong>,</p>
                        <p>We are excited to have you here.</p>

                        <p>You have been invited to join <strong>Hoterra</strong>. Click the button below to register:</p>
                        <a href="${registrationUrl}" style="padding: 10px 20px; background: linear-gradient(to right, #78350F, #D97706); color: white; text-decoration: none; border-radius: 5px;">
                        Register Now
                        </a>
                        <p style="margin-top: 20px;">
                        Regards,<br>
                        <strong>Hoterra Team</strong>
                        </p>
                    </body>
                </html>
            `,
        })
        
        console.log(`Email successfully sent to: ${emailInfo.accepted[0]}`)
    } catch(err) {
        return console.error(`Email sending failed: ${err}`)
    }

    return res.status(201).json({
      message: "Invitation created successfully!",
      registrationUrl
      //token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const useInvitation = async (req: Request, res: Response) => {

}