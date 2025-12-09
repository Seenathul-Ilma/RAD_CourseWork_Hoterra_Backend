import { Request, Response } from "express"
import { RoomType } from "../models/RoomType";
import { Availability, Room } from "../models/Room";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth";

export const getAllRoom = async (req: Request, res: Response) => {

    try {
        // Query params: /rooms?floor=3&availability=AVAILABLE&type=675a9...&page=1&limit=10
        const { floor, availability, roomtype, sort } = req.query;

        const query: any = {};

        // Filter - floor
        if (floor) query.floor = Number(floor);

        // Filter - availability
        if (availability) query.availability = availability;

        // Filter - room type
        if (roomtype) query.roomtype = roomtype;

        // Sorting options
        let sortOption: any = {};
        if (sort === "price-asc") sortOption.pricepernight = 1;
        if (sort === "price-desc") sortOption.pricepernight = -1;
        if (sort === "roomnumber-asc") sortOption.roomnumber = 1;
        if (sort === "roomnumber-desc") sortOption.roomnumber = -1;

        // Pagination numbers
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10

        const skip = (page - 1) * limit

        const rooms = await Room.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .populate("roomtype", "roomtype") // fetch room type name only
            //.populate("roomamenities") // if someday you make amenities as IDs
        
        const total = await Room.countDocuments(query);

        res.status(200).json({
            message: "Rooms fetched successfully",
            data: rooms,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: err?.message });
    }

}

export const saveRoom = async (req: AuthRequest, res: Response) => {

    try {

        if (!req.user) return res.status(401).json({ message: "Unauthorized access..!" });

        const { roomtype, floor, pricepernight, roomamenities } = req.body;

        if (!roomtype || !floor || !pricepernight) {
            return res.status(400).json({ message: "roomtype, floor no, and pricepernight are required." });
        }

        if (!mongoose.Types.ObjectId.isValid(roomtype)) {
            return res.status(400).json({ message: "Invalid roomtype ID format." });
        }

        const isExist = await RoomType.findById(roomtype);
        
        if (!isExist) {
            return res.status(409).json({ message: "Room type not found." });
        }
        
        // Generate room number: floor*100 + sequence
        const lastRoomOnFloor = await Room.find({ floor })
            .sort({ roomnumber: -1 })
            .limit(1);

        let sequence = 1;
        if (lastRoomOnFloor.length > 0) {
            const lastNumber = lastRoomOnFloor[0].roomnumber;
            sequence = (lastNumber % 100) + 1;
        }

        const roomnumber = floor * 100 + sequence;

        let parsedRoomAmenities: string[] = [];

        if (roomamenities) {
            if (Array.isArray(roomamenities)) {
                parsedRoomAmenities = roomamenities;
            } else if (typeof roomamenities === "string") {
                parsedRoomAmenities = roomamenities
                    .split(",")
                    .map(id => id.trim())
                    .filter(id => id.length > 0);
            }
        }

        const room = new Room({
            roomtype,
            roomnumber,
            floor,
            pricepernight,
            availability: Availability.AVAILABLE,
            roomamenities: parsedRoomAmenities || []
        });

        await room.save();

        res.status(201).json({
            message: "Room created successfully",
            data: room
        });
    
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

export const updateRoom = async (req: AuthRequest, res: Response) => {

    try {
        const { id } = req.params;
        const { roomtype, floor, pricepernight, availability, roomamenities } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized Access..!" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid room ID format." });
        }

        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: "Room not found." });
        }

        if (roomtype) {
            if (!mongoose.Types.ObjectId.isValid(roomtype)) {
                return res.status(400).json({ message: "Invalid roomtype ID format." });
            }

            const roomTypeExist = await RoomType.findById(roomtype);
            if (!roomTypeExist) {
                return res.status(404).json({ message: "Room type not found." });
            }

            room.roomtype = roomtype;
        }

        if (floor && floor !== room.floor) {
            const lastRoomOnFloor = await Room.find({ floor })
                .sort({ roomnumber: -1 })
                .limit(1);

            let sequence = 1;
            if (lastRoomOnFloor.length > 0) {
                sequence = (lastRoomOnFloor[0].roomnumber % 100) + 1;
            }

            const newRoomNumber = floor * 100 + sequence;

            room.floor = floor;
            room.roomnumber = newRoomNumber;
        }

        if (pricepernight !== undefined) room.pricepernight = pricepernight;
        if (availability) room.availability = availability;

        if (roomamenities !== undefined) {
            if (Array.isArray(roomamenities)) {
                room.roomamenities = roomamenities;
            } else if (typeof roomamenities === "string") {
                room.roomamenities = roomamenities
                    .split(",")
                    .map(i => i.trim())
                    .filter(i => i.length > 0);
            }
        }

        await room.save();

        return res.status(200).json({
            message: "Room updated successfully.",
            data: room
        });

    } catch (err: any) {
        console.error("Update Room Error:", err);
        return res.status(500).json({ message: err.message });
    }

}

export const deleteRoom = async (req: AuthRequest, res: Response) => {

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid room ID format." });
        }

        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: "Room not found." });
        }

        await Room.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Room deleted successfully.",
            deletedRoomId: id
        });

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }

}