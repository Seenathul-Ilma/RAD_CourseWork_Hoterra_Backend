import { Request, Response } from "express";
import { RoomType } from "../models/RoomType";
import { Availability, Room } from "../models/Room";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth";
import { getAmenityIcon } from "../utils/amenity.mapper";

export const getRoomById = async (req: Request, res: Response) => {};

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
    //if (sort === "price-asc") sortOption.pricepernight = 1;
    //if (sort === "price-desc") sortOption.pricepernight = -1;
    if (sort === "roomnumber-asc") sortOption.roomnumber = 1;
    if (sort === "roomnumber-desc") sortOption.roomnumber = -1;

    // Pagination numbers
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const rooms = await Room.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("roomtype", "typename"); // fetch room type name only
    //.populate("roomamenities") // if someday you make amenities as IDs

    const total = await Room.countDocuments(query);

    res.status(200).json({
      message: "Rooms fetched successfully..",
      data: rooms,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err?.message });
  }
};

export const getAllRoomByRoomtype = async (req: Request, res: Response) => {
  try {
    const { roomtypeid } = req.params;
    //const { search, group, sort } = req.query;
    const { group, sort } = req.query;

    const query: any = {};
    const orConditions: any[] = [];

    if (!mongoose.Types.ObjectId.isValid(roomtypeid)) {
      return res.status(400).json({ message: "Invalid room type ID" });
    }

    const isExist = await RoomType.findById(roomtypeid);

    if (!isExist) {
      return res.status(409).json({ message: "Room type not found." });
    }

    /* if (search) {
      // String fields
      orConditions.push({
        availability: { $regex: search, $options: "i" },
      });

      // Array fields
      orConditions.push({
        roomamenities: { $elemMatch: { $regex: search, $options: "i" } },
      });

      // Number fields
      if (!isNaN(Number(search))) {
        const num = Number(search);
        orConditions.push({ floor: num });
        orConditions.push({ roomnumber: num });
      }
    } */

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    /* ---------------- GROUP FILTER ---------------- */
    if (group) {
      const g = String(group).toLowerCase();

      if (g === "available") {
        query.availability = Availability.AVAILABLE;
      } else if (g === "booked") {
        query.availability = Availability.BOOKED;
      } else if (g === "occupied") {
        query.availability = Availability.OCCUPIED;
      } else if (g === "undermaintenance") {
        query.availability = Availability.UNDER_MAINTENANCE;
      } else {
        return res.status(400).json({ message: "Invalid grouping..!" });
      }
    }

    /* ---------------- SORTING ---------------- */
    const sortOption: any = {};

    if (sort === "num-asc") sortOption.roomnumber = 1;
    if (sort === "num-desc") sortOption.roomnumber = -1;

    /* ---------------- PAGINATION ---------------- */
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //const rooms = await Room.find(query)
    const rooms = await Room.find({ roomtype: roomtypeid, ...query })
      //.sort(sortOption)
      .sort({ ...sortOption })
      .skip(skip)
      .limit(limit)
      .populate("roomtype", "typename"); // fetch room type name only

    //const total = await Room.countDocuments(query);
    const total = await Room.countDocuments({
      roomtype: roomtypeid,
      ...query,
    });

    const roomsWithAmenityIcons = rooms.map((room) => {
      const amenitiesWithDetails = (room.roomamenities || []).map(
        (amenityName: string) => ({
          name: amenityName,
          icon: getAmenityIcon(amenityName),
        })
      );

      return {
        ...room.toObject(),
        roomamenities: amenitiesWithDetails,
      };
    });

    res.status(200).json({
      message: "Room fetched successfully",
      data: roomsWithAmenityIcons,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllRoomByRoomtypes = async (req: Request, res: Response) => {
  try {
    const { roomtype_id } = req.params;
    const { floor, availability, sort } = req.query;

    if (!mongoose.Types.ObjectId.isValid(roomtype_id)) {
      return res.status(400).json({ message: "Invalid room type ID" });
    }

    const isExist = await RoomType.findById(roomtype_id);

    if (!isExist) {
      return res.status(409).json({ message: "Room type not found." });
    }

    const query: any = {};

    // Filter - floor
    if (floor) query.floor = Number(floor);

    // Filter - availability
    if (availability) query.availability = availability;

    // Filter - room type
    if (roomtype_id) query.roomtype = roomtype_id;

    // Sorting options
    let sortOption: any = {};
    //if (sort === "price-asc") sortOption.pricepernight = 1;
    //if (sort === "price-desc") sortOption.pricepernight = -1;
    if (sort === "roomnumber-asc") sortOption.roomnumber = 1;
    if (sort === "roomnumber-desc") sortOption.roomnumber = -1;

    // Pagination numbers
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const rooms = await Room.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    //.populate("roomtype", "typename") // fetch room type name only
    //.populate("roomamenities") // if someday you make amenities as IDs

    const total = await Room.countDocuments(query);

    res.status(200).json({
      message: "Rooms fetched successfully..",
      data: rooms,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err?.message });
  }
};

export const saveRoom = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Unauthorized access..!" });

    //const { roomtype, floor, pricepernight, roomamenities } = req.body;
    const { roomtype, floor, roomamenities, availability } = req.body;

    //if (!roomtype || !floor) {
    if (
      !roomtype ||
      floor === undefined ||
      floor === null ||
      isNaN(Number(floor))
    ) {
      return res
        .status(400)
        .json({ message: "roomtype, floor no are required." });
    }

    if (floor < 0) {
      return res.status(400).json({ message: "Invalid floor number." });
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

    /* let parsedRoomAmenities: string[] = [];

    if (roomamenities) {
      if (Array.isArray(roomamenities)) {
        parsedRoomAmenities = roomamenities;
      } else if (typeof roomamenities === "string") {
        parsedRoomAmenities = roomamenities
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0);
      }
    } */

    let parsedRoomAmenities: string[] = [];

    if (roomamenities) {
      parsedRoomAmenities =
        typeof roomamenities === "string" && roomamenities.trim() !== ""
          ? roomamenities
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a.length > 0)
          : [];
    }

    if (availability && availability != Availability.AVAILABLE) {
      return res
        .status(400)
        .json({ message: "New rooms should be available." });
    }

    const room = new Room({
      roomtype,
      roomnumber,
      floor,
      //pricepernight,
      availability: availability || Availability.AVAILABLE,
      //roomamenities: parsedRoomAmenities || [],
      //roomamenities: roomamenities.split(","),  // "Wifi,Balcony" -> ["Wifi", "Balcony"]
      roomamenities: parsedRoomAmenities, // "Wifi,Balcony" -> ["Wifi", "Balcony"]
    });

    await room.save();

    res.status(201).json({
      message: "Room created successfully",
      data: room,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err?.message });
  }
};

export const updateRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    //const { roomtype, floor, pricepernight, availability, roomamenities } = req.body;
    const { roomtype, floor, availability, roomamenities } = req.body;

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

    //if (floor && floor !== room.floor) {
    if (floor !== undefined && floor !== room.floor) {
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

    //if (pricepernight !== undefined) room.pricepernight = pricepernight;
    //if (availability) room.availability = availability;
    const lockedAvailabilityStatuses = [
      Availability.BOOKED,
      Availability.OCCUPIED,
    ];

    if (availability !== undefined) {
      // validate enum value
      if (!Object.values(Availability).includes(availability)) {
        return res.status(400).json({ message: "Invalid availability status" });
      }

      // prevent change if locked
      if (
        lockedAvailabilityStatuses.includes(room.availability) &&
        availability !== room.availability
      ) {
        return res.status(400).json({
          message: `Room availability cannot be changed while ${room.availability.toLowerCase()}`,
        });
      }

      // finally assign
      room.availability = availability;
    }

    /* if (availability !== undefined) {
      if (
        room.availability === Availability.UNDER_MAINTENANCE ||
        room.availability === Availability.AVAILABLE
      ) {
        room.availability = availability;
      } else {
        return res.status(400).json({
          message: `Cannot transition from ${room.availability} to ${availability}`,
        });
      }
    } */

    if (roomamenities !== undefined) {
      if (Array.isArray(roomamenities)) {
        room.roomamenities = roomamenities;
      } else if (typeof roomamenities === "string") {
        room.roomamenities = roomamenities
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i.length > 0);
      }
    }

    await room.save();

    return res.status(200).json({
      message: "Room updated successfully.",
      data: room,
    });
  } catch (err: any) {
    console.error("Update Room Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

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

    const lockedAvailabilityStatuses = [
      Availability.BOOKED,
      Availability.OCCUPIED,
    ];

    if (lockedAvailabilityStatuses.includes(room.availability)) {
      return res.status(400).json({
        message: `Cannot delete room while ${room.availability.toLowerCase()}`,
      });
    }

    await Room.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Room deleted successfully.",
      deletedRoomId: id,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
