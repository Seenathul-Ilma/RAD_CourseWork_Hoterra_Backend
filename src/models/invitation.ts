// models/Invitation.js
import mongoose, { Document, Schema } from "mongoose";

export enum InviteRole {
    ADMIN="ADMIN",
    RECEPTIONIST="RECEPTIONIST",
}

export interface IInvitation extends Document{
    _id: mongoose.Types.ObjectId,   // _id   (why use underscore in js? - to represent as private variable)
    email: string,
    inviterole: InviteRole,
    token: string,
    isUsed: boolean,
    expiryDate: Date,
    usedAt: Date
}

const invitationSchema = new Schema<IInvitation>(
    {
        email: { type: String, required: true, unique: true },
        inviterole: { type: String, enum: Object.values(InviteRole), required: true, default: InviteRole.RECEPTIONIST },
        token: { type: String, required: true, unique: true },
        isUsed: { type: Boolean, default: false },
        expiryDate: { type: Date, required: true },
        usedAt: { type: Date },
    }, 
    {
        timestamps: true   // createdAt and updatedAt times (according to server located timezone)
    }
);

export const Invitation = mongoose.model<IInvitation>("Invitation", invitationSchema)