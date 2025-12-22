import mongoose, { Document, Schema } from "mongoose";

export interface IRoomType extends Document{
    _id: mongoose.Types.ObjectId,
    typename: string,
    //baseprice: number,
    pricepernight: number,
    description: string,
    roomTypeImageURLs: string[],   // to store the urls of the file in db
    maxadults: number,
    maxchild: number,
    maxpersons: number,
    isActive: boolean
}

const roomTypeSchema = new Schema<IRoomType>(
    {
        typename: { type: String, required: true, unique: true },
        //baseprice: { type: Number, required: true },
        pricepernight: { type: Number, required: true },
        description: { type: String, required: true },
        roomTypeImageURLs: { type: [String], default: [] },

        maxadults: { type: Number, required: true, default: 1 },
        maxchild: { type: Number, required: true, default: 0 },

        maxpersons: { 
            type: Number, 
            required: true,
            // auto calculate maxpersons
            default: function () {
                return this.maxadults + this.maxchild;
            }
        },
        isActive : { type: Boolean, required: true, default: true }
    },
    {
        timestamps: true
    }
)

export const RoomType = mongoose.model<IRoomType>("RoomType", roomTypeSchema)