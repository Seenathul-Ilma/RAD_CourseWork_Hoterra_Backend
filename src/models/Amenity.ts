import mongoose, { Document, Schema } from "mongoose";

export interface IAmenity extends Document {
    _id: mongoose.Types.ObjectId,
    amenityname: string,
    description: string
}

const amenitySchema = new Schema<IAmenity>(
    {
        amenityname: { type: String, required: true, unique: true },
        description: { type: String, required: true }
    },
    {
        timestamps: true
    }
)

export const Amenity = mongoose.model<IAmenity>("Amenity", amenitySchema)