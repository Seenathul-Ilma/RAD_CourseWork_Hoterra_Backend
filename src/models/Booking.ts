import mongoose, { Document, Schema } from "mongoose";

export enum BookingStatus {
    PENDING = "PENDING",           // reserved, not yet confirmed
    CONFIRMED = "CONFIRMED",       // confirmed booking
    CANCELLED = "CANCELLED",
    //COMPLETED = "COMPLETED",
    CHECKED_IN = "CHECKED_IN",
    CHECKED_OUT = "CHECKED_OUT"
}

// Bookings linked to a registered guest (guest_id) or a guest without an account (using guest_name, guest_email, guest_phone).
export interface IBooking extends Document {
    _id: mongoose.Types.ObjectId;
    guest_id?: mongoose.Types.ObjectId;   // FK - User
    guest_name: string;
    guest_email?: string;
    guest_phone?: string;
    room_id: mongoose.Types.ObjectId;    // FK - Room
    check_in: Date;
    check_out: Date;
    bookingstatus: BookingStatus;
    total_price: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        guest_id: { type: Schema.Types.ObjectId, ref: "User", required: false },
        
        guest_name: { type: String, required: true },
        guest_email: { type: String, required: false },
        guest_phone: { type: String, required: false },

        room_id: { type: Schema.Types.ObjectId, ref: "Room", required: true },

        check_in: { type: Date, required: true },
        check_out: { type: Date, required: true },

        bookingstatus: {
            type: String,
            enum: Object.values(BookingStatus),
            default: BookingStatus.PENDING
        },

        total_price: { type: Number, required: true, min: 0 }
    },
    { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);