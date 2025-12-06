import axios from "axios";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { AuthRequest } from "../middlewares/auth";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;

export const aiGeneratedRoomDescription = async (req: AuthRequest, res: Response) => {
  try {
    const { typename, maxadults, maxchild } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized Access..!" });
    }

    if (!typename || maxadults === undefined || maxchild === undefined) {
      return res.status(400).json({ message: "typename, maxadults, and maxchild are required." });
    }

    const maxpersons = Number(maxadults) + Number(maxchild);

    // Construct the prompt for Gemini
    const prompt = `
        Generate a short, clear, and professional hotel room description using the following data:

        Room Type: ${typename}
        Max Adults: ${maxadults}
        Max Children: ${maxchild}
        Total Capacity: ${maxpersons}

        Guidelines:
        - Keep the tone professional, simple, and guest-friendly.
        - Explain who the room is suitable for (solo travelers, couples, families, groups, etc.) based on capacity.
        - Mention comfort and essential amenities in general terms (no specific features).
        - Length should be 15–20 words max.
        - Do NOT repeat the room type name inside the description.
        - No quotes, no bullet points, no lists.
    `;

    // Call Gemini API
    const aiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ],
        generationConfig: {
          maxOutputTokens: 150
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        }
      }
    );

    // Extract generated text
    const generatedContent =
      aiResponse.data?.candidates?.[0]?.content?.[0]?.text ||
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No description generated";

    res.status(200).json({
      description: generatedContent.trim()
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "AI generation failed" });
  }
};


export const aiGeneratedAmenityDescription = async (req: AuthRequest, res: Response) => {

  try {
    
    const { amenityname } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized Access..!" });
    }

    if (!amenityname) {
      return res.status(400).json({ message: "Amenity cannot be empty..!" });
    }

    // Construct the prompt for Gemini
    const prompt = `
        Generate a SINGLE short hotel amenity description in this format:

        [Adjective] [Amenity] [short purpose phrase].

        STRICT RULES:
        - Output must start with one adjective.
        - Output must include the amenity name.
        - Output must end with a short purpose phrase.
        - Output MUST be one sentence only.
        - No quotes, no bullet points, no lists.
        - 8–12 words maximum.

       Amenity: ${amenityname}
  `;


    // Call Gemini API
    const aiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
            {
              parts: [{ text: prompt }]
            }
        ],
        generationConfig: { maxOutputTokens: 50 }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        }
      }
    );

    // Extract generated text
    const generatedDesc =
      aiResponse.data?.candidates?.[0]?.content?.[0]?.text ||
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No description generated";

    res.status(200).json({
      description: generatedDesc.trim()
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "AI generation failed" });
  }

};