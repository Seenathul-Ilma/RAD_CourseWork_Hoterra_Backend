import mongoose, { Document, Schema } from "mongoose";

export enum Role {
    ADMIN="ADMIN",
    PROPERTY_OWNER="PROPERTY_OWNER",
    GUEST="GUEST"
}

export enum Status {
    ACTIVE="ACTIVE",
    PENDING="PENDING",
    BLOCKED="BLOCKED"
}

export interface IUser extends Document{
    _id: mongoose.Types.ObjectId,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    roles: Role[],
    accountstatus: Status
}

const userSchema = new Schema<IUser>(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"] },
        password: { type: String, required: true },
        roles: { type:[String], enum: Object.values(Role), default: [Role.GUEST] },
        accountstatus: { type:String, enum: Object.values(Status), default: Status.PENDING }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model<IUser>("User", userSchema)