import { Request, Response } from "express";
import { Booking } from "../models/Booking";
import { Room } from "../models/Room";
import { RoomType } from "../models/RoomType";
import { getAmenityIcon } from "../utils/amenity.mapper";

/* 
export const getAllAvailablityByDate = async (req: Request, res: Response) => {
    try {
        const { check_in, check_out } = req.body;

        // Validate inputs
        if (!check_in || !check_out) {
            return res.status(400).json({ message: "Check-in and Check-out required" });
        }

        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ message: "Check-out date must be after check-in date" });
        }

        // 1. Get booked room IDs in this date range
        const bookedRoomIds = await Booking.find({
            bookingstatus: { $in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
            $and: [
                { check_in: { $lt: checkOutDate } },
                { check_out: { $gt: checkInDate } }
            ]
        }).distinct("room_id");

        console.log("Booked room IDs:", bookedRoomIds);

        // 2. Get available rooms (not in booked list)
        const availableRooms = await Room.find({
            _id: { $nin: bookedRoomIds }
        })
        .select("roomtype floor roomnumber roomamenities");

        console.log("Available rooms:", availableRooms);

        const availableRoomsCounts = availableRooms.length;
        const bookedRoomsCounts = bookedRoomIds.length;

        // 3. Count available rooms grouped by room type
        const roomTypeCountMap: Record<string, number> = {};
        
        availableRooms.forEach((room: any) => {
            const roomTypeId = room.roomtype.toString();
            roomTypeCountMap[roomTypeId] = (roomTypeCountMap[roomTypeId] || 0) + 1;
        });

        console.log("Room type count map:", roomTypeCountMap);

        // 4. Get available room type IDs
        const availableRoomTypeIds = Object.keys(roomTypeCountMap);

        // 5. Fetch room type details
        const availableRoomTypes = await RoomType.find({
            _id: { $in: availableRoomTypeIds }
        });

        // 6. Map room types with their available counts
        const roomTypesWithCounts = availableRoomTypes.map((roomType: any) => ({
            ...roomType.toObject(),
            availableCount: roomTypeCountMap[roomType._id.toString()] || 0
        }));

        // 7. Sort by available count (highest first)
        roomTypesWithCounts.sort((a, b) => b.availableCount - a.availableCount);

        res.status(200).json({
            message: "Available rooms fetched successfully",
            data: roomTypesWithCounts,
            summary: {
                checkIn: checkInDate,
                checkOut: checkOutDate,
                availableRooms,
                totalAvailableRooms: availableRoomsCounts,
                totalBookedRooms: bookedRoomsCounts,
                availableRoomTypes: roomTypesWithCounts.length
            }
        });

    } catch (err: any) {
        console.error("Error fetching available rooms:", err);
        res.status(500).json({ message: err?.message });
    }
}; */

/* 
export const getAllAvailablityByDate = async (req: Request, res: Response) => {
    try {
        const { check_in, check_out } = req.body;

        // Validate inputs
        if (!check_in || !check_out) {
            return res.status(400).json({ message: "Check-in and Check-out required" });
        }

        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ message: "Check-out date must be after check-in date" });
        }

        // 1. Get booked room IDs in this date range
        const bookedRoomIds = await Booking.find({
            bookingstatus: { $in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
            $and: [
                { check_in: { $lt: checkOutDate } },
                { check_out: { $gt: checkInDate } }
            ]
        }).distinct("room_id");

        console.log("Booked room IDs:", bookedRoomIds);

        // 2. Get available rooms (not in booked list)
        const availableRooms = await Room.find({
            _id: { $nin: bookedRoomIds }
        })
        .select("roomtype floor roomnumber roomamenities")
        
        console.log("Available rooms:", availableRooms);

        const availableRoomsCounts = availableRooms.length;
        const bookedRoomsCounts = bookedRoomIds.length;

        // 3. Count available rooms grouped by room type
        const roomTypeCountMap: Record<string, number> = {};
        
        availableRooms.forEach((room: any) => {
            const roomTypeId = room.roomtype.toString();
            roomTypeCountMap[roomTypeId] = (roomTypeCountMap[roomTypeId] || 0) + 1;
        });

        console.log("Room type count map:", roomTypeCountMap);

        // 4. Get available room type IDs
        const availableRoomTypeIds = Object.keys(roomTypeCountMap);

        // 5. Fetch room type details
        const availableRoomTypes = await RoomType.find({
            _id: { $in: availableRoomTypeIds }
        });

        // 6. Map room types with their available counts
        const roomTypesWithCounts = availableRoomTypes.map((roomType: any) => {
            const roomsOfThisType = availableRooms.filter(
                room => room.roomtype.toString() === roomType._id.toString()
            );
            return {
                ...roomType.toObject(),
                availableRoomsOfThisType: roomsOfThisType, // only rooms of this type
                availableCount: roomsOfThisType.length
            };
        });

        // 7. Sort by available count (highest first)
        roomTypesWithCounts.sort((a, b) => b.availableCount - a.availableCount);

        res.status(200).json({
            message: "Available rooms fetched successfully",
            data: roomTypesWithCounts,
            summary: {
                checkIn: checkInDate,
                checkOut: checkOutDate,
                allAvailableRooms: availableRooms,
                totalAvailableRooms: availableRoomsCounts,
                totalBookedRooms: bookedRoomsCounts,
                availableRoomTypes: roomTypesWithCounts.length
            }
        });

    } catch (err: any) {
        console.error("Error fetching available rooms:", err);
        res.status(500).json({ message: err?.message });
    }
};
 */

export const getAllAvailablityByDate = async (req: Request, res: Response) => {
  try {
    //const { check_in, check_out } = req.body;
    const { checkin, checkout, sort } = req.query;

    // Validate inputs
    if (!checkin || !checkout) {
      return res
        .status(400)
        .json({ message: "Check-in and Check-out required" });
    }

    //const checkInDate = new Date(check_in);
    //const checkOutDate = new Date(check_out);
    const checkInDate = new Date(checkin as string);
    const checkOutDate = new Date(checkout as string);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    
    if (checkOutDate <= checkInDate) {
      return res
        .status(400)
        .json({ message: "Check-out date must be after check-in date" });
    }

    /* if (checkIn.getTime() < Date.now() || checkOut.getTime() < Date.now()) {
      return res.status(400).json({
        message: "Check-in date cannot be in the past",
      });
    } */

    const normalizeDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const today = normalizeDate(new Date());
    const checkIn = normalizeDate(checkInDate);
    const checkOut = normalizeDate(checkOutDate);

    if (checkIn < today || checkOut < today) {
      return res.status(400).json({
        message: "Check-in or check-out date cannot be in the past!",
      });
    }

    // 1. Get booked room IDs in this date range
    const bookedRoomIds = await Booking.find({
      bookingstatus: { $in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
      $and: [{ check_in: { $lt: checkOutDate } }, { check_out: { $gt: checkInDate } }],
    }).distinct("room_id");

    // 2. Get available rooms (not in booked list)
    const availableRooms = await Room.find({
      _id: { $nin: bookedRoomIds },
    }).select("roomtype floor roomnumber roomamenities");

    const availableRoomsCounts = availableRooms.length;
    const bookedRoomsCounts = bookedRoomIds.length;

    // 3. Count available rooms grouped by room type
    const roomTypeCountMap: Record<string, number> = {};

    availableRooms.forEach((room: any) => {
      const roomTypeId = room.roomtype.toString();
      roomTypeCountMap[roomTypeId] = (roomTypeCountMap[roomTypeId] || 0) + 1;
    });

    // 4. Get available room type IDs
    const availableRoomTypeIds = Object.keys(roomTypeCountMap);

    // 5. Fetch room type details
    const availableRoomTypes = await RoomType.find({
      _id: { $in: availableRoomTypeIds },
    });

    // 6. Map room types with their available counts
    const roomTypesWithCounts = availableRoomTypes.map((roomType: any) => {
      const roomsOfThisType = availableRooms.filter(
        (room) => room.roomtype.toString() === roomType._id.toString()
      );
      return {
        ...roomType.toObject(),
        availableRoomsOfThisType: roomsOfThisType, // only rooms of this type
        availableCount: roomsOfThisType.length,
      };
    });

    // 7. Sort by price asc, price desc, available count (highest first)
    if (sort === "price-asc") {
      roomTypesWithCounts.sort((a, b) => a.pricepernight - b.pricepernight);
    } else if (sort === "price-desc") {
      roomTypesWithCounts.sort((a, b) => b.pricepernight - a.pricepernight);
    } else {
      // default: most available first
      roomTypesWithCounts.sort((a, b) => b.availableCount - a.availableCount);
    }

    res.status(200).json({
      message: "Available rooms fetched successfully",
      data: roomTypesWithCounts,
      summary: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        //allAvailableRooms: availableRooms,
        totalAvailableRooms: availableRoomsCounts,
        totalBookedRooms: bookedRoomsCounts,
        availableRoomTypes: roomTypesWithCounts.length,
      },
    });
  } catch (err: any) {
    console.error("Error fetching available rooms:", err);
    res.status(500).json({ message: err?.message });
  }
};

export const getAllAvailableRoomsByRoomType = async (
  req: Request,
  res: Response
) => {
  try {
    const { roomtype_id } = req.params;
    //const { check_in, check_out } = req.body;
    const { checkin, checkout } = req.query;

    const roomType = await RoomType.findById(roomtype_id);
    if (!roomType) {
      return res.status(404).json({ message: "Room type not found." });
    }

    //if (!check_in || !check_out) {
    if (!checkin || !checkout) {
      return res.status(400).json({
        message: "check-in, check-out date and roomtype_id are required",
      });
    }

    //const checkInDate = new Date(check_in);
    const checkInDate = new Date(checkin as string);
    //const checkOutDate = new Date(check_out);
    const checkOutDate = new Date(checkout as string);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    const normalizeDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const today = normalizeDate(new Date());
    const checkIn = normalizeDate(checkInDate);
    const checkOut = normalizeDate(checkOutDate);

    if (checkIn < today || checkOut < today) {
      return res.status(400).json({
        message: "Check-in or check-out date cannot be in the past!",
      });
    }

    console.log("checkIn: ", checkIn);
    console.log("checkOut: ", checkOut);

    console.log("checkin: ", checkin);
    console.log("checkout: ", checkout);

    console.log("checkInDate: ", checkInDate);
    console.log("checkOutDate: ", checkOutDate);

    // 1. Find booked rooms in date range
    const bookedRoomIds = await Booking.find({
      bookingstatus: { $in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
      check_in: { $lt: checkOutDate },
      check_out: { $gt: checkInDate },
    }).distinct("room_id");

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 2. Find available rooms for this room type
    const availableRooms = await Room.find({
      roomtype: roomtype_id,
      _id: { $nin: bookedRoomIds },
    })
      .select("floor roomnumber roomamenities")
      .skip(skip)
      .limit(limit);
    //}).select("roomtype floor roomnumber roomamenities");

    const total = await Room.countDocuments({
      roomtype: roomtype_id,
      _id: { $nin: bookedRoomIds },
    });

    const availableRoomsWithAmenityIcons = availableRooms.map((room) => {
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
      message: "Available rooms fetched successfully",
      //data: availableRooms,
      data: availableRoomsWithAmenityIcons,
      summary: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        roomType: roomtype_id,
        availableCount: total,
      },
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err?.message });
  }
};
