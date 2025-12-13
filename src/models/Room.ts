import mongoose, { Document, Schema } from "mongoose";

export enum Availability {
    AVAILABLE = "AVAILABLE",
    BOOKED = "BOOKED",
    OCCUPIED = "OCCUPIED",
    //CLEANING = "CLEANING",
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE"
}

export interface IRoom extends Document{
    _id: mongoose.Types.ObjectId,
    roomtype: mongoose.Types.ObjectId,    // to store roomtypes's id
    roomnumber: number,
    floor: number,                 
    //pricepernight: number,
    availability: Availability,
    //roomamenities: mongoose.Types.ObjectId,
    //additionalamenities: string[]
    roomamenities: string[]
    createdAt?: Date
    updatedAt?: Date
}

const roomSchema = new Schema<IRoom>(
    {
        roomtype: { type: Schema.Types.ObjectId, ref: "RoomType", required: true },
        roomnumber: { type: Number, required: true, unique: true },
        floor: { type: Number, required: true },
        //pricepernight: { type: Number, required: true },
        availability: { 
            type: String,
            enum: Object.values(Availability),
            default: Availability.AVAILABLE 
        },
        //roomamenities: [{ type: Schema.Types.ObjectId, ref: "RoomAmenity" }],
        //additionalamenities: { type: [String], default: [] } 
        roomamenities: { type: [String], default: [] } // default empty array
    },
    {
        timestamps: true
    }
)

export const Room = mongoose.model<IRoom>("Room", roomSchema)