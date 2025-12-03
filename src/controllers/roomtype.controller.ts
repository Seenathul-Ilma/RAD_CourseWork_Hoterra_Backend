import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { RoomType } from "../models/RoomType";
import cloudinary from "../config/cloudinary";

export const saveRoomType = async (req: AuthRequest, res: Response) => {

    try {
        const { typename, baseprice, description, maxadults, maxchild } = req.body
        
        if(!req.user){
            return res.status(401).json({ message:"Unauthorized Access..!" })
        }

        if(!typename || !baseprice || !description ) {
            return res.status(400).json({
                message: "typename, baseprice, and description are required."
            });
        }

        const exists = await RoomType.findOne({ typename: typename.trim() });
        if (exists) {
            return res.status(409).json({
                message: "Room type already exists."
            });
        }

        /* if (req.file) {
            const result:any = await new Promise((resolve, reject)=>{
                const upload_stream = cloudinary.uploader.upload_stream(   // cloudinary in-built structure eka
                    {folder: "posts"},    
                    (error,result)=>{
                        if (error) return reject(error)
                        resolve(result)
                    }
                )
                upload_stream.end(req.file?.buffer)
            })
            imageURL = result.secure_url
        } */

        let roomImageURLs: string[] = []

        if(req.files && Array.isArray(req.files)) {
            for(const file of req.files) {
                const result: any = await new Promise((resolve, reject) => {
                    const upload_stream = cloudinary.uploader.upload_stream(
                        { folder: "rooms" },
                        (error,result)=>{
                            if (error) return reject(error)
                            resolve(result)
                        }
                    )
                    upload_stream.end(file.buffer)
                })
                roomImageURLs.push(result.secure_url)
            }
        }

        const maxpersons = (maxadults ?? 1) + (maxchild ?? 0);

        const roomType = new RoomType({
            typename,
            baseprice,
            description,
            roomTypeImageURLs: roomImageURLs,
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