import { Request, Response } from "express";
import mongoose from "mongoose";
import { Availability, Room } from "../models/Room";
import { Booking, BookingStatus } from "../models/Booking";
import { RoomType } from "../models/RoomType";
import { AuthRequest } from "../middlewares/auth";
import { Role, User } from "../models/User";

export const getAllBookings = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized Access" });
        }

        const user = await User.findById(req.user.sub);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch bookings
        let bookings;
        if (user.roles.includes(Role.GUEST)) {
            // Guest - only see their own bookings
            bookings = await Booking.find({ guest_id: user._id })
                //.populate("room_id", "roomnumber floor availability roomtype")
                .populate("room_id")
                .sort({ check_in: 1 });
        } else if (user.roles.includes(Role.ADMIN) || user.roles.includes(Role.RECEPTIONIST)) {
            // Staff → see all bookings
            bookings = await Booking.find()
                //.populate("room_id", "roomnumber floor availability roomtype")
                .populate("room_id")
                //.populate("guest_id", "firstname lastname email phone")
                .populate("guest_id")
                .sort({ check_in: 1 });
        }

        res.json({
            message: "Bookings fetched successfully",
            data: bookings
        });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
    try {

        const { id } = req.params;

        if(!req.user) {
            return res.status(401).json({ message: "Oooppss.. Unauthorized Access..!" })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid booking ID." });
        }

        const booking = await Booking.findById(id)
            .populate("room_id", "roomnumber floor availability roomtype");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        res.json({
            message: "Booking fetched successfully",
            data: booking
        });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const createBooking = async (req: AuthRequest, res: Response) => {

    try {

        //const { guest_id, guest_name, guest_email, guest_phone, room_id, check_in, check_out } = req.body;
        const { guest_name, guest_email, guest_phone, room_id, check_in, check_out } = req.body;

        if(!req.user) {
            return res.status(401).json({ message: "Oooppss.. Unauthorized Access..!" })
        }

        const user = await User.findById(req.user.sub);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Validate room
        if (!room_id || !mongoose.Types.ObjectId.isValid(room_id)) {
            return res.status(400).json({ message: "Invalid room ID." });
        }

        const room = await Room.findById(room_id);
        if (!room) return res.status(404).json({ message: "Room not found." });

        // 1. Booking by a registered guest (guest id)
        // 2. Admin/receptionist can create a booking for walk-ins.

        // So, Guest can be:
        //  - Registered Guest - guest_id required
        //  - Walk-in Guest - guest_name & email or phone required

        let finalGuestId: mongoose.Types.ObjectId | undefined = undefined;
        let finalGuestName = guest_name || null;
        let finalGuestEmail = guest_email || null;
        let finalGuestPhone = guest_phone || null;

        if (user?.roles.includes(Role.GUEST)) {
            // Registered GUEST cannot book for others - only for themselves
            finalGuestId = user?._id;
            finalGuestName = `${user?.firstname} ${user?.lastname}`;
            finalGuestEmail = user?.email || "";
            finalGuestPhone = user?.phone || "";

        } else if (user.roles.includes(Role.ADMIN) || user.roles.includes(Role.RECEPTIONIST)) {
            // ADMIN / RECEPTIONIST - can book for walk-ins
            if (!guest_name) {
                return res.status(400).json({ message: "Walk-in guest name is required." });
            }
            if (!guest_email && !guest_phone) {
                return res.status(400).json({ message: "Walk-in guests must provide email or phone." });
            }
        }

        // Validate check-in/out dates
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({ message: "Invalid check-in or check-out date." });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ message: "Check-out date must be after check-in date." });
        }

        // Check room availability for the given period
        const overlappingBookings = await Booking.find({
            room_id,
            bookingstatus: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
            check_in: { $lt: checkOutDate },
            check_out: { $gt: checkInDate } 
        });

        if (overlappingBookings.length > 0) {
            return res.status(400).json({ message: "Room is not available for the selected dates." });
        }

        // Fetch room type to calculate price
        const roomType = await RoomType.findById(room.roomtype);
        if (!roomType) return res.status(404).json({ message: "Room type not found." });

        // Calculate total price: number of nights * price per night
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const total_price = nights * roomType.pricepernight;


        /* let bookingstatus = BookingStatus.PENDING
        if (user?.roles.includes(Role.ADMIN) || user?.roles.includes(Role.RECEPTIONIST)) {
            bookingstatus = BookingStatus.CONFIRMED; // staff/admin booking
        } */

        // Create booking
        const booking = new Booking({
            guest_id: finalGuestId ?? null,
            guest_name: finalGuestName,
            guest_email: finalGuestEmail,
            guest_phone: finalGuestPhone,
            room_id,
            check_in: checkInDate,
            check_out: checkOutDate,
            bookingstatus: BookingStatus.PENDING,
            total_price
        });

        await booking.save();

        // Populate room info in response
        //await booking.populate("room_id");

        res.status(201).json({
            message: "Booking created successfully.",
            data: booking
        });

    } catch (err: any) {
        res.status(500).json({ message: err?.message });
    }

}

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;  // updating status

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized Access!" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid booking ID." });
        }

        if (!Object.values(BookingStatus).includes(status)) {
            return res.status(400).json({ message: "Invalid booking status." });
        }

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        const room = await Room.findById(booking.room_id);
        if (!room) {
            return res.status(404).json({ message: "Associated room not found." });
        }

        //valid status transitions
        const validTransitions: Record<BookingStatus, BookingStatus[]> = {
            PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
            CONFIRMED: [BookingStatus.CHECKED_IN, BookingStatus.CANCELLED],
            CHECKED_IN: [BookingStatus.CHECKED_OUT],
            CHECKED_OUT: [],
            CANCELLED: []
        };

        if (!validTransitions[booking.bookingstatus].includes(status)) {
            return res.status(400).json({
                message: `Cannot change status from ${booking.bookingstatus} to ${status}`
            });
        }

        booking.bookingstatus = status;
        await booking.save();

        if (status === BookingStatus.PENDING || status === BookingStatus.CONFIRMED) {
            room.availability = Availability.BOOKED;
        }

        if (status === BookingStatus.CHECKED_IN) {
            room.availability = Availability.OCCUPIED;
        }

        if (status === BookingStatus.CHECKED_OUT || status === BookingStatus.CANCELLED) {
            const activeBookings = await Booking.find({
                room_id: room._id,
                bookingstatus: {
                    $in: [
                        BookingStatus.PENDING,
                        BookingStatus.CONFIRMED,
                        BookingStatus.CHECKED_IN
                    ]
                },
                _id: { $ne: booking._id }
            });

            room.availability =
                activeBookings.length > 0
                    ? Availability.BOOKED
                    : Availability.AVAILABLE;
        }

        await room.save();

        res.status(201).json({ 
            message: "Booking status updated successfully",
            data: booking
        });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

//export const deleteBooking = async (req: Request, res: Response) => {}
