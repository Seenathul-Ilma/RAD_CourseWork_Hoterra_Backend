import axios from "axios";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;

export const aiGeneratedRoomDescription = async (req: Request, res: Response) => {
  try {
    const { typename, maxadults, maxchild } = req.body;

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
      "No data";

    console.log(res)

    res.status(200).json({
      description: generatedContent.trim()
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "AI generation failed" });
  }
};