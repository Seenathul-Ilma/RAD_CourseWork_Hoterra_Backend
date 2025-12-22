import { Request, Response } from "express"
import { AuthRequest } from "../middlewares/auth"
import { Amenity } from "../models/Amenity"
import { getAmenityCategory, getAmenityIcon } from "../utils/amenity.mapper"


export const getAllAmenity = async (req: Request, res: Response) => {
    try {

        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10

        const skip = (page - 1) * limit

        const amenities = await Amenity.find()
        .sort({ amenityname : 1})   // to get in asc order (-1 for DESC Order)
        .skip(skip)   // ignore data for pagination
        .limit(limit)  // currently needed data count

        const total = await Amenity.countDocuments()  // to get total document count
        
        res.status(200).json({
            message: "Amenities retrieved successfully..!",
            data: amenities,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
        })
        
    } catch (err:any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }    
}

export const saveAmenity = async (req: AuthRequest, res: Response) => {
    try {
        const { amenityname, description } = req.body;
        
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized Access..!" });
        }

        if (!amenityname || !description) {
            return res.status(400).json({
                message: "Amenity name and description are required."
            });
        }

        // Normalize for checking duplicates (ignore case and spaces)
        //const normalizedName = amenityname.trim().toLowerCase().replace(/\s+/g, "").replace(/-/g, "");

        // Get all amenities and check for duplicates manually
        /* const allAmenities = await Amenity.find({});
        const duplicate = allAmenities.find(a => 
            a.amenityname.trim().toLowerCase().replace(/\s+/g, "").replace(/-/g, "") === normalizedName
        ); */

        const normalize = (str: string) => 
            str.trim().toLowerCase().replace(/[\s-]/g, ''); // remove spaces and dashes            

        const duplicate = await Amenity.findOne({
            $expr: {
                $eq: [
                {
                    $replaceAll: {
                    input: {
                        $replaceAll: {
                        input: { $toLower: "$amenityname" },  // convert DB value to lowercase
                        find: "-",
                        replacement: ""
                        }
                    },
                    find: " ",
                    replacement: ""
                    }
                },
                normalize(amenityname) // normalized input
                ]
            }
        });

        if (duplicate) {
            return res.status(409).json({ message: "Amenity already exists." });
        }

        const category = getAmenityCategory(amenityname);
        const iconName = getAmenityIcon(amenityname);

        const amenity = new Amenity({
            amenityname,
            description,
            category,
            iconName
        });

        await amenity.save();

        res.status(201).json({
            message: "Amenity created successfully.",
            data: amenity
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: err?.message });
    }

    console.log("Amenity saved successfully..!");
};


export const updateAmenity = async (req: AuthRequest, res: Response) => {
    try {
            const { id } = req.params
            const { amenityname, description } = req.body
        
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized Access..!" });
            }
    
            const amenity = await Amenity.findById(id);
            if (!amenity) {
                return res.status(404).json({ message: "Amenity not found." });
            }

            if (!amenityname || !description) {
                return res.status(400).json({
                    message: "Amenity name and description are required."
                });
            }

            const normalize = (str: string) =>
                str.trim().toLowerCase().replace(/[\s-]/g, "");
    
            if (amenityname !== amenity.amenityname) {

                const duplicate = await Amenity.findOne({
                    _id: { $ne: id }, // exclude current record
                    $expr: {
                        $eq: [
                            {
                                $replaceAll: {
                                    input: {
                                        $replaceAll: {
                                            input: { $toLower: "$amenityname" },
                                            find: "-",
                                            replacement: ""
                                        }
                                    },
                                    find: " ",
                                    replacement: ""
                                }
                            },
                            normalize(amenityname)
                        ]
                    }
                });

                if (duplicate) {
                    return res.status(409).json({ message: "Amenity already exists." });
                }

                amenity.amenityname = amenityname.trim();
            }
    
            if (description) {
                amenity.description = description
            }
    
            await amenity.save()
    
            res.status(200).json({
                message: "Amenity updated successfully.",
                data: amenity,
            });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ message: err?.message });
        }
}

export const deleteAmenity = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized Access..!" });
        }

        const amenity = await Amenity.findById(id);
        if (!amenity) {
            return res.status(404).json({ message: "Amenity not found." });
        }
        
        await Amenity.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Amenity deleted successfully."
        });

    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: err?.message });
    }    
}