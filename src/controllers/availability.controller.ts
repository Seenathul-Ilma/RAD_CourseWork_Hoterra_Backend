import { Request, Response } from "express";
import { Booking } from "../models/Booking";
import { Room } from "../models/Room";
import { RoomType } from "../models/RoomType";


export const getAllAvailableRoomTypesByDate = async (req: Request, res: Response) => {

    try {

        const { check_in, check_out } = req.body;

        if (!check_in || !check_out) {
            return res.status(400).json({ message: "Check-in and Check-out required" });
        }

        // 1. get booked rooms in this range
        const bookedRoomIds = await Booking.find({
            bookingstatus: { $in: ["PENDING", "CONFIRMED"] },
            check_in: { $lt: check_out },
            check_out: { $gt: check_in }
        }).distinct("room_id");

        // 2. find available room types
        const availableRoomTypeIds = await Room.find({
            _id: { $nin: bookedRoomIds }
        }).distinct("roomtype_id");

        const availableRoomTypes = await RoomType.find({
            _id: { $in: availableRoomTypeIds }
        });

    
        res.status(200).json({
            message: "Available rooms fetched successfully",
            data: availableRoomTypes
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: err?.message });
    }

}

export const getAllAvailableRoomsByRoomType = async (req: Request, res: Response) => {

    try {
        

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: err?.message });
    }

}

