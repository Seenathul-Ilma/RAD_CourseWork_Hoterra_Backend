import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { RoomType } from "../models/RoomType";
import cloudinary from "../config/cloudinary";

export const getAllRoomType = async (req: Request, res: Response) => {
    
}

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
    try {
        const { id } = req.params
        const { typename, baseprice, description, maxadults, maxchild } = req.body
    
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized Access..!" });
        }

        const roomType = await RoomType.findById(id);
        if (!roomType) {
            return res.status(404).json({ message: "Room type not found." });
        }

        if (typename && typename.trim() !== roomType.typename) {
            const exists = await RoomType.findOne({ typename: typename.trim() });
            if (exists) {
                return res.status(409).json({ message: "Room type already exists." });
            }
            roomType.typename = typename.trim();
        }

        if (baseprice) {
            roomType.baseprice = baseprice
        }

        if (description) {
            roomType.description = description
        }

        if (maxadults !== undefined) {
            roomType.maxadults = maxadults
        }

        if (maxchild !== undefined) {
            roomType.maxchild = maxchild
        }

        // Handle new image uploads
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {

            for (const url of roomType.roomTypeImageURLs) {
                const parts = url.split("/");
                const fileName = parts.pop()!; // abcxyz.jpg
                const publicId = "rooms/" + fileName.split(".")[0]; // rooms/abcxyz

                await cloudinary.uploader.destroy(publicId);
            }

            const newImageURLs: string[] = [];

            for (const file of req.files) {
                const result: any = await new Promise((resolve, reject) => {
                    const upload_stream = cloudinary.uploader.upload_stream(
                        { folder: "rooms" },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );
                    upload_stream.end(file.buffer);
                });
                newImageURLs.push(result.secure_url);
            }

            // when append new images to existing set
            //roomType.roomTypeImageURLs = [...roomType.roomTypeImageURLs, ...newImageURLs];

            // replace image set completely
            roomType.roomTypeImageURLs = newImageURLs;

        }

        await roomType.save()

        res.status(200).json({
            message: "Room type updated successfully.",
            data: roomType,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: err?.message });
    }
}

export const deleteRoomType = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized Access..!" });
        }

        const roomType = await RoomType.findById(id);
        if (!roomType) {
            return res.status(404).json({ message: "Room type not found." });
        }

        if (roomType.roomTypeImageURLs && roomType.roomTypeImageURLs.length > 0) {

            for (const url of roomType.roomTypeImageURLs) {
                const publicId = url.split("/").pop()?.split(".")[0]; // extract public_id

                await cloudinary.uploader.destroy(`rooms/${publicId}`)
                    .catch(() => {}); // avoid crash if image not found
            }
        }

        
        await RoomType.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Room type deleted successfully."
        });

    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: err?.message });
    }
}