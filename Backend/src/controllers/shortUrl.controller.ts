import { nanoid } from "nanoid";
import { Request, Response } from "express";
import { Url } from "../model/url.Model";


export const createShortUrl = async (req: Request, res: Response) => {
    try {
        const { url, slug } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. User not authenticated." });
        }
        // If URL already exists in database, return the existing record
        const existingRecord = await Url.findOne({
            originalUrl: url,
            user: req.user.id
        });
        if (existingRecord) {
            return res.status(200).json({ message: "Url fetched successfully", newRec: existingRecord });
        }
        if (slug) {
            const existingShortUrl = await Url.findOne({ shortId: slug });
            if (existingShortUrl) {
                return res.status(400).json({ message: "Custom url already exists" });
            }

            const shortUrl = await Url.create({
                shortId: slug,
                originalUrl: url,
                user: req.user.id
            })
            return res.status(200).json({ message: "Url generate successfully", newRec: shortUrl });
        }


        const shortId: string = nanoid(8);
        const newRec = await Url.create({
            shortId,
            originalUrl: url,
            user: req.user.id
        });

        return res.status(200).json({ message: "Url generate successfully", newRec });
    } catch (error) {
        console.log("Error while creating short url", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

export const getRedirectUrl = async (req: Request, res: Response) => {
    try {
        const { shortId } = req.params;
        const record = await Url.findOneAndUpdate({
            shortId
        }, { $inc: { clicks: 1 } })
        if (!record) return res.status(404).json({ message: "Not found" });
        return res.redirect(record.originalUrl);
    } catch (error) {
        console.error("Error while redirecting URL:", error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
}