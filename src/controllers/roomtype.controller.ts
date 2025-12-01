import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { RoomType } from "../models/RoomType";
import { Status } from "../models/User";

export const saveRoomType = async (req: AuthRequest, res: Response) => {

    try {
        const { typename, baseprice, description, maxadults, maxchild } = req.body
        
        if(!req.user){
            return res.status(401).json({ message:"Unauthorized Access..!" })
        }

        if(req.user.accountstatus != Status.ACTIVE) {
            return res.status(401).json({ message:"Ooppss.. You don't have access until admin approve your account!" })
        }

        if(!typename || !baseprice || !description ) {
            return res.status(400).json({
                success: false,
                message: "typename, baseprice, and description are required."
            });
        }

        const exists = await RoomType.findOne({ typename: typename.trim() });
        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Room type already exists."
            });
        }

        const maxpersons = (maxadults ?? 1) + (maxchild ?? 0);

        const roomType = new RoomType({
            typename,
            baseprice,
            description,
            maxadults: maxadults ?? 1,
            maxchild: maxchild ?? 0,
            maxpersons
        });

        await roomType.save();

        res.status(201).json({
            message: "Room type created successfully.",
            data: roomType
        });

    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }

    console.log("Roomtype saved successfully..!")
}

export const updateRoomType = async (req: AuthRequest, res: Response) => {
    
}

export const deleteRoomType = async (req: AuthRequest, res: Response) => {

}

export const getAllRoomType = async (req: Request, res: Response) => {
    
}