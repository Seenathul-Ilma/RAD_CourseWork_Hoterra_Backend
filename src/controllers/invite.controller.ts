import crypto from "crypto";
import { Role, User } from "../models/User";
import { Invitation, InviteRole } from "../models/invitation";
import { Request, Response } from "express";
import transporter from "../config/transpoter";

import dotenv from "dotenv"
dotenv.config()

const HOTERRA_EMAIL_ADDRESS = process.env.HOTERRA_EMAIL_ADDRESS as string

export const createInvitation = async (req: Request, res: Response) => {
  try {
    const { email, inviterole } = req.body;

    console.log("inviterole body: "+ inviterole)

    const userExists = await User.findOne({ email });
    if (userExists) {
        // Only allow if user is currently a 'GUEST'
        if (!userExists.roles.includes(Role.GUEST)) {
            return res.status(400).json({ message: "This user already has an account and cannot be invited!" });
        }
    }

    const existingInvitation = await Invitation.findOne({ email, isUsed: false, expiryDate: { $gt: new Date() } });
    if (existingInvitation) {
        return res.status(400).json({ message: "An active invitation already exists for this email." });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Create invite (7 days expiration)
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const roleToInvite = inviterole || InviteRole.RECEPTIONIST;

    const invitation = new Invitation({
        email,
        inviterole: roleToInvite,
        token,
        expiryDate,
        isUsed: false
    })

    await invitation.save()

    console.log("roleToInvite: "+ roleToInvite)

    // Registration URL (React Frontend - User opens registration with token)
    //const registrationUrl = `http://localhost:5173/register?role=${inviterole}&token=${token}`;
    const registrationUrl = `http://localhost:5173/register?role=${encodeURIComponent(roleToInvite)}&token=${token}`;

    try {
        const emailInfo = await transporter.sendMail({
            from: HOTERRA_EMAIL_ADDRESS,
            to: email,
            subject: "Your Invitation to Join Hoterra",
            // HTML Content (fully supported)
            html: `
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2 style="color: #3a86ff;">Welcome to Hoterra! 🎉</h2>
                        <p>Hello <strong>Member</strong>,</p>
                        <p>We are excited to have you here.</p>

                        <p>Here is your <strong>Hoterra</strong> invite link:</p>
                        <a href="${registrationUrl}" style="padding: 10px 20px; background: #3a86ff; color: #fff; text-decoration: none; border-radius: 5px;">
                        Complete Registration
                        </a>

                        <p style="margin-top: 20px;">
                        Regards,<br>
                        <strong>Hoterra Team</strong>
                        </p>
                    </body>
                </html>
            `,
        })
        
        console.log(`Email sent successfully..! ${emailInfo.messageId}`)
    } catch(err) {
        return console.error(`Email sending failed: ${err}`)
    }

    // Optionally send email here...
    // emailService.send(email, registrationUrl);

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
