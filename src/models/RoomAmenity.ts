import mongoose, { Document, Schema } from "mongoose";

export interface IRoomAmenity extends Document {
    _id: mongoose.Types.ObjectId,
    roomid: mongoose.Types.ObjectId,
    roomamenityname: string,
    //category?: string,
    iconName?: string
}

const roomAmenitySchema = new Schema<IRoomAmenity>(
    {
        roomid: { type: Schema.Types.ObjectId, ref: "Room", required: true },  // mongodb is non-relational db. so need to define a relationship (relationship vage ekak) between room & room amenity
        roomamenityname: { type: String, required: true, unique: true },
        //category: { type: String, required: true },
        iconName: { type: String, required: true }
    },
    {
        timestamps: true
    }
)

export const RoomAmenity = mongoose.model<IRoomAmenity>("RoomAmenity", roomAmenitySchema)