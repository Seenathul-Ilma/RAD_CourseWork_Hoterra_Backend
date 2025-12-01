import mongoose, { Document, Schema } from "mongoose";

export interface IRoomType extends Document{
    _id: mongoose.Types.ObjectId,
    typename: string,
    baseprice: number,
    description: string,
    maxadults: number,
    maxchild: number,
    maxpersons: number
}

const roomTypeSchema = new Schema<IRoomType>(
    {
        typename: { type: String, required: true, unique: true },
        baseprice: { type: Number, required: true },
        description: { type: String, required: true },

        maxadults: { type: Number, required: true, default: 1 },
        maxchild: { type: Number, required: true, default: 0 },

        maxpersons: { 
            type: Number, 
            required: true,
            // auto calculate maxpersons
            default: function () {
                return this.maxadults + this.maxchild;
            }
        }
    },
    {
        timestamps: true
    }
)

export const RoomType = mongoose.model<IRoomType>("RoomType", roomTypeSchema)